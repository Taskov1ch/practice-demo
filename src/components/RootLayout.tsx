import { useState, useEffect, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import { Howl } from 'howler'
import BackgroundPano from './BackgroundPano'
import PreloadEnterOverlay from './PreloadEnterOverlay'
import AudioContext, { type AudioPack } from '../contexts/AudioContext'
import type { Stage } from '../types/stage'

const ASSETS = [
	'/music/bg_1.mp3',
	'/music/bg_2.mp3',
	'/sound/matchmaking.mp3',
	'/sound/back.mp3',
	'/sound/click.mp3',
	'/assets/grid',
	'/assets/ui-panels',
	'/assets/icons',
]

const RootLayout = () => {
	const [overlayStage, setOverlayStage] = useState<Stage>('preload')
	const [progress, setProgress] = useState(0)
	const [currentAsset, setCurrentAsset] = useState(ASSETS[0])
	const [audio, setAudio] = useState<AudioPack>({})
	const revealTimeoutRef = useRef<number | null>(null)

	useEffect(() => {
		let cancelled = false
		let index = 0
		const total = ASSETS.length
		const step = () => {
			if (cancelled) return
			setCurrentAsset(ASSETS[index])
			setProgress(Math.min(100, Math.round(((index + 1) / total) * 100)))
			index += 1
			if (index < total) {
				setTimeout(step, 120)
			} else {
				setTimeout(() => setOverlayStage('enter'), 300)
			}
		}
		step()
		return () => {
			cancelled = true
		}
	}, [])

	useEffect(() => {
		return () => {
			Object.values(audio).forEach((s) => s?.unload())
		}
	}, [audio])

	useEffect(() => {
		return () => {
			if (revealTimeoutRef.current) {
				window.clearTimeout(revealTimeoutRef.current)
			}
		}
	}, [])

	const handleEnter = () => {
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
			<div className="relative min-h-screen overflow-hidden text-zinc-100">
				<BackgroundPano />
				<div className={`transition-opacity duration-900 ease-out ${overlayStage === 'preload' || overlayStage === 'enter' ? 'opacity-0' : 'opacity-100'}`}>
					<Outlet />
				</div>
				<PreloadEnterOverlay
					stage={overlayStage}
					currentAsset={currentAsset}
					progress={progress}
					onEnter={handleEnter}
				/>
			</div>
		</AudioContext.Provider>
	)
}

export default RootLayout
