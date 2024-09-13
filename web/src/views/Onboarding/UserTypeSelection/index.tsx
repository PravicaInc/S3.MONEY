import { Dispatch, FC, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Pattern from '../../../assets/onboarding-pattern.svg?react';
import { Button } from '../../../components/Button';
import { Typography } from '../../../components/Typography';
import { OnboardingContext } from '../../../contexts/onboarding.tsx';
import { USER_TYPE, USER_TYPES } from '../../../types';
import { PAGES_URLS } from '../../../utils/const.ts';

import { AccountInfo } from './AccountInfo';

import styles from './styles.module.css';

const UserTypeSelection: FC = () => {
  const { selectedUserType, setSelectedUserType } = useContext(OnboardingContext);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate(PAGES_URLS.userTypeSelectionForms);
  };

  return (
    <div className={styles.container}>
      <Pattern className={styles.pattern1} />
      <div style={{ width: '45%', zIndex: 10 }}>
        <Typography type={'d_xl-700'} searchWords={['S3!']} highlightClassName={styles.s3}>
          Welcome to S3!
        </Typography>
        <div style={{ marginTop: '2rem', marginBottom: '5rem' }}>
          <Typography type={'d_xs-500'}>
            Choose the Account That Fits Your Needs
          </Typography>
        </div>
        <div style={{ marginBottom: '2rem' }}>
          <Typography type={'t_lg-400'}>
            Continue as:
          </Typography>
        </div>
        <div className={styles.cards}>
          {USER_TYPES.map(type => (
            <UserType
              key={type}
              type={type}
              selectedUserType={selectedUserType}
              setSelectedUserType={setSelectedUserType}
            />
          ))}
        </div>
        <Button onClick={handleGetStarted}>
          <Typography type={'t_sm-600'}>
            Get Started
          </Typography>
        </Button>
      </div>
      <AccountInfo selectedUserType={selectedUserType} />
    </div>
  );
};

export default UserTypeSelection;

interface IUserTypeProps {
  type: USER_TYPE;
  selectedUserType: USER_TYPE;
  setSelectedUserType: Dispatch<SetStateAction<USER_TYPE>>;
}
const UserType: FC<IUserTypeProps> = ({ type, setSelectedUserType, selectedUserType }) => {
  const [Icon, setIcon] = useState<ReactNode>();
  const registerOnly = type === 'CBDC Issuer' || type === 'Regulator';
  const isActive = type === selectedUserType;
  const image = `../../../assets/${type.split(' ').join('_')
    .toLowerCase()}.svg?react`;

  useEffect(() => {
    import(/* @vite-ignore */ image)
      .then(icon => {
        setIcon(icon.default);
      })
      .catch(error => console.error('Error while loading the icon: ', error));
  }, [image]);

  const handleClicked = () => {
    setSelectedUserType(type);
  };

  return (
    <div className={`${styles.card} ${isActive && styles.active}`} onClick={handleClicked}>
      {registerOnly && (
        <div className={styles.registerOnly}>
          <Typography type={'t_xss-600'} style={{ fontSize: 10, color: 'var(--base)' }}>
            Register Only
          </Typography>
        </div>
      )}
      {Icon}
      <Typography style={{ color: 'inherit', whiteSpace: 'nowrap' }} type={`t_xs-${isActive ? '600' : '400'}`}>
        {type}
      </Typography>
    </div>
  );
};
