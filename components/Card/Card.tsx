type CardProps = {
  children: React.ReactNode;
};

const Card = ({ children }: CardProps) => {
  return <div className="p-2 md:p-4">{children}</div>;
};

export default Card;
