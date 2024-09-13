import { FC, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import Pattern from '../../../assets/sign-in-pattern.svg?react';
import { CBDCIssuerForm } from '../../../components/CBDCIssuerForm';
import { DistributorForm } from '../../../components/DistributorForm';
import { RegulatorForm } from '../../../components/RegulatorForm';
import { Select } from '../../../components/Select';
import { StablecoinIssuerForm } from '../../../components/StablecoinIssuerForm';
import { Tip } from '../../../components/Tip';
import { Typography } from '../../../components/Typography';
import { OnboardingContext } from '../../../contexts/onboarding.tsx';
import { IOption, USER_TYPE, USER_TYPES } from '../../../types';

import styles from './styles.module.css';

const TITLES: {[key in USER_TYPE]: string} = {
  Regulator: 'Monitor Tokenized Money',
  Distributor: 'Distribute Stablecoins',
  'CBDC Issuer': 'Code-Free CBDC Creation',
  'Stablecoin Issuer': 'Code-Free Stablecoin Creation',
};

const UserTypeSelectionForms: FC = () => {
  const { selectedUserType, setSelectedUserType } = useContext(OnboardingContext);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const title = `Your Gateway to ${TITLES[selectedUserType]}`;

  const form: {[key in USER_TYPE]: ReactNode} = useMemo(() => ({
    'Stablecoin Issuer': <StablecoinIssuerForm setCurrentStep={setCurrentStep} />,
    Distributor: <DistributorForm />,
    Regulator: <RegulatorForm />,
    'CBDC Issuer': <CBDCIssuerForm />,
  }), []);

  const handleUserTypeChange = useCallback((selected: IOption) => {
    setSelectedUserType(selected.value as USER_TYPE);
  }, []);

  return (
    <div className={styles.container}>
      <Pattern className={styles.pattern1} />
      <Pattern className={styles.pattern2} />
      <div className={styles.part1}>
        <Typography type={'d_xl-700'} searchWords={['S3!']} highlightClassName={styles.s3}>
          Welcome to S3!
        </Typography>
        <Typography type={'d_xs-500'} style={{ marginTop: '2rem', marginBottom: '5rem' }}>
          {title}
        </Typography>
        <Typography type={'t_md-500'} style={{ color: 'var(--gray_50)', marginBottom: '0.8rem' }}>
          You are operating as:
        </Typography>
        <Select
          disabled={currentStep > 0}
          handleChange={handleUserTypeChange}
          value={selectedUserType}
          data={USER_TYPES.map(
            type => ({
              value: type, label: type, icon: type,
            })
          )}
        />
        {currentStep > 0 && selectedUserType === 'Stablecoin Issuer' && (
          <Tip
            className={styles.tip}
            title={'Important Tips'}
            para={[
              {
                text: 'Since this is the testnet phase, you\'ll manually enter the '
                + 'balance of your reserve assets in the selected currency. Be mindful of the following:',
              },
              { text: 'Double-check the entered balance for any typos.', className: styles.tipPoint },
              {
                text: 'Consider simulating a realistic reserve balance that would adequately'
                + ' support the planned issuance of your Stablecoin.',
                className: styles.tipPoint2,
              },
            ]}
          />
        )}
      </div>
      {form[selectedUserType]}
    </div>
  );
};

export default UserTypeSelectionForms;
