import { Link } from 'react-router-dom'
import { DEFAULT_PLAYER_ID, getPlayerById } from '../data/players'

const HeaderProfile = () => {
	const player = getPlayerById(DEFAULT_PLAYER_ID)

	return (
		<header className="fixed bottom-8 left-8 z-20">
			<Link
				to={`/profile/${player.id}`}
			>
				<div className="inline-flex flex-col">
					<div className="flex items-stretch">
						<div className="relative h-20 w-20 shrink-0 border border-emerald-400/60 bg-zinc-950/40 backdrop-blur-sm">
							<img
								alt="Аватар"
								src={player.avatarUrl}
								className="h-full w-full object-cover"
							/>
						</div>
						<div className="relative h-20 w-64 overflow-hidden border border-l-0 border-emerald-400/30 bg-zinc-950/40">
							<img
								alt="Баннер"
								src={player.bannerUrl}
								className="h-full w-full object-cover"
							/>
						</div>
					</div>
					<div className="flex items-center justify-between border border-t-0 border-emerald-400/30 bg-zinc-950/80 px-4 py-1.5 backdrop-blur-md">
						<span className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-100">
							{player.name}
						</span>
					</div>
				</div>
			</Link>
		</header>
	)
}

export default HeaderProfile
