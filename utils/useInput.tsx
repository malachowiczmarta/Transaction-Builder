import { useState } from 'react';

type UseInputResult = {
  value: string;
  reset: () => void;
  setValue: (value: string) => void;
  bindings: {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  };
};

function useInput(initialValue: string = ''): UseInputResult {
  const [value, setValue] = useState(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleReset = () => {
    setValue('');
  };

  return {
    value,
    reset: handleReset,
    setValue,
    bindings: {
      value,
      onChange: handleChange
    }
  };
}

export default useInput;
