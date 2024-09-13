import * as React from 'react';
import { CSSProperties, useEffect, useMemo } from 'react';
import { Tooltip } from 'antd';
import { findAll } from 'highlight-words-core';

import CopyIcon from '../../assets/copy.svg?react';
import { truncateString } from '../../utils/string_formats.ts';

type StylesTypes =
  | 'd_2xl'
  | 'd_xl'
  | 'd_lg'
  | 'd_md'
  | 'd_sm'
  | 'd_xs'
  | 't_xl'
  | 't_lg'
  | 't_md'
  | 't_sm'
  | 't_xs'
  | 't_xss';
type StylesWeights = '400' | '500' | '600' | '700';
type TypeWithWeight = `${StylesTypes}-${StylesWeights}`;

interface Chunk {
  highlight: boolean;
  start: number;
  end: number;
}
interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  type: TypeWithWeight;
  autoEscape?: boolean;
  highlightClassName?: string;
  highlightStyle?: CSSProperties;
  highlightClick?: (val: string) => void;
  searchWords?: string[];
  ellipses?: boolean;
  copyable?: boolean;
}

export const Typography: React.FC<IProps> = ({
  type,
  autoEscape,
  highlightClassName,
  highlightClick,
  highlightStyle,
  searchWords = [],
  ellipses,
  copyable,
  ...props
}) => {
  const [copied, setCopied] = React.useState(false);
  const stylesMap: { [key in StylesTypes]: CSSProperties } = useMemo(
    () => ({
      d_2xl: {
        fontSize: 72,
        lineHeight: 1,
      },
      d_xl: {
        fontSize: 60,
        lineHeight: 1,
      },
      d_lg: {
        fontSize: 48,
        lineHeight: 1,
      },
      d_md: {
        fontSize: 36,
        lineHeight: 1,
      },
      d_sm: {
        fontSize: 30,
        lineHeight: 1,
      },
      d_xs: {
        fontSize: 24,
      },
      t_xl: {
        fontSize: 20,
      },
      t_lg: {
        fontSize: 18,
      },
      t_md: {
        fontSize: 16,
      },
      t_sm: {
        fontSize: 14,
      },
      t_xs: {
        fontSize: 12,
      },
      t_xss: {
        fontSize: 8,
      },
    }),
    []
  );
  const textToHighlight = ellipses ? truncateString(String(props.children), 11) : String(props.children);
  const fullText = String(props.children);
  const chunks = findAll({
    textToHighlight,
    searchWords,
    autoEscape,
  });
  const [textType, textWeight] = type.split('-');
  const defaultStyle = stylesMap[textType as StylesTypes];

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    if (!copyable) {
      return;
    }
    navigator.clipboard.writeText(fullText);
    setCopied(true);
  };

  return (
    <p
      {...props}
      style={{
        color: 'var(--gray_100)',
        ...defaultStyle,
        ...props.style,
        fontWeight: Number(textWeight),
      }}
    >
      {chunks.map((chunk: Chunk, index: number) => {
        const text = textToHighlight?.substr(chunk.start, chunk.end - chunk.start);

        return !chunk.highlight
          ? (
            text
          )
          : (
            <span
              onClick={() => highlightClick && highlightClick(text)}
              key={index}
              className={chunk.highlight && highlightClassName}
              style={chunk.highlight && highlightStyle}
            >
              {text}
            </span>
          );
      })}
      {copyable && (
        <Tooltip open={copied} title="Copied!">
          <CopyIcon
            onClick={handleCopy}
            style={{
              color: 'var(--primary_100)',
              marginLeft: '0.5rem', cursor: 'pointer',
            }}
          />
        </Tooltip>
      )}
    </p>
  );
};
