import { CharacterInfoInterface } from 'types/play';
import 'styles/components/play/character.scss';
import { CHARACTER_MAP } from 'constants/characterMap';
import { useRef } from 'react';
import { saveCharacterInfo } from 'utils/saveCharacterInfo';
import { createShadowImgAndTrackTouch } from 'utils/createShadowImgAndTrackTouch';
import { updateShadowImgAndTrackTouch } from 'utils/updateShadowImgAndTrackTouch';
import { removeShadowImg } from 'utils/removeShadowImg';
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

  const updatePrevPosition = (target: HTMLElement) => {
    const parentSquare = target.closest('.square');

    if (parentSquare) {
      const rowMatch = parentSquare.className.match(/row-(\d+)/);
      const colMatch = parentSquare.className.match(/col-(\d+)/);

      if (rowMatch && colMatch) {
        const row = parseInt(rowMatch[1], 10);
        const col = parseInt(colMatch[1], 10);
        setPrevPosition({ row, col });
      }
    }
  };

  // 모바일 환경
  const handleTouchStart = (e: React.TouchEvent<HTMLImageElement>) => {
    createShadowImgAndTrackTouch(e, characterInfo, imageSrc, dragShadowImgRef);
    setSelectedCharacterKey(characterKey);
    updatePrevPosition(e.currentTarget);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLImageElement>) => {
    updateShadowImgAndTrackTouch(e, dragShadowImgRef);
  };

  const handleTouchEnd = () => {
    removeShadowImg(dragShadowImgRef);
    setSelectedCharacterKey(null);
    setPrevPosition({ row: null, col: null });
  };

  // 웹 환경
  const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => {
    saveCharacterInfo(e, characterInfo);
    setSelectedCharacterKey(characterKey);
    updatePrevPosition(e.currentTarget);
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
