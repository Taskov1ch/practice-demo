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
									onClick={onEnter}
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
)

export default PreloadEnterOverlay
