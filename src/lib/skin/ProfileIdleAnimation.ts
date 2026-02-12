import { PlayerAnimation, type PlayerObject } from 'skin3d'

export class ProfileIdleAnimation extends PlayerAnimation {
	protected animate(player: PlayerObject): void {
		const t = this.progress
		const skin = player.skin as unknown as {
			body: { position: { y: number }; rotation: { x: number; z: number } }
			head: { rotation: { x: number; y: number; z: number } }
			rightArm: { rotation: { x: number; z: number } }
			leftArm: { rotation: { x: number; z: number } }
			leftLeg: { rotation: { x: number; z: number } }
			rightLeg: { rotation: { x: number; z: number } }
		}
		const cape = player.cape as unknown as { rotation: { x: number; z: number } }

		const breathe = Math.sin(t * 1.5) * 0.011
		skin.body.position.y = -6 + breathe * 8
		skin.body.rotation.z = Math.sin(t * 0.45) * 0.006
		skin.body.rotation.x = Math.sin(t * 0.35) * 0.004

		// Profile idle: subtle look around, no dramatic scans.
		skin.head.rotation.y = Math.sin(t * 0.32) * 0.18
		skin.head.rotation.x = Math.sin(t * 0.5) * 0.03
		skin.head.rotation.z = Math.sin(t * 0.42) * 0.012

		const armBaseZ = Math.PI * 0.02
		skin.rightArm.rotation.z = -armBaseZ - Math.cos(t * 1.2) * 0.03
		skin.leftArm.rotation.z = armBaseZ + Math.cos(t * 1.2 + 0.8) * 0.03
		skin.rightArm.rotation.x = Math.sin(t * 0.72) * 0.12
		skin.leftArm.rotation.x = Math.sin(t * 0.72 + 1.5) * 0.12

		const shift = Math.sin(t * 0.34) * 0.01
		skin.leftLeg.rotation.z = shift
		skin.rightLeg.rotation.z = -shift
		skin.leftLeg.rotation.x = Math.sin(t * 1.3 + 0.25) * 0.012
		skin.rightLeg.rotation.x = Math.sin(t * 1.3 + Math.PI + 0.25) * 0.012

		const capeBase = Math.PI * 0.06
		cape.rotation.x = capeBase + Math.sin(t * 1.0) * 0.015 + Math.sin(t * 2.2) * 0.006
		cape.rotation.z = Math.sin(t * 0.7) * 0.008
	}
}
