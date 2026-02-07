import { useEffect, useMemo, useRef, useState } from 'react'
import { Howl } from 'howler'
import { AnimatePresence, motion } from 'motion/react'
import {
	Check,
	Timer,
	X,
} from 'lucide-react'

type Stage = 'preload' | 'enter' | 'menu' | 'matchmaking' | 'found' | 'accepted'

type AudioPack = {
	bg2?: Howl
	bg1?: Howl
	match?: Howl
	back?: Howl
}

const formatTime = (seconds: number) => {
	const mins = Math.floor(seconds / 60)
	const secs = seconds % 60
	return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
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
	const panoRef = useRef<HTMLDivElement | null>(null)
	const panoTargetRef = useRef({ x: 0, y: 0 })
	const panoCurrentRef = useRef({ x: 0, y: 0 })
	const panoRafRef = useRef<number | null>(null)
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
			<div ref={panoRef} className="absolute inset-0 -z-10 transition-transform duration-300 ease-out">
				<video
					autoPlay
					muted
					loop
					playsInline
					className="h-full w-full object-cover"
					src="/video/bg.mp4"
				/>
				<div className="absolute inset-0 bg-black/60" />
			</div>

			{/* Header: avatar + name + banners */}
			<header className="fixed bottom-8 left-8 z-10">
				<div className="inline-flex flex-col">
					<div className="flex items-stretch">
						<div className="relative h-20 w-20 shrink-0 border border-emerald-400/60 bg-zinc-950/40 backdrop-blur-sm">
							<img
								alt="Аватар"
								src="https://i1.sndcdn.com/artworks-8V7ykLCHuVcoFfJB-1Mjf6w-t500x500.png"
								className="h-full w-full object-cover"
							/>
						</div>
						<div className="relative h-20 w-64 overflow-hidden border border-l-0 border-emerald-400/30 bg-zinc-950/40">
							<img
								alt="Баннер"
								src="https://t4.ftcdn.net/jpg/04/04/73/39/360_F_404733910_2mIXr6RbC5G3WZJFjopVsBaR3EOM6Bqy.jpg"
								className="h-full w-full object-cover"
							/>
						</div>
					</div>
					<div className="border border-t-0 border-emerald-400/30 bg-zinc-950/80 px-4 py-1.5 backdrop-blur-md">
						<span className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-100">
							Taskov1ch
						</span>
					</div>
				</div>
			</header>

			{/* Preload / Enter overlay */}
			<AnimatePresence>
				{(stage === 'preload' || stage === 'enter') && (
					<motion.div
						key="preload-overlay"
						initial={{ opacity: 1 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.6 }}
						className="fixed inset-0 z-50 flex flex-col justify-end bg-black"
					>
						<div className="px-8 pb-8">
							<AnimatePresence mode="wait">
								{stage === 'preload' ? (
									<motion.div
										key="loading"
										initial={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.3 }}
									>
										<p className="mb-4 text-xs uppercase tracking-[0.3em] text-zinc-500">
											<span className="text-zinc-400">Инициализация сети</span>
											<span className="ml-3 font-mono text-zinc-600">{currentAsset}</span>
										</p>
										<div className="flex items-center gap-4">
											<div className="loader h-12 w-12 shrink-0 overflow-visible" />
											<div className="h-1 flex-1 bg-zinc-900">
												<div
													className="h-full bg-emerald-400/80 transition-all duration-150"
													style={{ width: `${progress}%` }}
												/>
											</div>
											<span className="w-10 shrink-0 text-right font-mono text-xs text-zinc-500">{progress}%</span>
										</div>
									</motion.div>
								) : (
									<motion.div
										key="enter"
										initial={{ opacity: 0, y: 8 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.4 }}
										className="flex items-end justify-between gap-8"
									>
										<div>
											<h1 className="text-2xl font-semibold uppercase tracking-[0.3em] text-zinc-100">
												Операция Нексус
											</h1>
											<p className="mt-2 text-xs uppercase tracking-[0.3em] text-zinc-500">
												Система готова // Канал защищён
											</p>
										</div>
										<button
											onClick={handleEnter}
											className="shrink-0 border border-emerald-400/70 bg-emerald-500/10 px-10 py-3.5 text-sm uppercase tracking-[0.4em] text-emerald-300 transition hover:bg-emerald-400/20"
										>
											Войти
										</button>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Center content */}
			<main className="relative z-10 flex min-h-screen items-center justify-center px-6">
				<AnimatePresence mode="wait">
					{(stage === 'menu' || stage === 'matchmaking' || stage === 'found' || stage === 'accepted') && (
						<motion.div
							key="menu"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="w-full"
						>
							<div className="h-[60vh]" />
						</motion.div>
					)}
				</AnimatePresence>
			</main>

			{/* Matchmaking top bar */}
			<AnimatePresence>
				{(stage === 'matchmaking' || stage === 'found') && (
					<motion.div
						initial={{ width: 110, height: 2, opacity: 0, y: -14 }}
						animate={{ width: '100vw', height: 36, opacity: 1, y: 0 }}
						exit={{ width: 110, height: 2, opacity: 0, y: -14 }}
						transition={{ duration: 0.4, ease: 'easeOut' }}
						className={`fixed left-1/2 top-0 z-30 flex -translate-x-1/2 items-center justify-center border-b backdrop-blur-sm ${stage === 'found'
							? 'border-emerald-400 bg-emerald-400 text-black'
							: 'border-emerald-400/40 bg-zinc-950/60 text-zinc-300'
							}`}
					>
						<AnimatePresence mode="wait">
							{stage === 'found' ? (
								<motion.div
									key="found-text"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.3 }}
									className="text-xs font-semibold uppercase tracking-[0.35em]"
								>
									Матч найден
								</motion.div>
							) : (
								<motion.div
									key="search-text"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.3 }}
									className="flex items-center gap-6 text-[0.7rem] uppercase tracking-[0.3em]"
								>
									<span className="font-mono text-emerald-300">{formatTime(elapsed)}</span>
									<span>Поиск соперника...</span>
									<button
										onClick={handleCancel}
										className="flex items-center gap-2 border border-emerald-400/40 px-3 py-1 text-emerald-300 transition hover:bg-emerald-400/10"
									>
										<X size={12} />
										Отмена
									</button>
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Match found modal */}
			<AnimatePresence>
				{stage === 'found' && showFoundModal && (
					<motion.div
						key="found-modal"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm"
					>
						<motion.div
							initial={{ scale: 0.95, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.97, opacity: 0 }}
							className="w-full max-w-md border border-emerald-400/60 bg-zinc-950/90 p-10 text-center backdrop-blur-sm"
						>
							<p className="text-[0.65rem] uppercase tracking-[0.4em] text-zinc-500">Матч найден</p>
							<h3 className="mt-4 text-2xl font-semibold uppercase tracking-[0.3em] text-emerald-300">
								Подтвердите участие
							</h3>
							<div className="mt-6 flex items-center justify-center gap-2.5 text-xs uppercase tracking-[0.3em] text-zinc-400">
								<Timer size={14} className="text-emerald-400" />
								<span>Подтвердить за {countdown}с</span>
							</div>
							<button
								onClick={handleAccept}
								className="mt-8 w-full border border-emerald-400 bg-emerald-500/20 px-8 py-4 text-base uppercase tracking-[0.5em] text-emerald-200 transition hover:bg-emerald-400/30"
							>
								Принять
							</button>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Accepted modal */}
			<AnimatePresence>
				{stage === 'accepted' && (
					<motion.div
						key="accepted-modal"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm"
					>
						<motion.div
							initial={{ scale: 0.95, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.97, opacity: 0 }}
							className="w-full max-w-md border border-emerald-400/50 bg-zinc-950/90 p-10 text-center backdrop-blur-sm"
						>
							<div className="mx-auto flex h-14 w-14 items-center justify-center border border-emerald-400/60">
								<Check className="text-emerald-300" size={24} />
							</div>
							<h3 className="mt-5 text-xl font-semibold uppercase tracking-[0.3em] text-emerald-300">
								Участие подтверждено
							</h3>
							<p className="mt-2 text-xs uppercase tracking-[0.3em] text-zinc-500">
								Синхронизация канала...
							</p>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Play / Cancel button */}
			{(stage === 'menu' || stage === 'matchmaking' || stage === 'found' || stage === 'accepted') && (
				<button
					onClick={handleFindMatch}
					disabled={stage === 'found' || stage === 'accepted'}
					className={`fixed bottom-8 right-8 z-20 border px-14 py-7 text-xl uppercase tracking-[0.55em] backdrop-blur-sm transition ${stage === 'matchmaking'
						? 'border-red-400/80 bg-red-500/10 text-red-300 hover:bg-red-400/20'
						: 'border-emerald-400/80 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-400/20'
						} disabled:cursor-not-allowed disabled:border-emerald-400/20 disabled:text-emerald-400/30`}
				>
					{stage === 'matchmaking' ? 'Отмена' : 'Играть'}
				</button>
			)}
		</div>
	)
}

export default App
