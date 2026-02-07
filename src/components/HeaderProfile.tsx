const HeaderProfile = () => (
	<header className="fixed bottom-8 left-8 z-10">
		<div className="inline-flex flex-col">
			<div className="flex items-stretch">
				<div className="relative h-20 w-20 shrink-0 border border-emerald-400/60 bg-zinc-950/40 backdrop-blur-sm">
					<img
						alt="Аватар"
						src="https://i1.sndcdn.com/artworks-8V7ykLCHuVcoFfJB-1Mjf6w-t500x500.png"
						className="h-full w-full object-cover"
					/>
				</div>
				<div className="relative h-20 w-64 overflow-hidden border border-l-0 border-emerald-400/30 bg-zinc-950/40">
					<img
						alt="Баннер"
						src="https://t4.ftcdn.net/jpg/04/04/73/39/360_F_404733910_2mIXr6RbC5G3WZJFjopVsBaR3EOM6Bqy.jpg"
						className="h-full w-full object-cover"
					/>
				</div>
			</div>
			<div className="border border-t-0 border-emerald-400/30 bg-zinc-950/80 px-4 py-1.5 backdrop-blur-md">
				<span className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-100">
					Taskov1ch
				</span>
			</div>
		</div>
	</header>
)

export default HeaderProfile
