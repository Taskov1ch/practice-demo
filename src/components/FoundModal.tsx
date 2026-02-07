import { AnimatePresence, motion } from 'motion/react'
import { Timer } from 'lucide-react'

type FoundModalProps = {
	open: boolean
	countdown: number
	onAccept: () => void
}

const FoundModal = ({ open, countdown, onAccept }: FoundModalProps) => (
	<AnimatePresence>
		{open && (
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
						onClick={onAccept}
						className="mt-8 w-full border border-emerald-400 bg-emerald-500/20 px-8 py-4 text-base uppercase tracking-[0.5em] text-emerald-200 transition hover:bg-emerald-400/30"
					>
						Принять
					</button>
				</motion.div>
			</motion.div>
		)}
	</AnimatePresence>
)

export default FoundModal
