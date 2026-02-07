import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import type { Stage } from '../types/stage'
import { formatTime } from '../utils/time'

type MatchmakingBarProps = {
	stage: Stage
	elapsed: number
	onCancel: () => void
}

const MatchmakingBar = ({ stage, elapsed, onCancel }: MatchmakingBarProps) => (
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
								onClick={onCancel}
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
)

export default MatchmakingBar
