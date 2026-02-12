import { PlayerAnimation, type PlayerObject } from 'skin3d'

type ActionName =
	| 'look_left_hold'
	| 'look_right_hold'
	| 'inspect_left_hand'
	| 'inspect_right_hand'
	| 'inspect_left_leg'
	| 'inspect_right_leg'
	| 'quick_scan'
	| 'around_scan'

const ACTIONS: ActionName[] = [
	'look_left_hold',
	'look_right_hold',
	'inspect_left_hand',
	'inspect_right_hand',
	'inspect_left_leg',
	'inspect_right_leg',
	'quick_scan',
	'around_scan',
]

export class LivelyIdleAnimation extends PlayerAnimation {
	private initialized = false
	private currentAction: ActionName = 'look_left_hold'
	private lastAction: ActionName | null = null
	private actionStartedAt = 0
	private actionDuration = 0
	private cooldownUntil = 0

	private smooth(x: number): number {
		const clamped = Math.max(0, Math.min(1, x))
		return clamped * clamped * (3 - 2 * clamped)
	}

	private hold01(elapsed: number, rise: number, hold: number, fall: number): number {
		if (elapsed <= 0) return 0
		const total = rise + hold + fall
		if (elapsed >= total) return 0
		if (elapsed < rise) return this.smooth(elapsed / rise)
		if (elapsed < rise + hold) return 1
		return 1 - this.smooth((elapsed - rise - hold) / fall)
	}

	private headScanAround(elapsed: number): number {
		// left (partial) -> hold -> right -> hold -> center
		const p = elapsed
		const leftMove = 0.8
		const leftHold = 1.0
		const toRight = 1.2
		const rightHold = 1.0
		const backCenter = 1.0
		const total = leftMove + leftHold + toRight + rightHold + backCenter
		if (p <= 0 || p >= total) return 0

		const partial = 0.32
		if (p < leftMove) {
			return -partial * this.smooth(p / leftMove)
		}
		if (p < leftMove + leftHold) {
			return -partial
		}
		if (p < leftMove + leftHold + toRight) {
			const x = (p - leftMove - leftHold) / toRight
			return -partial + (partial * 2) * this.smooth(x)
		}
		if (p < leftMove + leftHold + toRight + rightHold) {
			return partial
		}
		const x = (p - leftMove - leftHold - toRight - rightHold) / backCenter
		return partial * (1 - this.smooth(x))
	}

	private randomAction(except: ActionName | null): ActionName {
		const pool = except ? ACTIONS.filter((name) => name !== except) : ACTIONS
		return pool[Math.floor(Math.random() * pool.length)]
	}

	private actionLength(action: ActionName): number {
		switch (action) {
			case 'look_left_hold':
				return 0.9 + 1.2 + 0.9
			case 'look_right_hold':
				return 0.8 + 1.1 + 0.8
			case 'inspect_left_hand':
				return 0.7 + 1.25 + 0.8
			case 'inspect_right_hand':
				return 0.7 + 1.25 + 0.8
			case 'inspect_left_leg':
				return 0.8 + 1.2 + 0.8
			case 'inspect_right_leg':
				return 0.8 + 1.2 + 0.8
			case 'quick_scan':
				return 0.45 + 0.55 + 0.45
			case 'around_scan':
				return 0.8 + 1.0 + 1.2 + 1.0 + 1.0
		}
	}

	private startNextAction(now: number): void {
		this.currentAction = this.randomAction(this.lastAction)
		this.lastAction = this.currentAction
		this.actionStartedAt = now
		this.actionDuration = this.actionLength(this.currentAction)
		this.cooldownUntil = now + this.actionDuration + (0.5 + Math.random() * 1.0)
	}

	protected animate(player: PlayerObject): void {
		const t = this.progress
		if (!this.initialized) {
			this.initialized = true
			this.startNextAction(t)
		}
		if (t >= this.cooldownUntil) {
			this.startNextAction(t)
		}

		const skin = player.skin as unknown as {
			body: { position: { y: number }; rotation: { x: number; z: number } }
			head: { rotation: { x: number; y: number; z: number } }
			rightArm: { rotation: { x: number; z: number } }
			leftArm: { rotation: { x: number; z: number } }
			leftLeg: { rotation: { x: number; z: number } }
			rightLeg: { rotation: { x: number; z: number } }
		}
		const cape = player.cape as unknown as { rotation: { x: number; z: number } }
		const actionElapsed = Math.max(0, t - this.actionStartedAt)
		const inAction = actionElapsed <= this.actionDuration

		let lookLeft = 0
		let lookRight = 0
		let inspectLeftHand = 0
		let inspectRightHand = 0
		let inspectLeftLeg = 0
		let inspectRightLeg = 0
		let quickScan = 0
		let aroundScanY = 0

		if (inAction) {
			switch (this.currentAction) {
				case 'look_left_hold':
					lookLeft = this.hold01(actionElapsed, 0.9, 1.2, 0.9)
					break
				case 'look_right_hold':
					lookRight = this.hold01(actionElapsed, 0.8, 1.1, 0.8)
					break
				case 'inspect_left_hand':
					inspectLeftHand = this.hold01(actionElapsed, 0.7, 1.25, 0.8)
					break
				case 'inspect_right_hand':
					inspectRightHand = this.hold01(actionElapsed, 0.7, 1.25, 0.8)
					break
				case 'inspect_left_leg':
					inspectLeftLeg = this.hold01(actionElapsed, 0.8, 1.2, 0.8)
					break
				case 'inspect_right_leg':
					inspectRightLeg = this.hold01(actionElapsed, 0.8, 1.2, 0.8)
					break
				case 'quick_scan':
					quickScan = this.hold01(actionElapsed, 0.45, 0.55, 0.45)
					break
				case 'around_scan':
					aroundScanY = this.headScanAround(actionElapsed)
					break
			}
		}

		// --- Breathing ---
		const breathe = Math.sin(t * 1.8) * 0.012
		skin.body.position.y = -6 + breathe * 8

		// --- Body micro-sway ---
		skin.body.rotation.z = Math.sin(t * 0.7) * 0.008
			+ lookLeft * 0.04
			- lookRight * 0.04
			+ inspectLeftHand * 0.06
			- inspectRightHand * 0.06
			+ inspectLeftLeg * 0.12
			- inspectRightLeg * 0.12
			+ quickScan * 0.03
		skin.body.rotation.x = Math.sin(t * 0.5) * 0.004
			+ inspectLeftHand * 0.05
			+ inspectRightHand * 0.05
			+ inspectLeftLeg * 0.08
			+ inspectRightLeg * 0.08

		// --- Head: occasional scanning and hand checks ---
		skin.head.rotation.y = Math.sin(t * 0.2) * 0.035
			+ lookLeft * 0.52
			- lookRight * 0.52
			+ inspectLeftHand * 0.2
			- inspectRightHand * 0.2
			+ inspectLeftLeg * 0.18
			- inspectRightLeg * 0.18
			+ quickScan * 0.35
			+ aroundScanY
		skin.head.rotation.x = Math.sin(t * 0.35) * 0.02
			+ inspectLeftHand * 0.33
			+ inspectRightHand * 0.33
			+ inspectLeftLeg * 0.26
			+ inspectRightLeg * 0.26
		skin.head.rotation.z = Math.sin(t * 0.6) * 0.01
			+ lookLeft * 0.03
			- lookRight * 0.03
			- inspectLeftLeg * 0.16
			+ inspectRightLeg * 0.16

		// --- Arms: natural asymmetric sway ---
		const armBaseZ = Math.PI * 0.02
		// Right arm: slow principal + faster secondary harmonic
		skin.rightArm.rotation.z = -armBaseZ
			- Math.cos(t * 1.8) * 0.035
			- Math.sin(t * 0.6) * 0.015
			- inspectRightHand * 0.2
			+ inspectLeftLeg * 0.06
			- inspectRightLeg * 0.03
		skin.rightArm.rotation.x = Math.sin(t * 0.9) * 0.04
			- inspectRightHand * 0.95
			- inspectLeftHand * 0.1
			+ inspectLeftLeg * 0.1
			+ inspectRightLeg * 0.22

		// Left arm: slightly different phase for asymmetry
		skin.leftArm.rotation.z = armBaseZ
			+ Math.cos(t * 1.8 + 0.8) * 0.035
			+ Math.sin(t * 0.6 + 1.2) * 0.015
			+ inspectLeftHand * 0.2
			+ inspectRightLeg * 0.06
			- inspectLeftLeg * 0.03
		skin.leftArm.rotation.x = Math.sin(t * 0.9 + 2.0) * 0.04
			- inspectLeftHand * 0.95
			- inspectRightHand * 0.1
			+ inspectRightLeg * 0.1
			+ inspectLeftLeg * 0.22

		// --- Weight shift on legs ---
		const shift = Math.sin(t * 0.45) * 0.012
			+ inspectLeftHand * 0.01
			- inspectRightHand * 0.01
			+ inspectLeftLeg * 0.02
			- inspectRightLeg * 0.02
		skin.leftLeg.rotation.z = shift
		skin.rightLeg.rotation.z = -shift
		// Subtle knee bend that follows breathing
		skin.leftLeg.rotation.x = Math.sin(t * 1.8 + 0.3) * 0.015
			- inspectLeftLeg * 0.36
			+ inspectRightLeg * 0.11
		skin.rightLeg.rotation.x = Math.sin(t * 1.8 + Math.PI + 0.3) * 0.015
			- inspectRightLeg * 0.36
			+ inspectLeftLeg * 0.11

		// --- Cape: gentle breeze ---
		const capeBase = Math.PI * 0.06
		cape.rotation.x = capeBase
			+ Math.sin(t * 1.2) * 0.02
			+ Math.sin(t * 2.7) * 0.008
		cape.rotation.z = Math.sin(t * 0.8) * 0.01
	}
}
