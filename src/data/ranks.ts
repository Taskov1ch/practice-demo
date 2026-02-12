export type RankId =
	| 'warrior'
	| 'elite'
	| 'master'
	| 'grandmaster'
	| 'epic'
	| 'legend'
	| 'mythic'
	| 'mythic_honor'
	| 'mythic_glory'
	| 'mythic_immortal'

export type RankMeta = {
	id: RankId
	name: string
	nameClass: string
	badgeClass: string
	starClass: string
}

export const RANKS: Record<RankId, RankMeta> = {
	warrior: {
		id: 'warrior',
		name: 'Воин',
		nameClass: 'text-zinc-300',
		badgeClass: 'border-zinc-500/35 bg-zinc-900/60',
		starClass: 'text-zinc-400',
	},
	elite: {
		id: 'elite',
		name: 'Элита',
		nameClass: 'text-emerald-300 drop-shadow-[0_0_4px_rgba(52,211,153,0.35)]',
		badgeClass: 'border-emerald-300/40 bg-emerald-500/8',
		starClass: 'text-emerald-300/85',
	},
	master: {
		id: 'master',
		name: 'Мастер',
		nameClass: 'text-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.42)]',
		badgeClass: 'border-cyan-300/45 bg-cyan-500/10',
		starClass: 'text-cyan-300/90',
	},
	grandmaster: {
		id: 'grandmaster',
		name: 'Грандмастер',
		nameClass: 'text-sky-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]',
		badgeClass: 'border-sky-300/50 bg-sky-500/12',
		starClass: 'text-sky-300/95',
	},
	epic: {
		id: 'epic',
		name: 'Эпик',
		nameClass: 'text-violet-300 drop-shadow-[0_0_10px_rgba(167,139,250,0.58)]',
		badgeClass: 'border-violet-300/55 bg-violet-500/14',
		starClass: 'text-violet-300',
	},
	legend: {
		id: 'legend',
		name: 'Легенда',
		nameClass: 'text-amber-300 drop-shadow-[0_0_11px_rgba(252,211,77,0.62)]',
		badgeClass: 'border-amber-300/55 bg-amber-500/14',
		starClass: 'text-amber-300',
	},
	mythic: {
		id: 'mythic',
		name: 'Мифический',
		nameClass: 'text-rose-200 drop-shadow-[0_0_12px_rgba(251,113,133,0.62)]',
		badgeClass: 'border-rose-300/55 bg-rose-500/14',
		starClass: 'text-rose-200',
	},
	mythic_honor: {
		id: 'mythic_honor',
		name: 'Мифическая честь',
		nameClass: 'text-fuchsia-200 drop-shadow-[0_0_13px_rgba(232,121,249,0.68)]',
		badgeClass: 'border-fuchsia-300/60 bg-fuchsia-500/15',
		starClass: 'text-fuchsia-200',
	},
	mythic_glory: {
		id: 'mythic_glory',
		name: 'Мифическая слава',
		nameClass: 'text-emerald-200 drop-shadow-[0_0_13px_rgba(16,185,129,0.72)]',
		badgeClass: 'border-emerald-200/65 bg-emerald-500/15',
		starClass: 'text-emerald-200',
	},
	mythic_immortal: {
		id: 'mythic_immortal',
		name: 'Мифический бессмертный',
		nameClass: 'text-emerald-100 drop-shadow-[0_0_16px_rgba(16,185,129,0.72)] [text-shadow:0_0_15px_rgba(0,0,0,0.92),0_0_12px_rgba(16,185,129,0.55)]',
		badgeClass: 'border-emerald-100/70 bg-black/55',
		starClass: 'text-emerald-100 drop-shadow-[0_0_8px_rgba(16,185,129,0.72)]',
	},
}

export const getRankMeta = (rankId: RankId) => RANKS[rankId]

const ROMAN_STAGES = ['I', 'II', 'III', 'IV', 'V'] as const

export const getRankStage = (stars: number) => {
	const idx = Math.max(0, Math.min(ROMAN_STAGES.length - 1, stars - 1))
	return ROMAN_STAGES[idx]
}

export const getRankLabel = (rankId: RankId, stars: number) => `${getRankMeta(rankId).name} ${getRankStage(stars)}`
