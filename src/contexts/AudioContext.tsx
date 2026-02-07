import { createContext, useContext } from 'react'
import type { Howl } from 'howler'

export type AudioPack = {
	bg2?: Howl
	bg1?: Howl
	match?: Howl
	back?: Howl
}

const AudioContext = createContext<AudioPack>({})

export const useAudio = () => useContext(AudioContext)

export default AudioContext
