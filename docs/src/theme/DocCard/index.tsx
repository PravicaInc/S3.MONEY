import Link from '@docusaurus/Link';
import { usePluralForm } from '@docusaurus/theme-common';
import {
  findFirstSidebarItemLink,
  useDocById
} from '@docusaurus/theme-common/internal';
import { translate } from '@docusaurus/Translate';
import clsx from 'clsx';
import { type ReactNode } from 'react';

import type {
  PropSidebarItemCategory,
  PropSidebarItemLink
} from '@docusaurus/plugin-content-docs';
import type { Props } from '@theme/DocCard';
import Heading from '@theme/Heading';
import BurnIcon from '../../../static/img/burn-icon.svg';
import CashInIcon from '../../../static/img/cash-in-icon.svg';
import FreezeIcon from '../../../static/img/freeze-icon.svg';
import MintIcon from '../../../static/img/mint-icon.svg';
import PauseIcon from '../../../static/img/pause-square.svg';

import isInternalUrl from '@docusaurus/isInternalUrl';
import { OPERATION_TAB } from './constant';
import styles from './styles.module.css';

function useCategoryItemsPlural() {
  const {selectMessage} = usePluralForm();
  return (count: number) =>
    selectMessage(
      count,
      translate(
        {
          message: '{count} items',
          id: 'theme.docs.DocCard.categoryDescription.plurals',
          description:
            'The default description for a category card in the generated index about how many items this category includes',
        },
        {count},
      ),
    );
}

function CardContainer({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <Link
      href={href}
      className={clsx('card padding--lg', styles.cardContainer)}>
      {children}
    </Link>
  );
}

function CardLayout({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  description?: string;
}): JSX.Element {
  return (
    <CardContainer href={href}>
      <div className={styles.rowContainer}>
      {icon}
      <Heading
        as="h2"
        className={clsx('text--truncate', styles.cardTitle)}
        title={title}>
       {title}
      </Heading>
      </div>
      {description && (
        <p
          className={clsx('text--truncate', styles.cardDescription)}
          title={description}>
          {description}
        </p>
      )}
    </CardContainer>
  );
}

function CardCategory({
  item,
}: {
  item: PropSidebarItemCategory;
}): JSX.Element | null {
  const href = findFirstSidebarItemLink(item);
  const categoryItemsPlural = useCategoryItemsPlural();

  // Unexpected: categories that don't have a link have been filtered upfront
  if (!href) {
    return null;
  }

  return (
    <CardLayout
      href={href}
      icon="🗃️"
      title={item.label}
      description={item.description ?? categoryItemsPlural(item.items.length)}
    />
  );
}

function CardLink({item}: {item: PropSidebarItemLink}): JSX.Element {
  let icon;
  switch (item.label) {
    case OPERATION_TAB.pause:
      icon = <PauseIcon/>;
      break;
    case OPERATION_TAB.freeze:
      icon = <FreezeIcon />;
      break;
    case OPERATION_TAB.mint:
      icon = <MintIcon />;
      break;
    case OPERATION_TAB.cash_in:
      icon = <CashInIcon />;
      break;
    case OPERATION_TAB.burn:
      icon = <BurnIcon/>;
      break;
    default:
      icon = isInternalUrl(item.href) ? '📄️' : '🔗';
      break;
  }
   
  const doc = useDocById(item.docId ?? undefined);
  return (
    <CardLayout
      href={item.href}
      icon={icon}
      title={item.label}
      description={item.description ?? doc?.description}
    />
  );
}

export default function DocCard({item}: Props): JSX.Element {
  switch (item.type) {
    case 'link':
      return <CardLink item={item} />;
    case 'category':
      return <CardCategory item={item} />;
    default:
      throw new Error(`unknown item type ${JSON.stringify(item)}`);
  }
}
