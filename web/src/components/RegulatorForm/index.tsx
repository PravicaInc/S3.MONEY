import { FC, useState } from 'react';

import { Steps } from '../Steps';

import { RegulatorFormValues } from './types.ts';
import { RegulatorForm1 } from './RegulatorForm1';

import styles from './styles.module.css';

export const RegulatorForm: FC = () => {
  const [formData, setFormData] = useState<RegulatorFormValues>();

  return (
    <Steps className={styles.steps}>
      {({ goNext }) => (
        <>
          <RegulatorForm1
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
