import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import HeaderProfile from './components/HeaderProfile'
import SkinViewer from './components/SkinViewer'
import MatchmakingBar from './components/MatchmakingBar'
import FoundModal from './components/FoundModal'
import AcceptedModal from './components/AcceptedModal'
import PlayButton from './components/PlayButton'
import LobbyHudOverlay from './components/LobbyHudOverlay'
import BattlePassCard from './components/BattlePassCard'
import KeyboardKey from './components/KeyboardKey'
import { useAudio } from './contexts/AudioContext'

type MenuStage = 'menu' | 'matchmaking' | 'found' | 'accepted'

function App() {
	const audio = useAudio()
	const [stage, setStage] = useState<MenuStage>('menu')
	const [elapsed, setElapsed] = useState(0)
	const [countdown, setCountdown] = useState(10)
	const [showFoundModal, setShowFoundModal] = useState(false)
	const matchTimeoutRef = useRef<number | null>(null)
	const acceptTimeoutRef = useRef<number | null>(null)
	const foundModalTimeoutRef = useRef<number | null>(null)
	const bg1ActiveRef = useRef(false)
	const prevShowFoundModalRef = useRef(false)
	const [isDesktopPointer, setIsDesktopPointer] = useState(() => window.matchMedia('(pointer: fine)').matches)

	useEffect(() => {
		if (stage !== 'matchmaking') return
		const timeout = window.setTimeout(() => {
			setShowFoundModal(false)
			setCountdown(10)
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
		const timer = window.setInterval(() => {
			setElapsed((prev) => prev + 1)
		}, 1000)
		return () => window.clearInterval(timer)
	}, [stage])

	useEffect(() => {
		if (stage !== 'found') return
		const modalTimeout = window.setTimeout(() => {
			setShowFoundModal(true)
		}, 1500)
		foundModalTimeoutRef.current = modalTimeout
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
		const { bg1, bg2 } = audio
		if (!bg1 || !bg2) return

		const modalJustAppeared = showFoundModal && !prevShowFoundModalRef.current
		prevShowFoundModalRef.current = showFoundModal

		if (modalJustAppeared) {
			bg1ActiveRef.current = true
			bg2.stop()
			bg1.stop()
			bg1.off('end')
			bg1.once('end', () => {
				bg1ActiveRef.current = false
				if (bg2 && !bg2.playing()) bg2.play()
			})
			bg1.play()
			return
		}

		if (bg1ActiveRef.current || bg1.playing()) {
			bg1ActiveRef.current = true
			return
		}

		if (stage === 'menu' || stage === 'matchmaking' || stage === 'accepted') {
			if (!bg2.playing()) bg2.play()
		}
	}, [stage, audio, showFoundModal])

	useEffect(() => {
		const pointerQuery = window.matchMedia('(pointer: fine)')
		const handlePointerMode = () => setIsDesktopPointer(pointerQuery.matches)
		handlePointerMode()
		pointerQuery.addEventListener('change', handlePointerMode)
		return () => pointerQuery.removeEventListener('change', handlePointerMode)
	}, [])

	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (stage === 'matchmaking' || stage === 'found') {
				e.preventDefault()
				e.returnValue = 'Идет поиск матча. Вы уверены, что хотите покинуть страницу?'
				return 'Идет поиск матча. Вы уверены, что хотите покинуть страницу?'
			}
		}

		window.addEventListener('beforeunload', handleBeforeUnload)

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload)
		}
	}, [stage])

	useEffect(() => {
		return () => {
			if (matchTimeoutRef.current) window.clearTimeout(matchTimeoutRef.current)
			if (acceptTimeoutRef.current) window.clearTimeout(acceptTimeoutRef.current)
			if (foundModalTimeoutRef.current) window.clearTimeout(foundModalTimeoutRef.current)
		}
	}, [])

	useEffect(() => {
		const handleHotkeys = (event: KeyboardEvent) => {
			if (event.repeat) return

			if (event.key === 'ArrowLeft') {
				if (stage === 'menu') {
					event.preventDefault()
					handleFindMatch()
					return
				}
				if (stage === 'matchmaking' || stage === 'found') {
					event.preventDefault()
					handleCancel()
				}
				return
			}

			if (event.key === ' ' || event.code === 'Space') {
				if (stage === 'found' && showFoundModal) {
					event.preventDefault()
					handleAccept()
				}
			}
		}

		window.addEventListener('keydown', handleHotkeys)
		return () => window.removeEventListener('keydown', handleHotkeys)
	}, [stage, showFoundModal, audio])

	const handleFindMatch = () => {
		if (stage === 'matchmaking' || stage === 'found') {
			handleCancel()
			return
		}
		setElapsed(0)
		setCountdown(10)
		setShowFoundModal(false)
		setStage('matchmaking')
		audio.match?.play()
	}

	const handleCancel = () => {
		setStage('menu')
		audio.back?.play()
	}

	const handleAccept = () => {
		setStage('accepted')
		if (acceptTimeoutRef.current) window.clearTimeout(acceptTimeoutRef.current)
		acceptTimeoutRef.current = window.setTimeout(() => {
			setStage('menu')
		}, 3000)
	}

	const isMatchmakingActive = stage === 'matchmaking' || stage === 'found'
	const isMatchmakingOnly = stage === 'matchmaking'

	return (
		<>
			{/* HeaderProfile с блокировкой во время матчмейкинга */}
			<div className={isMatchmakingActive ? 'opacity-80' : ''}>
				<HeaderProfile />
			</div>

			<main className={`relative flex h-full items-end justify-center pb-8 ${isMatchmakingOnly ? 'z-40 opacity-90' : 'z-10'}`}>
				<AnimatePresence mode="wait">
					<motion.div
						key="menu"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="flex items-center justify-center"
					>
						<SkinViewer variant="lobby" />
					</motion.div>
				</AnimatePresence>
			</main>

			{isMatchmakingOnly && (
				<div
					aria-hidden
					className="fixed inset-0 z-30"
				/>
			)}

			<LobbyHudOverlay />
			<BattlePassCard />
			{isDesktopPointer && (
				<div className="pointer-events-none fixed bottom-[3px] right-6 z-20 flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.22em] text-zinc-400/80">
					{isMatchmakingActive ? (
						<>
							<KeyboardKey>←</KeyboardKey>
							<span>- Отмена поиска</span>
						</>
					) : (
						<>
							<KeyboardKey>←</KeyboardKey>
							<span>- Играть</span>
						</>
					)}
				</div>
			)}
			<MatchmakingBar stage={stage} elapsed={elapsed} />
			<FoundModal open={stage === 'found' && showFoundModal} countdown={countdown} onAccept={handleAccept} />
			<AcceptedModal open={stage === 'accepted'} />
			<PlayButton stage={stage} onFindMatch={handleFindMatch} />
		</>
	)
}

export default App
