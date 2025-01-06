import { create } from 'zustand';
import { CharacterPosition } from 'types/play';

interface CharacterState {
  selectedCharacterKey: string | null;
  prevPosition: CharacterPosition;
  setSelectedCharacterKey: (key: string | null) => void;
  setPrevPosition: (position: CharacterPosition) => void;
}

export const usePlayStore = create<CharacterState>((set) => ({
  selectedCharacterKey: null,
  prevPosition: { row: null, col: null },
  setSelectedCharacterKey: (key) => set({ selectedCharacterKey: key }),
  setPrevPosition: (position) => set({ prevPosition: position }),
}));
