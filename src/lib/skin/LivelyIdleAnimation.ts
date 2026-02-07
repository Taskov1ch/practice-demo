import { PlayerAnimation, type PlayerObject } from 'skin3d'

export class LivelyIdleAnimation extends PlayerAnimation {
	protected animate(player: PlayerObject): void {
		const t = this.progress
		const skin = player.skin as unknown as {
			body: { position: { y: number }; rotation: { x: number; z: number } }
			rightArm: { rotation: { x: number; z: number } }
			leftArm: { rotation: { x: number; z: number } }
			leftLeg: { rotation: { x: number; z: number } }
			rightLeg: { rotation: { x: number; z: number } }
		}
		const cape = player.cape as unknown as { rotation: { x: number; z: number } }

		// --- Breathing ---
		const breathe = Math.sin(t * 1.8) * 0.012
		skin.body.position.y = -6 + breathe * 8

		// --- Body micro-sway ---
		skin.body.rotation.z = Math.sin(t * 0.7) * 0.008
		skin.body.rotation.x = Math.sin(t * 0.5) * 0.004

		// --- Arms: natural asymmetric sway ---
		const armBaseZ = Math.PI * 0.02
		// Right arm: slow principal + faster secondary harmonic
		skin.rightArm.rotation.z = -armBaseZ
			- Math.cos(t * 1.8) * 0.035
			- Math.sin(t * 0.6) * 0.015
		skin.rightArm.rotation.x = Math.sin(t * 0.9) * 0.04

		// Left arm: slightly different phase for asymmetry
		skin.leftArm.rotation.z = armBaseZ
			+ Math.cos(t * 1.8 + 0.8) * 0.035
			+ Math.sin(t * 0.6 + 1.2) * 0.015
		skin.leftArm.rotation.x = Math.sin(t * 0.9 + 2.0) * 0.04

		// --- Weight shift on legs ---
		const shift = Math.sin(t * 0.45) * 0.012
		skin.leftLeg.rotation.z = shift
		skin.rightLeg.rotation.z = -shift
		// Subtle knee bend that follows breathing
		skin.leftLeg.rotation.x = Math.sin(t * 1.8 + 0.3) * 0.015
		skin.rightLeg.rotation.x = Math.sin(t * 1.8 + Math.PI + 0.3) * 0.015

		// --- Cape: gentle breeze ---
		const capeBase = Math.PI * 0.06
		cape.rotation.x = capeBase
			+ Math.sin(t * 1.2) * 0.02
			+ Math.sin(t * 2.7) * 0.008
		cape.rotation.z = Math.sin(t * 0.8) * 0.01
	}
}
