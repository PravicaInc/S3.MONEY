import { FC, useState } from 'react';

import { Steps } from '../Steps';

import { DistributorForm1Values, DistributorForm2Values, DistributorFormValues } from './types.ts';
import { DistributorForm1 } from './DistributorForm1';
import { DistributorForm2 } from './DistributorForm2';

import styles from './styles.module.css';

export const DistributorForm: FC = () => {
  const [formData, setFormData] = useState<DistributorFormValues>();

  return (
    <Steps className={styles.steps} progress>
      {({ goNext, goBack }) => (
        <>
          <DistributorForm1
            goNext={(data: DistributorForm1Values) => {
              goNext();
              setFormData(prevState => ({ ...prevState, ...data }) as DistributorFormValues);
            }}
            initialValue={formData}
            goBack={goBack}
          />
          <DistributorForm2
            goNext={(data: DistributorForm2Values) => {
              setFormData(prevState => ({ ...prevState, ...data }) as DistributorFormValues);
            }}
            initialValue={formData}
            goBack={goBack}
          />
        </>
      )}
    </Steps>
  );
};
