import { CharacterInfoInterface } from 'types/play';

export const saveCharacterInfo = (
  e: React.DragEvent<HTMLImageElement>,
  characterInfo: CharacterInfoInterface
) => {
  e.dataTransfer.setData('text/plain', JSON.stringify(characterInfo));
};
