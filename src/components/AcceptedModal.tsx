import { AnimatePresence, motion } from 'motion/react'
import { Check } from 'lucide-react'

type AcceptedModalProps = {
	open: boolean
}

const AcceptedModal = ({ open }: AcceptedModalProps) => (
	<AnimatePresence>
		{open && (
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
						Подключение к матчу...
					</p>
				</motion.div>
			</motion.div>
		)}
	</AnimatePresence>
)

export default AcceptedModal
