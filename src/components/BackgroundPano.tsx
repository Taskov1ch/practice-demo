import { useEffect, useRef } from 'react'

const BackgroundPano = () => {
	const panoRef = useRef<HTMLDivElement | null>(null)
	const panoTargetRef = useRef({ x: 0, y: 0 })
	const panoCurrentRef = useRef({ x: 0, y: 0 })
	const panoRafRef = useRef<number | null>(null)

	useEffect(() => {
		const node = panoRef.current
		if (!node) return
		const update = () => {
			panoRafRef.current = null
			const target = panoTargetRef.current
			const current = panoCurrentRef.current
			current.x += (target.x - current.x) * 0.08
			current.y += (target.y - current.y) * 0.08
			const moveX = current.x * 10
			const moveY = current.y * 6
			node.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) scale(1.03)`
			if (Math.abs(target.x - current.x) > 0.001 || Math.abs(target.y - current.y) > 0.001) {
				panoRafRef.current = window.requestAnimationFrame(update)
			}
		}
		const handleMove = (event: MouseEvent) => {
			const { innerWidth, innerHeight } = window
			const x = (event.clientX / innerWidth - 0.5) * 2
			const y = (event.clientY / innerHeight - 0.5) * 2
			panoTargetRef.current = { x, y }
			if (!panoRafRef.current) {
				panoRafRef.current = window.requestAnimationFrame(update)
			}
		}
		const handleLeave = () => {
			panoTargetRef.current = { x: 0, y: 0 }
			if (!panoRafRef.current) {
				panoRafRef.current = window.requestAnimationFrame(update)
			}
		}
		window.addEventListener('mousemove', handleMove)
		window.addEventListener('mouseleave', handleLeave)
		return () => {
			window.removeEventListener('mousemove', handleMove)
			window.removeEventListener('mouseleave', handleLeave)
			if (panoRafRef.current) window.cancelAnimationFrame(panoRafRef.current)
		}
	}, [])

	return (
		<div ref={panoRef} className="absolute inset-0 -z-10 transition-transform duration-300 ease-out">
			<video
				autoPlay
				muted
				loop
				playsInline
				className="h-full w-full object-cover"
				src="/video/bg.mp4"
			/>
			<div className="absolute inset-0 bg-black/35" />
		</div>
	)
}

export default BackgroundPano
