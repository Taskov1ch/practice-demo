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
			pixelRatio: 'match-device',
		})

		const applyFraming = () => {
			const width = Math.max(container.clientWidth, 1)
			const height = Math.max(container.clientHeight, 1)
			const aspect = width / height

			viewer.fov = 40
			if (isLobbyVariant) {
				const narrow = aspect < 0.62
				viewer.zoom = narrow ? 0.78 : 0.86
				viewer.playerWrapper.position.y = narrow ? -1.25 : -1.38
				viewer.globalLight.intensity = 1.55
				viewer.cameraLight.intensity = 0.95
				viewer.renderer.toneMappingExposure = 1.2
			} else {
				const narrow = aspect < 0.72
				viewer.zoom = narrow ? 0.82 : 0.88
				viewer.playerWrapper.position.y = narrow ? -0.04 : 0.08
				viewer.globalLight.intensity = 1.2
				viewer.cameraLight.intensity = 0.6
				viewer.renderer.toneMappingExposure = 1
			}
			viewer.adjustCameraDistance()
		}

		viewer.autoRotate = false
		viewer.animation = isProfileVariant ? new ProfileIdleAnimation() : new LivelyIdleAnimation()
		viewer.controls.enableRotate = false
		viewer.controls.enableZoom = false
		viewer.controls.enablePan = false
		viewer.background = null

		viewer.canvas.style.width = '100%'
		viewer.canvas.style.height = '100%'
		viewer.canvas.style.cursor = 'grab'
		viewer.canvas.style.touchAction = 'none'
		container.appendChild(viewer.canvas)

		skinViewerRef.current = viewer
		const root = viewer.playerObject as unknown as { rotation: { x: number; y: number } }
		root.rotation.y = isProfileVariant ? (-20 * Math.PI) / 180 : 0
		applyFraming()

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
			root.rotation.y = dragStartRotY + deltaX * pointerSpeed
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
			if (!skinViewerRef.current) return
			skinViewerRef.current.setSize(container.clientWidth, container.clientHeight)
			applyFraming()
		}

		const resizeObserver = new ResizeObserver(handleResize)
		resizeObserver.observe(container)
		window.addEventListener('resize', handleResize)

		return () => {
			viewer.canvas.removeEventListener('pointerdown', handlePointerDown)
			viewer.canvas.removeEventListener('pointermove', handlePointerMove)
			viewer.canvas.removeEventListener('pointerup', stopDragging)
			viewer.canvas.removeEventListener('pointercancel', stopDragging)
			resizeObserver.disconnect()
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
				? 'h-[780px] w-[460px] translate-y-12'
				: 'h-[760px] w-[520px]'}
		/>
	)
}

export default SkinViewer
