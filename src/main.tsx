import { StrictMode, type CSSProperties, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './router'

const DESKTOP_UI_WIDTH = 1360
const DESKTOP_UI_HEIGHT = 760

const MOBILE_USER_AGENT_REGEX =
	/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i

const isMobileDevice = () => {
	const userAgent = navigator.userAgent ?? ''
	const isMobileUserAgent = MOBILE_USER_AGENT_REGEX.test(userAgent)
	const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches
	const hasSmallViewport = window.matchMedia('(max-width: 1024px)').matches

	return isMobileUserAgent || (hasCoarsePointer && hasSmallViewport)
}

const getDesktopScale = () =>
	Math.min(window.innerWidth / DESKTOP_UI_WIDTH, window.innerHeight / DESKTOP_UI_HEIGHT)

const MobileBlocker = () => (
	<div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-6 text-zinc-100">
		<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.22),transparent_55%),radial-gradient(circle_at_bottom,rgba(15,23,42,0.65),transparent_60%)]" />
		<div className="relative w-full max-w-md border border-emerald-400/30 bg-zinc-900/80 p-6 text-center backdrop-blur-sm">
			<p className="title text-lg uppercase tracking-[0.2em] text-emerald-300">Desktop Only</p>
			<p className="mt-3 text-sm uppercase tracking-[0.15em] text-zinc-300">
				Сайт доступен только на ПК.
			</p>
			<p className="mt-2 text-xs uppercase tracking-[0.13em] text-zinc-500">
				Откройте его с компьютера или ноутбука.
			</p>
		</div>
	</div>
)

const AppEntry = () => {
	const [isMobile, setIsMobile] = useState(() => isMobileDevice())
	const [desktopScale, setDesktopScale] = useState(() => getDesktopScale())
	const desktopShellStyle = { '--ui-scale': desktopScale } as CSSProperties

	useEffect(() => {
		const mediaQuery = window.matchMedia('(max-width: 1024px)')
		const updateViewportMode = () => {
			setIsMobile(isMobileDevice())
			setDesktopScale(getDesktopScale())
		}

		updateViewportMode()
		window.addEventListener('resize', updateViewportMode)
		mediaQuery.addEventListener('change', updateViewportMode)

		return () => {
			window.removeEventListener('resize', updateViewportMode)
			mediaQuery.removeEventListener('change', updateViewportMode)
		}
	}, [])

	if (isMobile) return <MobileBlocker />

	return (
		<div
			className="desktop-shell"
			style={desktopShellStyle}
		>
			<RouterProvider router={router} />
		</div>
	)
}

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<AppEntry />
	</StrictMode>,
)
