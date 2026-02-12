import { useEffect, useRef } from 'react'
import { Render } from 'skin3d'
import { LivelyIdleAnimation } from '../lib/skin/LivelyIdleAnimation'
import { ProfileIdleAnimation } from '../lib/skin/ProfileIdleAnimation'
import { DEFAULT_PLAYER_ID, getPlayerById } from '../data/players'

type SkinViewerProps = {
	skinUrl?: string
	variant?: 'lobby' | 'profile'
}

const SkinViewer = ({ skinUrl, variant = 'lobby' }: SkinViewerProps) => {
	const skinContainerRef = useRef<HTMLDivElement | null>(null)
	const skinViewerRef = useRef<Render | null>(null)
	const isLobbyVariant = variant === 'lobby'
	const isProfileVariant = variant === 'profile'

	useEffect(() => {
		const container = skinContainerRef.current
		if (!container || skinViewerRef.current) return
		const resolvedSkinUrl = skinUrl ?? getPlayerById(DEFAULT_PLAYER_ID).skinUrl

		const viewer = new Render({
			width: container.clientWidth,
			height: container.clientHeight,
			skin: resolvedSkinUrl,
		})

		viewer.autoRotate = false
		viewer.animation = isProfileVariant ? new ProfileIdleAnimation() : new LivelyIdleAnimation()
		viewer.controls.enableRotate = false
		viewer.controls.enableZoom = false
		viewer.controls.enablePan = false
		viewer.fov = isLobbyVariant ? 40 : 40
		viewer.zoom = isLobbyVariant ? 1.1 : 1
		viewer.globalLight.intensity = isLobbyVariant ? 1.55 : 1.2
		viewer.cameraLight.intensity = isLobbyVariant ? 0.95 : 0.6
		viewer.renderer.toneMappingExposure = isLobbyVariant ? 1.2 : 1
		viewer.background = null
		viewer.playerWrapper.position.y = isLobbyVariant ? -1.55 : 0

		// Append the auto-created canvas to the container
		viewer.canvas.style.width = '100%'
		viewer.canvas.style.height = '100%'
		viewer.canvas.style.cursor = 'grab'
		viewer.canvas.style.touchAction = 'none'
		container.appendChild(viewer.canvas)

		skinViewerRef.current = viewer
		const root = viewer.playerObject as unknown as { rotation: { x: number; y: number } }
		root.rotation.y = isProfileVariant ? (-20 * Math.PI) / 180 : 0

		let isDragging = false
		let dragStartX = 0
		let dragStartRotY = 0
		const pointerSpeed = 0.01

		const handlePointerDown = (event: PointerEvent) => {
			if (event.button !== 0) return
			isDragging = true
			dragStartX = event.clientX
			dragStartRotY = root.rotation.y
			viewer.canvas.style.cursor = 'grabbing'
			viewer.canvas.setPointerCapture(event.pointerId)
		}

		const handlePointerMove = (event: PointerEvent) => {
			if (!isDragging) return
			const deltaX = event.clientX - dragStartX
			const nextY = dragStartRotY + deltaX * pointerSpeed
			root.rotation.y = nextY
		}

		const stopDragging = () => {
			isDragging = false
			viewer.canvas.style.cursor = 'grab'
		}

		viewer.canvas.addEventListener('pointerdown', handlePointerDown)
		viewer.canvas.addEventListener('pointermove', handlePointerMove)
		viewer.canvas.addEventListener('pointerup', stopDragging)
		viewer.canvas.addEventListener('pointercancel', stopDragging)

		const handleResize = () => {
			if (skinViewerRef.current && container) {
				skinViewerRef.current.width = container.clientWidth
				skinViewerRef.current.height = container.clientHeight
			}
		}
		window.addEventListener('resize', handleResize)

		return () => {
			viewer.canvas.removeEventListener('pointerdown', handlePointerDown)
			viewer.canvas.removeEventListener('pointermove', handlePointerMove)
			viewer.canvas.removeEventListener('pointerup', stopDragging)
			viewer.canvas.removeEventListener('pointercancel', stopDragging)
			window.removeEventListener('resize', handleResize)
			if (skinViewerRef.current) {
				skinViewerRef.current.dispose()
				skinViewerRef.current = null
			}
			container.innerHTML = ''
		}
	}, [skinUrl, isLobbyVariant, isProfileVariant])

	return (
		<div
			ref={skinContainerRef}
			className={isLobbyVariant
				? 'h-[92vh] w-[34rem] max-w-[96vw] translate-y-16 md:translate-y-20'
				: 'h-[82vh] w-[40rem] max-w-[96vw]'}
		/>
	)
}

export default SkinViewer
