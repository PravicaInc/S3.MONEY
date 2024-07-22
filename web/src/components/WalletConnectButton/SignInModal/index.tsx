import React, { FC } from 'react';

import AlertIcon from '../../../assets/alert_icon.svg?react';
import LoginIcon from '../../../assets/login-modal.svg?react';
import { Modal } from '../../Modal';
import { Typography } from '../../Typography';

import styles from './styles.module.css';

const STEPS = [
  'Open SUI \nWallet Extension', 'Click \n“More Options”',
  'Create a New \nPassphrase Account', 'Connect to \nS3.money',
];

export interface IProps {
  children: ((options: { showModal: () => void }) => React.ReactNode) | React.ReactNode;
  onProceed: () => Promise<void>;
  inProcess?: boolean;
  error?: string;
}

export const SignInModal: FC<IProps> = ({ onProceed, inProcess, error, children }) => (
  <Modal
    onConfirm={onProceed}
    element={children}
    cancelButtonProps={{ className: styles.cancel }}
    okButtonProps={{ loading: inProcess, className: styles.ok }}
    okText={'Connect Passphrase Wallet'}
  >
    <LoginIcon style={{ marginTop: '3rem' }} />
    <Typography type={'t_xl-600'} style={{ marginTop: '2rem', color: 'var(--gray_90)' }}>
      Connect Your Passphrase Wallet
    </Typography>
    <Typography
      type={'t_md-400'}
      style={{ color: 'var(--gray_60)', margin: '0.8rem 0 6rem' }}
      highlightStyle={{ fontWeight: 700 }}
      searchWords={['Passphrase wallet is required']}
    >
      For enhanced security and a smoother experience, connecting your Passphrase wallet is required.
    </Typography>
    <Typography
      type={'t_md-400'}
      style={{ color: 'var(--gray_60)', marginBottom: '3rem' }}
    >
      New to Sui Wallet? No problem! We'll guide you through
      creating your Passphrase wallet for easy access to S3.money.
    </Typography>
    <div className={styles.steps}>
      {STEPS.map(
        (step, index) => (
          <div key={step + index} className={styles.step}>
            <div
              className={styles.counter}
            >
              {(STEPS.length - 1) !== index && <div className={styles.line} />}
              {index + 1}
            </div>
            <Typography style={{ whiteSpace: 'pre-line', width: '100%', color: 'var(--gray_60)' }} type={'t_xs-400'}>
              {step}
            </Typography>
          </div>
        )
      )}
    </div>
    {error && (
      <div className={styles.error}>
        <AlertIcon />
        <Typography type={'t_xs-400'} style={{ color: 'var(--gray_60)' }}>
          {error}
        </Typography>
      </div>
    )}
  </Modal>
);
