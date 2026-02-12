const BattlePassCard = () => (
	<div className="pointer-events-none fixed bottom-8 left-8 z-20 select-none">
		<div className="w-80 border border-emerald-400/30 bg-zinc-950/55 p-4 backdrop-blur-sm">
			<div className="flex items-center justify-between">
				<p className="text-[0.62rem] uppercase tracking-[0.3em] text-zinc-400">Боевой пропуск</p>
				<p className="text-xs text-emerald-300/85">Ур. 12</p>
			</div>
			<div className="mt-3 h-1.5 bg-zinc-900/90">
				<div className="h-full w-[42%] bg-emerald-400/80" />
			</div>
			<p className="mt-2 text-[0.68rem] uppercase tracking-[0.24em] text-zinc-500">
				До следующей награды: 580 ОП
			</p>
		</div>
	</div>
)

export default BattlePassCard
