export type PlayerProfile = {
	id: string
	name: string
	avatarUrl: string
	bannerUrl: string
	skinUrl: string
}

export const players: Record<string, PlayerProfile> = {
	'1': {
		id: '1',
		name: 'Taskov1ch',
		avatarUrl: 'https://i1.sndcdn.com/artworks-8V7ykLCHuVcoFfJB-1Mjf6w-t500x500.png',
		bannerUrl: 'https://t4.ftcdn.net/jpg/04/04/73/39/360_F_404733910_2mIXr6RbC5G3WZJFjopVsBaR3EOM6Bqy.jpg',
		skinUrl: 'https://mc-heads.net/skin/759dc5ab-6144-46a0-a844-ce66d08d3a8a',
	},
}

export const DEFAULT_PLAYER_ID = '1'

export const getPlayerById = (id: string) => players[id] ?? players[DEFAULT_PLAYER_ID]
