import 'styles/components/user/balloon-title.scss';

interface BalloonTitleProps {
  title: string;
}

const BalloonTitle = ({ title }: BalloonTitleProps) => {
  return <h2 className="balloon-title">{title}</h2>;
};

export default BalloonTitle;
