import type { RankId } from './ranks'

export type PlayerStatus = 'online' | 'offline'

export type PlayerProfileStats = {
	favoriteWeapon: string
	favoriteMode: string
	kd: string
	winRate: string
}

export type PlayerRank = {
	tier: RankId
	stars: number
}

export type PlayerProfile = {
	id: string
	name: string
	avatarUrl?: string
	bannerUrl?: string
	skinUrl: string
	status: PlayerStatus
	rank: PlayerRank
	stats: PlayerProfileStats
}

export const players: Record<string, PlayerProfile> = {
	'1': {
		id: '1',
		name: 'Taskov1ch',
		avatarUrl: 'https://i.pinimg.com/736x/39/68/41/39684145bebea9850cf5464f283368ac.jpg',
		bannerUrl: 'https://giffiles.alphacoders.com/221/221617.gif',
		skinUrl: 'https://mc-heads.net/skin/759dc5ab-6144-46a0-a844-ce66d08d3a8a',
		status: 'online',
		rank: {
			tier: 'mythic_glory',
			stars: 5,
		},
		stats: {
			favoriteWeapon: 'Алмазный меч',
			favoriteMode: 'GAPPLE',
			kd: '1.87',
			winRate: '56.2%',
		},
	},
	'2': {
		id: '2',
		name: 'TEANUS',
		avatarUrl: 'https://talk.24serv.pro/user_avatar/talk.24serv.pro/teanus/144/16532_2.png',
		bannerUrl: 'https://cdn.talk.24serv.pro/original/2X/7/7703a02a7954d1a0ebe9ea2850145a0868212440.gif',
		skinUrl: '/04c6f8b86bde5ed3.png',
		status: 'online',
		rank: {
			tier: 'elite',
			stars: 4,
		},
		stats: {
			favoriteWeapon: 'Железный топор',
			favoriteMode: 'Crystals FFA',
			kd: '1.42',
			winRate: '11.7%',
		},
	},
	'3': {
		id: '3',
		name: 'dmitrijafamev',
		avatarUrl: 'https://talk.24serv.pro/user_avatar/talk.24serv.pro/dmitrijafamev/144/18760_2.png',
		bannerUrl: '',
		skinUrl: '/04c6f8b86bde5ed3.png',
		status: 'offline',
		rank: {
			tier: 'warrior',
			stars: 2,
		},
		stats: {
			favoriteWeapon: 'Лук',
			favoriteMode: 'Гонка вооружений',
			kd: '1.15',
			winRate: '8.9%',
		},
	},
	'4': {
		id: '4',
		name: 'Dinner_Bone',
		avatarUrl: 'https://talk.24serv.pro/user_avatar/talk.24serv.pro/dinner_bone/144/19014_2.gif',
		bannerUrl: 'https://cdn.talk.24serv.pro/original/3X/8/1/81929d948bdf2c9a842220dcf6274f868f6d6a80.gif',
		skinUrl: '/04c6f8b86bde5ed3.png',
		status: 'online',
		rank: {
			tier: 'master',
			stars: 5,
		},
		stats: {
			favoriteWeapon: 'Арбалет',
			favoriteMode: 'Арена 2x2',
			kd: '2.03',
			winRate: '19.6%',
		},
	},
	'5': {
		id: '5',
		name: 'dennyomi',
		avatarUrl: 'https://talk.24serv.pro/user_avatar/talk.24serv.pro/dennyomi/144/18813_2.png',
		bannerUrl: 'https://cdn.talk.24serv.pro/original/3X/6/d/6d1b7f9811abc2bb30decd4d49279b649287f270.gif',
		skinUrl: '/04c6f8b86bde5ed3.png',
		status: 'offline',
		rank: {
			tier: 'mythic_immortal',
			stars: 5,
		},
		stats: {
			favoriteWeapon: 'Золотой меч',
			favoriteMode: 'Охота за головами',
			kd: '0.98',
			winRate: '6.4%',
		},
	},
}

export const DEFAULT_PLAYER_ID = '1'

export const LOBBY_FRIEND_IDS = ['2', '3', '4', '5'] as const

export const getPlayerById = (id: string) => players[id] ?? players[DEFAULT_PLAYER_ID]

export const getLobbyFriends = () => LOBBY_FRIEND_IDS.map((id) => getPlayerById(id))
