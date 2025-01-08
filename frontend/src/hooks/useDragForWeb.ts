import { CharacterInfoInterface } from 'types/play';
import { usePlayStore } from 'stores/playStore';
import { getPrevPosition } from 'utils/getPrevPosition';
import { saveCharacterInfo } from 'utils/saveCharacterInfo';

export const useDragForWeb = (characterInfo: CharacterInfoInterface) => {
  const { setSelectedCharacterKey, setPrevPosition } = usePlayStore();

  const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => {
    saveCharacterInfo(e, characterInfo);
    setSelectedCharacterKey(characterInfo.characterKey);

    const parentSquare = e.currentTarget.closest('.square');

    if (parentSquare instanceof HTMLElement) {
      const position = getPrevPosition(parentSquare);
      setPrevPosition(position);
    }
  };

  return { handleDragStart };
};
