type ValidationTextProps = {
  text: string;
};

const ValidationText = ({ text }: ValidationTextProps) => {
  return (
    <div className="h-5">
      <p className="text-sm text-red-500 mt-1 ml-1">{text}</p>
    </div>
  );
};
export default ValidationText;
