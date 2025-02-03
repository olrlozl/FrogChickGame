import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { CharacterPosition } from 'types/play';

interface CharacterState {
  selectedCharacterKey: string | null;
  prevPosition: CharacterPosition;
  setSelectedCharacterKey: (key: string | null) => void;
  setPrevPosition: (position: CharacterPosition) => void;
  clearCharacterState: () => void;
}

export const usePlayStore = create<CharacterState>()(
  devtools(
    (set) => ({
      selectedCharacterKey: null,
      prevPosition: { row: null, col: null },
      setSelectedCharacterKey: (key) => set({ selectedCharacterKey: key }),
      setPrevPosition: (position) => set({ prevPosition: position }),
      clearCharacterState: () =>
        set({
          selectedCharacterKey: null,
          prevPosition: { row: null, col: null },
        }),
    }),
    { name: 'PlayStore' }
  )
);
