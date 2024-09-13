import { FC, useState } from 'react';

import { Steps } from '../Steps';

import { CBDCIssuerFormValues } from './types.ts';
import { CBDCIssuerForm1 } from './CBDCIssuerForm1';

import styles from './styles.module.css';

export const CBDCIssuerForm: FC = () => {
  const [formData, setFormData] = useState<CBDCIssuerFormValues>();

  return (
    <Steps className={styles.steps}>
      {({ goNext }) => (
        <>
          <CBDCIssuerForm1
            goNext={data => {
              goNext();
              setFormData(data);
            }}
            initialValue={formData}
          />
        </>
      )}
    </Steps>
  );
};
