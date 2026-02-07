import { useParams, Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import { getPlayerById } from '../data/players'
import SkinViewer from '../components/SkinViewer'

const ProfilePage = () => {
	const { id } = useParams<{ id: string }>()
	const player = getPlayerById(id ?? '')

	return (
		<>
			{/* Back button */}
			<Link
				to="/"
				className="fixed left-8 top-8 z-20 flex items-center gap-2 border border-emerald-400/40 bg-zinc-950/60 px-4 py-2 text-xs uppercase tracking-[0.3em] text-emerald-300 backdrop-blur-sm transition hover:bg-emerald-400/10"
			>
				<ArrowLeft size={14} />
				Назад
			</Link>

			<main className="relative z-10 flex min-h-screen items-center justify-center">
				<div className="flex items-center gap-16">
					{/* Skin */}
					<AnimatePresence mode="wait">
						<motion.div
							key={player.id}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.5 }}
						>
							<SkinViewer skinUrl={player.skinUrl} />
						</motion.div>
					</AnimatePresence>

					{/* Info card */}
					<AnimatePresence mode="wait">
						<motion.div
							key={player.id + '-info'}
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.5, delay: 0.1 }}
							className="w-80"
						>
							<div className="border border-emerald-400/40 bg-zinc-950/70 backdrop-blur-md">
								{/* Banner */}
								<div className="relative h-28 w-full overflow-hidden">
									<img
										alt="Баннер"
										src={player.bannerUrl}
										className="h-full w-full object-cover"
									/>
									<div className="absolute inset-0 bg-linear-to-t from-zinc-950/90 to-transparent" />
								</div>

								{/* Avatar + name */}
								<div className="-mt-10 px-6 pb-6">
									<div className="relative mb-4 h-20 w-20 border-2 border-emerald-400/60 bg-zinc-950">
										<img
											alt="Аватар"
											src={player.avatarUrl}
											className="h-full w-full object-cover"
										/>
									</div>

									<h1 className="text-xl font-semibold uppercase tracking-[0.25em] text-zinc-100">
										{player.name}
									</h1>

									<div className="mt-3 h-px w-full bg-emerald-400/20" />

									<div className="mt-4 space-y-3">
										<div className="flex items-center justify-between">
											<span className="text-[0.65rem] uppercase tracking-[0.3em] text-zinc-500">ID</span>
											<span className="font-mono text-xs text-zinc-400">{player.id}</span>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-[0.65rem] uppercase tracking-[0.3em] text-zinc-500">Статус</span>
											<span className="flex items-center gap-1.5 text-xs text-emerald-400">
												<span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
												Онлайн
											</span>
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					</AnimatePresence>
				</div>
			</main>
		</>
	)
}

export default ProfilePage
