import { useState, useEffect, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import { Howl } from 'howler'
import BackgroundPano from './BackgroundPano'
import PreloadEnterOverlay from './PreloadEnterOverlay'
import AudioContext, { type AudioPack } from '../contexts/AudioContext'
import type { Stage } from '../types/stage'
import { players } from '../data/players'

const STATIC_ASSETS: string[] = [
	'/video/bg.mp4',
	'/music/bg_1.mp3',
	'/music/bg_2.mp3',
	'/sound/matchmaking.mp3',
	'/sound/back.mp3',
	'/sound/click.mp3',
]

const AUDIO_EXTS = new Set(['mp3', 'wav', 'ogg', 'm4a'])
const VIDEO_EXTS = new Set(['mp4', 'webm', 'mov'])
const IMAGE_EXTS = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'avif'])

const getExtension = (url: string) => {
	const clean = url.split('?')[0].split('#')[0]
	const parts = clean.split('.')
	return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : ''
}

const preloadImage = (url: string, timeoutMs = 20_000) =>
	new Promise<void>((resolve) => {
		const image = new Image()
		let done = false

		const finish = () => {
			if (done) return
			done = true
			window.clearTimeout(timeoutId)
			image.onload = null
			image.onerror = null
			resolve()
		}

		const timeoutId = window.setTimeout(finish, timeoutMs)
		image.onload = finish
		image.onerror = finish
		image.decoding = 'async'
		image.loading = 'eager'
		image.src = url

		if (image.complete) finish()
	})

const preloadMedia = (url: string, type: 'audio' | 'video', timeoutMs = 25_000) =>
	new Promise<void>((resolve) => {
		const media = type === 'audio' ? new Audio() : document.createElement('video')
		let done = false

		const finish = () => {
			if (done) return
			done = true
			window.clearTimeout(timeoutId)
			media.removeEventListener('canplaythrough', finish)
			media.removeEventListener('loadeddata', finish)
			media.removeEventListener('error', finish)
			media.src = ''
			resolve()
		}

		const timeoutId = window.setTimeout(finish, timeoutMs)
		media.preload = 'auto'
		media.addEventListener('canplaythrough', finish, { once: true })
		media.addEventListener('loadeddata', finish, { once: true })
		media.addEventListener('error', finish, { once: true })
		media.src = url
		media.load()
	})

const collectPreloadAssets = () => {
	const dynamicAssets = Object.values(players).flatMap((player) => [
		player.avatarUrl,
		player.bannerUrl,
		player.skinUrl,
	])

	return [...new Set([...STATIC_ASSETS, ...dynamicAssets.filter(Boolean)])]
}

const preloadAsset = (url: string) => {
	const ext = getExtension(url)
	if (AUDIO_EXTS.has(ext)) return preloadMedia(url, 'audio')
	if (VIDEO_EXTS.has(ext)) return preloadMedia(url, 'video')
	if (IMAGE_EXTS.has(ext)) return preloadImage(url)
	return preloadImage(url)
}

type ClickPulse = {
	id: number
	x: number
	y: number
}

const RootLayout = () => {
	const [overlayStage, setOverlayStage] = useState<Stage>('preload')
	const [progress, setProgress] = useState(0)
	const [currentAsset, setCurrentAsset] = useState(STATIC_ASSETS[0])
	const [audio, setAudio] = useState<AudioPack>({})
	const [clickPulses, setClickPulses] = useState<ClickPulse[]>([])
	const revealTimeoutRef = useRef<number | null>(null)
	const clickSoundRef = useRef<Howl | null>(null)
	const pulseIdRef = useRef(0)
	const pulseTimeoutsRef = useRef<number[]>([])

	useEffect(() => {
		let cancelled = false
		const assets = collectPreloadAssets()

		const runPreload = async () => {
			if (assets.length === 0) {
				setProgress(100)
				setOverlayStage('enter')
				return
			}

			for (let index = 0; index < assets.length; index += 1) {
				if (cancelled) return
				const asset = assets[index]
				if (!asset) continue
				setCurrentAsset(asset)
				await preloadAsset(asset)
				if (cancelled) return
				setProgress(Math.min(100, Math.round(((index + 1) / assets.length) * 100)))
			}

			if (!cancelled) {
				setCurrentAsset('Загрузка завершена')
				setOverlayStage('enter')
			}
		}

		void runPreload()

		return () => {
			cancelled = true
		}
	}, [])

	useEffect(() => {
		return () => {
			Object.values(audio).forEach((sound) => sound?.unload())
		}
	}, [audio])

	useEffect(() => {
		return () => {
			if (revealTimeoutRef.current) {
				window.clearTimeout(revealTimeoutRef.current)
			}
		}
	}, [])

	useEffect(() => {
		const clickSound = new Howl({ src: ['/sound/click.mp3'], volume: 0.72, preload: true })
		clickSoundRef.current = clickSound

		const handlePointerDown = (event: PointerEvent) => {
			if (event.pointerType === 'mouse' && event.button !== 0) return
			clickSoundRef.current?.play()

			const id = pulseIdRef.current + 1
			pulseIdRef.current = id
			setClickPulses((prev) => [...prev, { id, x: event.clientX, y: event.clientY }])

			const timeoutId = window.setTimeout(() => {
				setClickPulses((prev) => prev.filter((pulse) => pulse.id !== id))
				pulseTimeoutsRef.current = pulseTimeoutsRef.current.filter((value) => value !== timeoutId)
			}, 430)
			pulseTimeoutsRef.current.push(timeoutId)
		}

		window.addEventListener('pointerdown', handlePointerDown, { passive: true })

		return () => {
			window.removeEventListener('pointerdown', handlePointerDown)
			pulseTimeoutsRef.current.forEach((id) => window.clearTimeout(id))
			pulseTimeoutsRef.current = []
			clickSoundRef.current?.unload()
			clickSoundRef.current = null
		}
	}, [])

	const requestFullscreen = async () => {
		if (document.fullscreenElement) return
		const root = document.documentElement as HTMLElement & {
			webkitRequestFullscreen?: () => Promise<void> | void
			msRequestFullscreen?: () => Promise<void> | void
		}

		try {
			if (root.requestFullscreen) {
				await root.requestFullscreen()
				return
			}
			if (root.webkitRequestFullscreen) {
				await root.webkitRequestFullscreen()
				return
			}
			if (root.msRequestFullscreen) {
				await root.msRequestFullscreen()
			}
		} catch {
			// Ignore blocked fullscreen requests.
		}
	}

	const handleEnter = () => {
		void requestFullscreen()

		const pack: AudioPack = {
			bg2: new Howl({ src: ['/music/bg_2.mp3'], loop: true, volume: 0.6, preload: true }),
			bg1: new Howl({ src: ['/music/bg_1.mp3'], loop: false, volume: 0.8, preload: true }),
			match: new Howl({ src: ['/sound/matchmaking.mp3'], volume: 0.9, preload: true }),
			back: new Howl({ src: ['/sound/back.mp3'], volume: 0.9, preload: true }),
		}
		pack.bg2?.play()
		setAudio(pack)
		setOverlayStage('reveal')
		if (revealTimeoutRef.current) {
			window.clearTimeout(revealTimeoutRef.current)
		}
		revealTimeoutRef.current = window.setTimeout(() => setOverlayStage('menu'), 900)
	}

	return (
		<AudioContext.Provider value={audio}>
			<div className="relative h-full overflow-hidden text-zinc-100">
				<BackgroundPano />
				<div className="desktop-ui-layer">
					<div className={`h-full transition-opacity duration-900 ease-out ${overlayStage === 'preload' || overlayStage === 'enter' ? 'opacity-0' : 'opacity-100'}`}>
						<Outlet />
					</div>
					<PreloadEnterOverlay
						stage={overlayStage}
						currentAsset={currentAsset}
						progress={progress}
						onEnter={handleEnter}
					/>
				</div>
				<div className="pointer-events-none absolute inset-0 z-[60]">
					{clickPulses.map((pulse) => (
						<span
							key={pulse.id}
							className="click-pulse"
							style={{ left: `${pulse.x}px`, top: `${pulse.y}px` }}
						/>
					))}
				</div>
			</div>
		</AudioContext.Provider>
	)
}

export default RootLayout
