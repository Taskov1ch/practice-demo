import { AnimatePresence, motion } from 'motion/react'
import type { Stage } from '../types/stage'

type PreloadEnterOverlayProps = {
	stage: Stage
	currentAsset: string
	progress: number
	onEnter: () => void
}

const PreloadEnterOverlay = ({ stage, currentAsset, progress, onEnter }: PreloadEnterOverlayProps) => (
	<AnimatePresence>
		{(stage === 'preload' || stage === 'enter' || stage === 'reveal') && (
			<motion.div
				key="preload-overlay"
				initial={{ opacity: 1 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.6 }}
				className={`fixed inset-0 z-50 flex flex-col justify-end ${stage === 'reveal' ? 'pointer-events-none' : ''}`}
			>
				<motion.div
					className="pointer-events-none absolute inset-0 z-10 bg-black"
					initial={false}
					animate={{ opacity: stage === 'reveal' ? 0 : 0.72 }}
					transition={{ duration: 0.85, ease: 'easeInOut' }}
				/>
				<motion.div
					className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-[28vh] bg-linear-to-b from-black via-black/95 to-transparent"
					initial={false}
					animate={{ y: stage === 'reveal' ? '-110%' : '0%' }}
					transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
				/>
				<motion.div
					className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-[32vh] bg-linear-to-t from-black via-black/95 to-transparent"
					initial={false}
					animate={{ y: stage === 'reveal' ? '110%' : '0%' }}
					transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
				/>
				<motion.div
					className="relative z-30 px-8 pb-8"
					initial={false}
					animate={{ opacity: stage === 'reveal' ? 0 : 1 }}
					transition={{ duration: 0.35, ease: 'easeOut' }}
				>
					{stage === 'preload' && (
						<div>
							<p className="mb-4 text-xs uppercase tracking-[0.3em] text-zinc-500">
								<span className="text-zinc-400">Подключение к PvP-серверу</span>
								<span className="ml-3 text-zinc-600">{currentAsset}</span>
							</p>
							<div className="flex items-center gap-4">
								<div className="loader h-12 w-12 shrink-0 overflow-visible" />
								<div className="h-1 flex-1 bg-zinc-900">
									<div
										className="h-full bg-emerald-400/80 transition-all duration-150"
										style={{ width: `${progress}%` }}
									/>
								</div>
								<span className="w-10 shrink-0 text-right text-xs text-zinc-500">{progress}%</span>
							</div>
						</div>
					)}
					{(stage === 'enter' || stage === 'reveal') && (
						<motion.div
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.35 }}
							className="flex items-end justify-between gap-8"
						>
							<div>
								<h1 className="text-2xl font-semibold uppercase tracking-[0.3em] text-zinc-100">
									Bedrock PvP Lobby
								</h1>
								<p className="mt-2 text-xs uppercase tracking-[0.3em] text-zinc-500">
									Сервер готов // Подключение установлено
								</p>
							</div>
							<button
								onClick={onEnter}
								disabled={stage === 'reveal'}
								className="shrink-0 border border-emerald-400/70 bg-emerald-500/10 px-10 py-3.5 text-sm uppercase tracking-[0.4em] text-emerald-300 transition hover:bg-emerald-400/20"
							>
								Войти
							</button>
						</motion.div>
					)}
				</motion.div>
			</motion.div>
		)}
	</AnimatePresence>
)

export default PreloadEnterOverlay
