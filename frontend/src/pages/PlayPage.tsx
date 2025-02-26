import { useState } from 'react';
import 'styles/pages/play-page.scss';
import eggwin from 'assets/images/egg-win.png';
import Modal from 'components/common/Modal/Modal';
import UserPlayBox from 'components/play/UserPlayBox';
import CharacterList from 'components/play/CharacterList';
import Board from 'components/play/Board';
import Count from 'components/play/Count';

const PlayPage = () => {
  //// [Modal 사용예시]
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  const rematch = () => {
    closeModal();
  };
  ////

  const [isStartCountVisible, setStartCountVisible] = useState(true);

  const handleStartCountEnd = () => {
    setStartCountVisible(false);
  };

  interface GameInfo {
    option: {
      me: 'chick' | 'frog';
      opponent: 'chick' | 'frog';
    };
    players: {
      me: { nickname: string; wins: number; losses: number };
      opponent: { nickname: string; wins: number; losses: number };
    };
    turn: 'me' | 'opponent';
  }

  const gameInfo: GameInfo = {
    option: { me: 'chick', opponent: 'frog' },
    players: {
      me: { nickname: '아리', wins: 5, losses: 1 },
      opponent: { nickname: '구리여섯글자', wins: 3, losses: 2 },
    },
    turn: 'opponent',
  };

  return (
    <div className="play-page">
      {isStartCountVisible && <Count onEnd={handleStartCountEnd} />}

      <UserPlayBox
        playerType="opponent"
        option={gameInfo.option.opponent}
        userInfo={gameInfo.players.opponent}
        turn={gameInfo.turn}
      />

      <div className="game-box">
        <CharacterList characterOption={gameInfo.option.opponent} />
        <Board />
        <CharacterList characterOption={gameInfo.option.me} />
      </div>

      <UserPlayBox
        playerType="me"
        option={gameInfo.option.me}
        userInfo={gameInfo.players.me}
        turn={gameInfo.turn}
      />

      <Modal
        isOpen={isModalOpen}
        imageSrc={eggwin}
        message="아리 승!"
        messageFontSize="font-xl"
        btns={[
          { label: '재대결', onClick: rematch, type: 'primary' },
          { label: '나가기', onClick: closeModal, type: 'secondary' },
        ]}
      />
    </div>
  );
};

export default PlayPage;
