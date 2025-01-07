import { CharacterInfoInterface } from 'types/play';
import 'styles/components/play/character.scss';
import { CHARACTER_MAP } from 'constants/characterMap';
import { useRef } from 'react';
import { saveCharacterInfo } from 'utils/saveCharacterInfo';
import { createShadowImgAndTrackTouch } from 'utils/createShadowImgAndTrackTouch';
import { updateShadowImgAndTrackTouch } from 'utils/updateShadowImgAndTrackTouch';
import { removeShadowImgAndDispatchEndEvent } from 'utils/removeShadowImgAndDispatchEndEvent';
import { getPrevPosition } from 'utils/getPrevPosition';
import { usePlayStore } from 'stores/playStore';

interface CharacterProps {
  characterInfo: CharacterInfoInterface;
}

const Character = ({ characterInfo }: CharacterProps) => {
  const { characterOption, characterSize, characterKey } = characterInfo;
  const imageSrc = CHARACTER_MAP[characterOption][characterSize];
  const dragShadowImgRef = useRef<HTMLImageElement | null>(null); // 드래그 시 생성되는 쉐도우 이미지 참조
  const { selectedCharacterKey, setSelectedCharacterKey, setPrevPosition } =
    usePlayStore();
  const isSelected = selectedCharacterKey === characterKey;

  // 모바일 환경
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

  // 웹 환경
  const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => {
    saveCharacterInfo(e, characterInfo);
    setSelectedCharacterKey(characterKey);

    const parentSquare = e.currentTarget.closest('.square');

    if (parentSquare instanceof HTMLElement) {
      const position = getPrevPosition(parentSquare);
      setPrevPosition(position);
    }
  };

  return (
    <div
      className={`character ${characterKey} ${isSelected ? 'selected' : ''}`}
    >
      <img
        className={`character-img ${characterOption} ${characterSize}`}
        src={imageSrc}
        alt={`${characterOption} ${characterSize} character`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDragStart={handleDragStart}
      />
    </div>
  );
};

export default Character;
