import type { ReactNode } from 'react'

type KeyboardKeyProps = {
	children: ReactNode
}

const KeyboardKey = ({ children }: KeyboardKeyProps) => (
	<span className="inline-flex h-5 min-w-7 items-center justify-center rounded-[4px] border border-zinc-400/55 bg-linear-to-b from-zinc-200/20 to-zinc-700/30 px-1.5 text-[0.62rem] font-semibold tracking-[0.08em] text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(0,0,0,0.5),0_1px_3px_rgba(0,0,0,0.45)]">
		{children}
	</span>
)

export default KeyboardKey
