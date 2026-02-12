import { useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { getPlayerById } from '../data/players'
import SkinViewer from '../components/SkinViewer'

const ProfilePage = () => {
	const { id } = useParams<{ id: string }>()
	const player = getPlayerById(id ?? '')

	return (
		<main className="relative z-10 flex min-h-screen items-center justify-center">
			<div className="flex w-full max-w-[1520px] items-center justify-between gap-8 px-6 lg:gap-14 lg:px-10">
				{/* Info card */}
				<AnimatePresence mode="wait">
					<motion.div
						key={player.id + '-info'}
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className="w-[30rem] shrink-0 translate-x-3 md:translate-x-8"
					>
						<div className="border border-emerald-400/40 bg-zinc-950/70 backdrop-blur-md">
							{/* Banner */}
							<div className="relative h-36 w-full overflow-hidden">
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

								<div className="mt-4 grid grid-cols-2 gap-3">
									<div className="border border-emerald-400/20 bg-zinc-900/50 p-3">
										<p className="text-[0.6rem] uppercase tracking-[0.28em] text-zinc-500">Ранг</p>
										<p className="mt-2 text-sm text-zinc-200">Престиж V // 142</p>
									</div>
									<div className="border border-emerald-400/20 bg-zinc-900/50 p-3">
										<p className="text-[0.6rem] uppercase tracking-[0.28em] text-zinc-500">Статус</p>
										<p className="mt-2 flex items-center gap-1.5 text-sm text-emerald-400">
											<span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
											Онлайн
										</p>
									</div>
									<div className="border border-emerald-400/20 bg-zinc-900/50 p-3">
										<p className="text-[0.6rem] uppercase tracking-[0.28em] text-zinc-500">Любимое оружие</p>
										<p className="mt-2 text-sm text-zinc-200">MCW 6.8</p>
									</div>
									<div className="border border-emerald-400/20 bg-zinc-900/50 p-3">
										<p className="text-[0.6rem] uppercase tracking-[0.28em] text-zinc-500">Любимый режим</p>
										<p className="mt-2 text-sm text-zinc-200">Resurgence</p>
									</div>
									<div className="border border-emerald-400/20 bg-zinc-900/50 p-3">
										<p className="text-[0.6rem] uppercase tracking-[0.28em] text-zinc-500">K/D</p>
										<p className="mt-2 text-sm text-zinc-200">1.87</p>
									</div>
									<div className="border border-emerald-400/20 bg-zinc-900/50 p-3">
										<p className="text-[0.6rem] uppercase tracking-[0.28em] text-zinc-500">Win Rate</p>
										<p className="mt-2 text-sm text-zinc-200">14.2%</p>
									</div>
								</div>

								<div className="mt-4 border border-emerald-400/20 bg-zinc-900/40 p-3">
									<p className="text-[0.6rem] uppercase tracking-[0.28em] text-zinc-500">ID Профиля</p>
									<p className="mt-2 text-sm text-zinc-300">{player.id}</p>
								</div>
							</div>
						</div>
					</motion.div>
				</AnimatePresence>

				{/* Skin */}
				<AnimatePresence mode="wait">
					<motion.div
						key={player.id}
						initial={{ opacity: 0, x: 24 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.5 }}
						className="ml-auto"
					>
						<SkinViewer skinUrl={player.skinUrl} variant="profile" />
					</motion.div>
				</AnimatePresence>
			</div>
		</main>
	)
}

export default ProfilePage
