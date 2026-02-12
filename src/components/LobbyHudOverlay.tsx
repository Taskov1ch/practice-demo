import { Gem, HelpCircle, Mail, Settings, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getLobbyFriends } from '../data/players'
import { getRankLabel, getRankMeta } from '../data/ranks'

const hudIcons = [
	{ id: 'settings', icon: Settings },
	{ id: 'leaderboard', icon: Trophy },
	{ id: 'mail', icon: Mail },
	{ id: 'help', icon: HelpCircle },
]

const LobbyHudOverlay = () => {
	const friends = getLobbyFriends()

	return (
		<div className="pointer-events-none fixed inset-0 z-20 select-none text-zinc-300">
			<div className="absolute right-8 top-8 flex items-center gap-3">
				<div className="flex items-center gap-2">
					{hudIcons.map(({ id, icon: Icon }) => (
						<div
							key={id}
							className="flex h-9 w-9 items-center justify-center border border-emerald-300/20 bg-zinc-950/35 text-zinc-300/70 backdrop-blur-sm transition-colors hover:border-emerald-300/50 hover:text-emerald-200"
						>
							<Icon size={15} />
						</div>
					))}
				</div>
				<div className="flex h-9 items-center gap-2 border border-emerald-300/20 bg-zinc-950/35 px-3 text-sm tracking-[0.18em] text-zinc-200/85 backdrop-blur-sm">
					<Gem size={13} className="text-emerald-300/85" />
					<span>00,000</span>
				</div>
			</div>

			<div className="pointer-events-auto absolute right-8 top-1/2 w-72 -translate-y-1/2 pl-5">
				<div className="absolute bottom-0 left-0 top-0 w-px bg-linear-to-b from-transparent via-emerald-300/35 to-transparent" />
					<div className="border border-emerald-300/14 bg-zinc-950/28 p-4 backdrop-blur-sm">
						<p className="mb-3 text-[0.66rem] uppercase tracking-[0.32em] text-zinc-400/85">Список друзей</p>
						<div data-testid="friends-list" className="no-scrollbar max-h-56 space-y-2 overflow-y-auto pr-1">
						{friends.map((friend) => {
							const rankMeta = getRankMeta(friend.rank.tier)
							return (
								<div key={friend.name} className="relative flex items-center gap-3 overflow-hidden border border-emerald-300/10 bg-zinc-950/45 p-2.5">
									{friend.bannerUrl && (
										<img
											alt={`Баннер ${friend.name}`}
											src={friend.bannerUrl}
											className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
										/>
									)}
									<div className="pointer-events-none absolute inset-0 bg-zinc-950/65" />
										<Link
											to={`/profile/${friend.id}`}
											data-testid={`friend-link-${friend.id}`}
											className="pointer-events-auto relative z-10 h-8 w-8 overflow-hidden border border-emerald-300/20 bg-zinc-900 transition-colors hover:border-emerald-300/60"
											aria-label={`Открыть профиль ${friend.name}`}
									>
										{friend.avatarUrl ? (
											<img
												alt={`Аватар ${friend.name}`}
												src={friend.avatarUrl}
												className="h-full w-full object-cover"
											/>
										) : (
											<div className="flex h-full w-full items-center justify-center text-xs font-semibold uppercase tracking-[0.08em] text-zinc-200">
												{friend.name.charAt(0)}
											</div>
										)}
									</Link>
									<div className="relative z-10 min-w-0 flex-1">
										<p className="truncate text-xs tracking-[0.18em] text-zinc-200/90">{friend.name}</p>
										<p className={`mt-0.5 flex items-center gap-1.5 text-[0.62rem] uppercase tracking-[0.2em] ${friend.status === 'online' ? 'text-emerald-300/80' : 'text-zinc-500'}`}>
											<span className={`h-1.5 w-1.5 rounded-full ${friend.status === 'online' ? 'bg-emerald-300/80' : 'bg-zinc-500'}`} />
											{friend.status === 'online' ? 'Онлайн' : 'Не в сети'}
										</p>
										<p className={`mt-0.5 text-[0.55rem] uppercase tracking-[0.18em] ${rankMeta.nameClass}`}>
											{getRankLabel(friend.rank.tier, friend.rank.stars)}
										</p>
									</div>
									{friend.status === 'online' && (
										<div className="pointer-events-none relative z-10 flex h-6 w-6 items-center justify-center border border-emerald-300/35 bg-zinc-900/70 text-sm text-emerald-300/80">
											+
										</div>
									)}
								</div>
							)
						})}
					</div>
				</div>
			</div>
			<div className="absolute bottom-40 left-8 w-72">
				<div className="border border-emerald-300/10 bg-zinc-950/20 p-4 backdrop-blur-sm">
					<p className="text-[0.66rem] uppercase tracking-[0.32em] text-zinc-500">Ежедневные задания</p>
					<div className="mt-3 space-y-2 text-xs tracking-[0.08em] text-zinc-400/70">
						<p>Выиграйте 3 матча (0/3)</p>
						<p>Устраните 10 игроков (0/10)</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default LobbyHudOverlay
