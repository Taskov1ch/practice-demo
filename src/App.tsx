import { useEffect, useMemo, useRef, useState } from 'react'
import { Howl } from 'howler'
import { AnimatePresence, motion } from 'motion/react'
import BackgroundPano from './components/BackgroundPano'
import HeaderProfile from './components/HeaderProfile'
import PreloadEnterOverlay from './components/PreloadEnterOverlay'
import SkinViewer from './components/SkinViewer'
import MatchmakingBar from './components/MatchmakingBar'
import FoundModal from './components/FoundModal'
import AcceptedModal from './components/AcceptedModal'
import PlayButton from './components/PlayButton'
import type { Stage } from './types/stage'

type AudioPack = {
	bg2?: Howl
	bg1?: Howl
	match?: Howl
	back?: Howl
}

function App() {
	const assets = useMemo(
		() => [
			'/music/bg_1.mp3',
			'/music/bg_2.mp3',
			'/sound/matchmaking.mp3',
			'/sound/back.mp3',
			'/sound/click.mp3',
			'/assets/grid',
			'/assets/ui-panels',
			'/assets/icons',
		],
		[],
	)

	const audioRef = useRef<AudioPack>({})
	const [stage, setStage] = useState<Stage>('preload')
	const [progress, setProgress] = useState(0)
	const [currentAsset, setCurrentAsset] = useState(assets[0])
	const [audioEnabled, setAudioEnabled] = useState(false)
	const [elapsed, setElapsed] = useState(0)
	const [countdown, setCountdown] = useState(10)
	const [showFoundModal, setShowFoundModal] = useState(false)
	const matchTimeoutRef = useRef<number | null>(null)
	const acceptTimeoutRef = useRef<number | null>(null)
	const foundModalTimeoutRef = useRef<number | null>(null)
	const bg1ActiveRef = useRef(false)
	const prevShowFoundModalRef = useRef(false)

	const ensureAudio = () => {
		if (audioRef.current.bg2) return
		audioRef.current = {
			bg2: new Howl({
				src: ['/music/bg_2.mp3'],
				loop: true,
				volume: 0.6,
				preload: true,
			}),
			bg1: new Howl({
				src: ['/music/bg_1.mp3'],
				loop: false,
				volume: 0.8,
				preload: true,
			}),
			match: new Howl({
				src: ['/sound/matchmaking.mp3'],
				volume: 0.9,
				preload: true,
			}),
			back: new Howl({
				src: ['/sound/back.mp3'],
				volume: 0.9,
				preload: true,
			}),
		}
	}

	useEffect(() => {
		let cancelled = false
		let index = 0
		const total = assets.length
		const step = () => {
			if (cancelled) return
			setCurrentAsset(assets[index])
			const next = Math.min(100, Math.round(((index + 1) / total) * 100))
			setProgress(next)
			index += 1
			if (index < total) {
				setTimeout(step, 120)
			} else {
				setTimeout(() => setStage('enter'), 300)
			}
		}
		step()
		return () => {
			cancelled = true
		}
	}, [assets])

	useEffect(() => {
		if (stage !== 'matchmaking') return
		const timeout = window.setTimeout(() => {
			setStage('found')
		}, 3000 + Math.random() * 3000)
		matchTimeoutRef.current = timeout
		return () => {
			if (matchTimeoutRef.current) {
				window.clearTimeout(matchTimeoutRef.current)
			}
		}
	}, [stage])

	useEffect(() => {
		if (stage !== 'matchmaking') return
		setElapsed(0)
		const timer = window.setInterval(() => {
			setElapsed((prev) => prev + 1)
		}, 1000)
		return () => window.clearInterval(timer)
	}, [stage])

	useEffect(() => {
		if (stage !== 'found') return
		setShowFoundModal(false)
		const modalTimeout = window.setTimeout(() => {
			setShowFoundModal(true)
		}, 1500)
		foundModalTimeoutRef.current = modalTimeout
		setCountdown(10)
		const timer = window.setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					window.clearInterval(timer)
					setStage('menu')
					return 0
				}
				return prev - 1
			})
		}, 1000)
		return () => {
			window.clearInterval(timer)
			if (foundModalTimeoutRef.current) window.clearTimeout(foundModalTimeoutRef.current)
		}
	}, [stage])

	useEffect(() => {
		if (!audioEnabled) return
		const { bg1, bg2 } = audioRef.current
		if (!bg1 || !bg2) return

		// Edge detection: модалка только что появилась (false → true)
		const modalJustAppeared = showFoundModal && !prevShowFoundModalRef.current
		prevShowFoundModalRef.current = showFoundModal

		// Модалка только что появилась — перезапускаем bg1 с начала
		if (modalJustAppeared) {
			bg1ActiveRef.current = true
			bg2.stop()
			bg1.stop()
			bg1.off('end')
			bg1.once('end', () => {
				bg1ActiveRef.current = false
				const { bg2: currentBg2 } = audioRef.current
				if (currentBg2 && !currentBg2.playing()) currentBg2.play()
			})
			bg1.play()
			return
		}

		// bg1 играет — не трогаем ни при каких обстоятельствах
		if (bg1ActiveRef.current || bg1.playing()) {
			bg1ActiveRef.current = true
			return
		}

		// По умолчанию — bg2 в цикле
		if (stage === 'menu' || stage === 'matchmaking' || stage === 'accepted') {
			if (!bg2.playing()) bg2.play()
		}
	}, [stage, audioEnabled, showFoundModal])


	useEffect(() => {
		return () => {
			Object.values(audioRef.current).forEach((sound) => sound?.unload())
			if (matchTimeoutRef.current) window.clearTimeout(matchTimeoutRef.current)
			if (acceptTimeoutRef.current) window.clearTimeout(acceptTimeoutRef.current)
			if (foundModalTimeoutRef.current) window.clearTimeout(foundModalTimeoutRef.current)
		}
	}, [])

	const handleEnter = () => {
		ensureAudio()
		setAudioEnabled(true)
		setStage('menu')
		audioRef.current.bg2?.play()
	}

	const handleFindMatch = () => {
		if (stage === 'matchmaking' || stage === 'found') {
			handleCancel()
			return
		}
		setStage('matchmaking')
		audioRef.current.match?.play()
	}

	const handleCancel = () => {
		setStage('menu')
		audioRef.current.back?.play()
	}

	const handleAccept = () => {
		setStage('accepted')
		if (acceptTimeoutRef.current) window.clearTimeout(acceptTimeoutRef.current)
		acceptTimeoutRef.current = window.setTimeout(() => {
			setStage('menu')
		}, 2000)
	}

	return (
		<div className="relative min-h-screen overflow-hidden text-zinc-100">
			{/* Video background with parallax */}
			<BackgroundPano />

			{/* Header: avatar + name + banners */}
			<HeaderProfile />

			{/* Preload / Enter overlay */}
			<PreloadEnterOverlay
				stage={stage}
				currentAsset={currentAsset}
				progress={progress}
				onEnter={handleEnter}
			/>

			{/* Center content — 3D skin */}
			<main className="relative z-10 flex min-h-screen items-center justify-center">
				<AnimatePresence mode="wait">
					{(stage === 'menu' || stage === 'matchmaking' || stage === 'found' || stage === 'accepted') && (
						<motion.div
							key="menu"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="flex items-center justify-center"
						>
							<SkinViewer />
						</motion.div>
					)}
				</AnimatePresence>
			</main>

			{/* Matchmaking top bar */}
			<MatchmakingBar stage={stage} elapsed={elapsed} onCancel={handleCancel} />

			{/* Match found modal */}
			<FoundModal open={stage === 'found' && showFoundModal} countdown={countdown} onAccept={handleAccept} />

			{/* Accepted modal */}
			<AcceptedModal open={stage === 'accepted'} />

			{/* Play / Cancel button */}
			<PlayButton stage={stage} onFindMatch={handleFindMatch} />
		</div>
	)
}

export default App
