import { FC, useContext } from 'react';

import CheckedIcon from '../../../assets/checked.svg?react';
import Pattern from '../../../assets/onboarding-pattern.svg?react';
import { Button } from '../../../components/Button';
import { Typography } from '../../../components/Typography';
import { OnboardingContext } from '../../../contexts/onboarding.tsx';

import styles from './styles.module.css';

const UserTypeSubmitted: FC = () => {
  const { selectedUserType } = useContext(OnboardingContext);
  const para = selectedUserType === 'Regulator'
    ? 'Thank you for your interest in shaping the future of tokenized money!'
    + '          We\'ve received your registration as a Regulator.'
    : 'Thank you for your interest in becoming a CBDC leader!'
    + ' We\'ve received your registration for the CBDC issuer user portal.';

  return (
    <div className={styles.container}>
      <Pattern className={styles.pattern1} />
      <div className={styles.card}>
        <div className={styles.icon}>
          <CheckedIcon />
        </div>
        <div className={styles.text}>
          <Typography type={'d_xs-600'}>
            {`Your ${selectedUserType} Registration is Submitted`}
          </Typography>
          <Typography type={'t_sm-400'} style={{ color: 'var(--gray_60)', lineHeight: 1.4 }} >
            {para}
          </Typography>
        </div>
        <Button style={{ height: '5.6rem' }}>
          <Typography type={'t_sm-600'}>
            Select Another Role
          </Typography>
        </Button>
      </div>
    </div>
  );
};

export default UserTypeSubmitted;
