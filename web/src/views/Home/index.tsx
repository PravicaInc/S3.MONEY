import { FC, ReactNode, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccounts, useWallets } from '@mysten/dapp-kit';

import DistributorIcon from '../../assets/distributor.svg?react';

import AlertIcon from '../../assets/alert_icon.svg?react';
import CashInIcon from '../../assets/cash-in.svg?react';
import CashOutIcon from '../../assets/cash-out.svg?react';
import CreatorIcon from '../../assets/creator.svg?react';
import PlusIcon from '../../assets/plus.svg?react';
import ProjectIcon from '../../assets/projects.svg?react';
import RequestsIcon from '../../assets/requests.svg?react';
import TreasuriesIcon from '../../assets/treasuries.svg?react';
import { Button } from '../../components/Button';
import { Table } from '../../components/Table';
import { Typography } from '../../components/Typography';
import { useCurrentSuiBalance } from '../../hooks/useCurrentBalance.ts';
import { PAGES_URLS, WALLETS } from '../../utils/const.ts';

import styles from './styles.module.css';

const ACCOUNT_TYPES = ['creator', 'cash_in', 'cash_out'] as const;

const Home: FC = () => {
  const navigate = useNavigate();
  const accounts = useAccounts();
  const wallets = useWallets();

  console.log('wallets', wallets);

  const goToProjects = () => navigate(PAGES_URLS.projects);

  return (
    <div className={styles.container}>
      <Table
        title={'Projects'}
        message={'You currently do not have any stablecoin created. Please click “Create New Project” to create one'}
        icon={<ProjectIcon />}
        onClick={goToProjects}
      />
      <Table
        title={'Requests'}
        message={'You currently do not have any requests yet. your requests will appear here once you create a project'}
        icon={<RequestsIcon />}
      />
      <Table
        title={'Treasuries'}
        icon={<TreasuriesIcon />}
        count={accounts.length}
      >
        <div className={styles.info}>
          <AlertIcon />
          <Typography type={'t_xs-400'} style={{ color: 'var(--gray_60)' }}>
            You must create the cash-in and cash-out treasuries to be able
            to allocate and deallocate from the main treasury account
          </Typography>
        </div>
        <div className={styles.cards}>
          {ACCOUNT_TYPES.map((accountType, index) => (
            <Account index={index} key={accountType} />
          ))}
        </div>
      </Table>
      <Table
        title={'Distributors'}
        message={'You currently do not have any distributors yet. your distributors will appear here once you add them'}
        icon={<DistributorIcon />}
      />
    </div>
  );
};

export default Home;

interface IAccountProps {
  index: number;
}

const AccountAssets: { [key in typeof ACCOUNT_TYPES[number]]:
  {name: string; icon: ReactNode; backgroundColor: string; color: string} } = {
    creator: {
      name: 'Creator',
      icon: <CreatorIcon />,
      color: 'var(--primary_100)',
      backgroundColor: 'var(--primary_10)',
    },
    cash_in: {
      name: 'Cash-In',
      icon: <CashInIcon />,
      color: 'var(--success_100)',
      backgroundColor: 'var(--success_10)',
    },
    cash_out: {
      name: 'Cash-Out',
      icon: <CashOutIcon />,
      color: 'var(--gray_80)',
      backgroundColor: 'var(--gray_10)',
    },
  };

const Account:FC<IAccountProps> = ({ index }) => {
  const ref = useRef<SVGSVGElement>(null);
  const accounts = useAccounts();
  const accountType = ACCOUNT_TYPES[index];
  const connectedAddress = accounts[index];
  const assets = AccountAssets[accountType];
  const title = `${assets.name} Account`;
  const { data } = useCurrentSuiBalance(connectedAddress?.address);

  ref.current?.style.setProperty('--progress-value', ((index / ACCOUNT_TYPES.length) * 100).toString());

  return connectedAddress
    ? (
      <div className={styles.card} style={{ background: assets.backgroundColor, color: assets.color }}>
        <div className={styles.title}>
          {assets.icon}
          <Typography type={'t_lg-600'}>
            {title}
          </Typography>
        </div>
        <div className={styles.row}>
          <Typography type={'t_sm-600'} style={{ color: 'var(--gray_60)' }}>
            Address:
          </Typography>
          <Typography type={'t_sm-400'} ellipses copyable style={{ color: 'var(--gray_60)' }}>
            {connectedAddress.address}
          </Typography>
        </div>
        <div className={styles.row}>
          <Typography type={'t_sm-600'} style={{ color: 'var(--gray_60)' }}>
            Balance:
          </Typography>
          <Typography type={'t_sm-400'} style={{ color: 'var(--gray_60)' }}>
            {data || 0}
          </Typography>
        </div>
      </div>
    )
    : (
      <div className={`${styles.card} ${styles.inActive}`}>
        <div className={styles.progress}>
          <svg width="64" height="64" viewBox="0 0 64 64" className={styles.circularProgress} ref={ref}>
            <circle className={styles.bg} />
            <circle className={styles.fg} />
          </svg>
          <Typography type={'t_sm-500'} className={styles.text}>
            {`${index}/${ACCOUNT_TYPES.length}`}
          </Typography>
        </div>
        <Button className={styles.btn}>
          <PlusIcon />
          <Typography type={'t_sm-600'}>
            {`Create ${title}`}
          </Typography>
        </Button>
      </div>
    );
};
