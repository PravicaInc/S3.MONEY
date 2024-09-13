import { Dispatch, FC, SetStateAction, useState } from 'react';

import { Steps } from '../Steps';

import { StablecoinIssuerForm1Values, StablecoinIssuerForm2Values, StablecoinIssuerFormValues } from './types.ts';
import { StablecoinIssuerForm1 } from './StablecoinIssuerForm1';
import { StablecoinIssuerForm2 } from './StablecoinIssuerForm2';

import styles from './styles.module.css';

interface IProps {
  setCurrentStep: Dispatch<SetStateAction<number>>;
}

export const StablecoinIssuerForm: FC<IProps> = ({ setCurrentStep }) => {
  const [formData, setFormData] = useState<StablecoinIssuerFormValues>();

  return (
    <Steps className={styles.steps} onStepChange={setCurrentStep} progress>
      {({ goNext, goBack }) => (
        <>
          <StablecoinIssuerForm1
            goNext={(data: StablecoinIssuerForm1Values) => {
              goNext();
              setFormData(prevState => ({ ...prevState, ...data }) as StablecoinIssuerFormValues);
            }}
            initialValue={formData}
            goBack={goBack}
          />
          <StablecoinIssuerForm2
            goNext={(data: StablecoinIssuerForm2Values) => {
              setFormData(prevState => ({ ...prevState, ...data }) as StablecoinIssuerFormValues);
            }}
            initialValue={formData}
            goBack={goBack}
          />
        </>
      )}
    </Steps>
  );
};
