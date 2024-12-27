import 'styles/components/guide/guide-balloon.scss';
import { GuideOptionType } from 'types/guide';

interface GuideBalloonProps {
  option: GuideOptionType;
  onClick: (nextOption: GuideOptionType) => void;
}

const GuideBalloon = ({ option, onClick }: GuideBalloonProps) => {
  const guideTexts = {
    rule: [
      '각 선수는 큰 말, 중간 말, 작은 말 각각 2개씩 갖고 시작합니다.',
      '가로, 세로, 대각선 중 한 줄로 먼저 정렬하면 승리합니다.',
      '10초 초과시 차례가 넘어갑니다.',
    ],
    control: [
      '말판 위의 말 또는 수중의 말을 원하는 칸으로 드래그하세요',
      '빈 칸 또는 더 작은 말 위로 이동할 수 있습니다.',
      '큰 말 속에 숨겨진 작은 말의 위치를 기억하세요.',
    ],
  };

  return (
    <div className={`guide-balloon ${option}`}>
      <div className="button-box">
        <button
          className={option === 'rule' ? 'rule' : 'disabled'}
          onClick={() => onClick('rule')}
        >
          게임방법
        </button>
        <button
          className={option === 'control' ? 'control' : 'disabled'}
          onClick={() => onClick('control')}
        >
          조작방법
        </button>
      </div>
      <ul className={`${option}`}>
        {guideTexts[option].map((guideText) => (
          <li className={`${option}`}>{guideText}</li>
        ))}
      </ul>
    </div>
  );
};

export default GuideBalloon;
