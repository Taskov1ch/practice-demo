import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import HeaderProfile from './components/HeaderProfile'
import SkinViewer from './components/SkinViewer'
import MatchmakingBar from './components/MatchmakingBar'
import FoundModal from './components/FoundModal'
import AcceptedModal from './components/AcceptedModal'
import PlayButton from './components/PlayButton'
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
		return () => {
			if (matchTimeoutRef.current) window.clearTimeout(matchTimeoutRef.current)
			if (acceptTimeoutRef.current) window.clearTimeout(acceptTimeoutRef.current)
			if (foundModalTimeoutRef.current) window.clearTimeout(foundModalTimeoutRef.current)
		}
	}, [])

	const handleFindMatch = () => {
		if (stage === 'matchmaking' || stage === 'found') {
			handleCancel()
			return
		}
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
		}, 2000)
	}

	return (
		<>
			<HeaderProfile />

			<main className="relative z-10 flex min-h-screen items-center justify-center">
				<AnimatePresence mode="wait">
					<motion.div
						key="menu"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="flex items-center justify-center"
					>
						<SkinViewer />
					</motion.div>
				</AnimatePresence>
			</main>

			<MatchmakingBar stage={stage} elapsed={elapsed} onCancel={handleCancel} />
			<FoundModal open={stage === 'found' && showFoundModal} countdown={countdown} onAccept={handleAccept} />
			<AcceptedModal open={stage === 'accepted'} />
			<PlayButton stage={stage} onFindMatch={handleFindMatch} />
		</>
	)
}

export default App
