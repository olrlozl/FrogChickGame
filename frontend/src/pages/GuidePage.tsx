import Logout from 'components/account/Logout';
import GuideBalloon from 'components/guide/GuideBalloon';
import 'styles/pages/guide-page.scss';
import farmer from 'assets/images/farmer.png';
import pond from 'assets/images/pond.png';
import { useState } from 'react';
import { GuideOptionType } from 'types/guide';

const GuidePage = () => {
  const [selectedOption, setSelectedOption] = useState<GuideOptionType>('rule');

  let guideImage = selectedOption === 'rule' ? pond : farmer;

  const handleClickChangeOption = (nextOption: GuideOptionType) => {
    if (nextOption !== selectedOption)
      setSelectedOption((prev) => (prev === 'rule' ? 'control' : 'rule'));
  };

  return (
    <div className="guide-page">
      <GuideBalloon guideOption={selectedOption} onClick={handleClickChangeOption} />
      <img src={guideImage} alt='구리와 농부' />
      <Logout />
    </div>
  );
};

export default GuidePage;
