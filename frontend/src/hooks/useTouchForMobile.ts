import { CharacterInfoInterface } from 'types/play';
import { CHARACTER_MAP } from 'constants/characterMap';
import { usePlayStore } from 'stores/playStore';
import { useRef } from 'react';
import { createShadowImgAndTrackTouch } from 'utils/createShadowImgAndTrackTouch';
import { getPrevPosition } from 'utils/getPrevPosition';
import { updateShadowImgAndTrackTouch } from 'utils/updateShadowImgAndTrackTouch';
import { removeShadowImgAndDispatchEndEvent } from 'utils/removeShadowImgAndDispatchEndEvent';

export const useTouchForMobile = (characterInfo: CharacterInfoInterface) => {
  const { characterOption, characterSize, characterKey } = characterInfo;
  const imageSrc = CHARACTER_MAP[characterOption][characterSize];
  const dragShadowImgRef = useRef<HTMLImageElement | null>(null); // 드래그 시 생성되는 쉐도우 이미지 참조
  const { setSelectedCharacterKey, setPrevPosition } = usePlayStore();

  const handleTouchStart = (e: React.TouchEvent<HTMLImageElement>) => {
    createShadowImgAndTrackTouch(e, characterInfo, imageSrc, dragShadowImgRef);
    setSelectedCharacterKey(characterKey);

    const parentSquare = e.currentTarget.closest('.square');

    if (parentSquare instanceof HTMLElement) {
      const position = getPrevPosition(parentSquare);
      setPrevPosition(position);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLImageElement>) => {
    updateShadowImgAndTrackTouch(e, dragShadowImgRef);
  };

  const handleTouchEnd = () => {
    removeShadowImgAndDispatchEndEvent(dragShadowImgRef);
    setSelectedCharacterKey(null);
    setPrevPosition({ row: null, col: null });
  };

  return { handleTouchStart, handleTouchMove, handleTouchEnd };
};
