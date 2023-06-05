import { useState } from 'react';
import { LOGIN, OTP as OTPStep } from './constants';
import { useNavigate, NavigateOptions } from 'react-router-dom';

const steps = [LOGIN, OTPStep];

export interface HandleStepChangeProps {
  value: string;
  delay?: number;
  navOptions?: NavigateOptions;
}

export default function useStepChange() {
  const navigate = useNavigate();
  const [stepChanging, setStepChanging] = useState(false);
  const [step, setStep] = useState<string>(LOGIN);

  const handleStepChange = ({
    value,
    delay,
    navOptions,
  }: HandleStepChangeProps) => {
    setStepChanging(true);
    const timeoutId = setTimeout(() => {
      if (steps.includes(value)) setStep(value);
      else navigate(value, navOptions);

      setStepChanging(false);
      clearTimeout(timeoutId);
    }, delay || 500);
  };

  return {
    step,
    stepChanging,
    handleStepChange,
  };
}
