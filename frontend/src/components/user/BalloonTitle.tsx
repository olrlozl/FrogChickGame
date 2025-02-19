import 'styles/components/user/balloon-title.scss';
import refresh from 'assets/images/refresh.png';

interface BalloonTitleProps {
  title: string;
  showRefresh?: boolean;
  onClick?: () => void;
}

const BalloonTitle = ({ title, showRefresh, onClick }: BalloonTitleProps) => {
  return (
    <div className="balloon-title">
      <h2>{title}</h2>
      {showRefresh && <img src={refresh} alt="새로고침" onClick={onClick} />}
    </div>
  );
};

export default BalloonTitle;
