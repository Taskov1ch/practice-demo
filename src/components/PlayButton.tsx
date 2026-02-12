import type { Stage } from '../types/stage'

type PlayButtonProps = {
	stage: Stage
	onFindMatch: () => void
}

const PlayButton = ({ stage, onFindMatch }: PlayButtonProps) => (
	(stage === 'menu' || stage === 'matchmaking' || stage === 'found' || stage === 'accepted') && (
		<button
			onClick={onFindMatch}
			disabled={stage === 'found' || stage === 'accepted'}
			data-testid="play-button"
			className={`fixed bottom-8 right-8 border px-14 py-7 text-xl uppercase tracking-[0.55em] backdrop-blur-sm transition title ${stage === 'matchmaking' ? 'z-50' : 'z-20'} ${stage === 'matchmaking'
				? 'border-red-400/80 bg-red-500/10 text-red-300 hover:bg-red-400/20'
				: 'border-emerald-400/80 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-400/20'
				} disabled:cursor-not-allowed disabled:border-emerald-400/20 disabled:text-emerald-400/30`}
		>
			{stage === 'matchmaking' ? 'Отмена' : 'Играть'}
		</button>
	)
)

export default PlayButton
