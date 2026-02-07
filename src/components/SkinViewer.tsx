import { useEffect, useRef } from 'react'
import { Render } from 'skin3d'
import { LivelyIdleAnimation } from '../lib/skin/LivelyIdleAnimation'
import { DEFAULT_PLAYER_ID, getPlayerById } from '../data/players'

type SkinViewerProps = {
	skinUrl?: string
}

const SkinViewer = ({ skinUrl }: SkinViewerProps) => {
	const skinContainerRef = useRef<HTMLDivElement | null>(null)
	const skinViewerRef = useRef<Render | null>(null)
	const headTargetRef = useRef({ x: 0, y: 0 })
	const headCurrentRef = useRef({ x: 0, y: 0 })
	const headRafRef = useRef<number | null>(null)

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
		viewer.animation = new LivelyIdleAnimation()
		viewer.controls.enableRotate = false
		viewer.controls.enableZoom = false
		viewer.controls.enablePan = false
		viewer.fov = 40
		viewer.globalLight.intensity = 1.2
		viewer.cameraLight.intensity = 0.6
		viewer.background = null

		// Append the auto-created canvas to the container
		viewer.canvas.style.width = '100%'
		viewer.canvas.style.height = '100%'
		container.appendChild(viewer.canvas)

		skinViewerRef.current = viewer

		// Head follows mouse (MCBE style)
		const handleMouseMove = (e: MouseEvent) => {
			const nx = (e.clientX / window.innerWidth) * 2 - 1
			const ny = (e.clientY / window.innerHeight) * 2 - 1
			headTargetRef.current = {
				y: nx * 0.6, // horizontal → head Y rotation (max ~34°)
				x: ny * 0.4, // vertical → head X rotation (max ~23°)
			}
		}

		const animateHead = () => {
			const cur = headCurrentRef.current
			const tgt = headTargetRef.current
			const lerp = 0.08
			cur.x += (tgt.x - cur.x) * lerp
			cur.y += (tgt.y - cur.y) * lerp

			if (skinViewerRef.current) {
				const player = skinViewerRef.current.playerObject as unknown as {
					skin: { head: { rotation: { x: number; y: number } } }
				}
				player.skin.head.rotation.x = cur.x
				player.skin.head.rotation.y = cur.y
			}
			headRafRef.current = requestAnimationFrame(animateHead)
		}
		headRafRef.current = requestAnimationFrame(animateHead)
		window.addEventListener('mousemove', handleMouseMove)

		const handleResize = () => {
			if (skinViewerRef.current && container) {
				skinViewerRef.current.width = container.clientWidth
				skinViewerRef.current.height = container.clientHeight
			}
		}
		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('mousemove', handleMouseMove)
			window.removeEventListener('resize', handleResize)
			if (headRafRef.current) cancelAnimationFrame(headRafRef.current)
			if (skinViewerRef.current) {
				skinViewerRef.current.dispose()
				skinViewerRef.current = null
			}
			container.innerHTML = ''
		}
	}, [skinUrl])

	return <div ref={skinContainerRef} className="h-[70vh] w-100" />
}

export default SkinViewer
