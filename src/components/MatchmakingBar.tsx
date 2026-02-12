import { AnimatePresence, motion } from 'motion/react'
import type { Stage } from '../types/stage'
import { formatTime } from '../utils/time'

type MatchmakingBarProps = {
	stage: Stage
	elapsed: number
}

const MatchmakingBar = ({ stage, elapsed }: MatchmakingBarProps) => (
	<AnimatePresence>
		{(stage === 'matchmaking' || stage === 'found') && (
			<motion.div
				initial={{ width: 110, height: 2, opacity: 0, y: -14 }}
				animate={{ width: '100%', height: 36, opacity: 1, y: 0 }}
				exit={{ width: 110, height: 2, opacity: 0, y: -14 }}
				transition={{ duration: 0.4, ease: 'easeOut' }}
				className={`fixed left-1/2 top-0 z-30 flex -translate-x-1/2 items-center justify-center overflow-hidden border-b backdrop-blur-sm ${stage === 'found'
					? 'border-emerald-400 bg-emerald-400 text-black'
					: 'border-emerald-400/40 bg-zinc-950/60 text-zinc-300'
					}`}
			>
				{stage === 'matchmaking' && (
					<>
						<motion.div
							className="pointer-events-none absolute inset-y-0 left-[-18%] w-[18%] bg-linear-to-r from-transparent via-emerald-300/35 to-transparent"
							animate={{ x: ['0%', '760%'] }}
							transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
						/>
						<motion.div
							className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-emerald-300/60"
							animate={{ opacity: [0.25, 0.95, 0.25] }}
							transition={{ duration: 1.15, repeat: Infinity, ease: 'easeInOut' }}
						/>
					</>
				)}
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
							className="relative z-10 flex items-center gap-6 text-[0.7rem] uppercase tracking-[0.3em]"
						>
							<motion.span
								className="text-emerald-300"
								animate={{ opacity: [0.75, 1, 0.75] }}
								transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
							>
								{formatTime(elapsed)}
							</motion.span>
							<span>Поиск соперника...</span>
							<motion.span
								aria-hidden
								className="text-emerald-300/70"
								animate={{ x: [0, 4, 0], opacity: [0.35, 1, 0.35] }}
								transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
							>
								•••
							</motion.span>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>
		)}
	</AnimatePresence>
)

export default MatchmakingBar
