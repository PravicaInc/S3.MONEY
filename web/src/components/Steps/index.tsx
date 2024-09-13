import { Children, Dispatch, FC, SetStateAction, useEffect, useState } from 'react';

import styles from './styles.module.css';

export interface IProps {
  children: ((options: {
    goNext: () => void;
    goBack: () => void;
  }) => React.ReactElement) | React.ReactNode;
  className?: string;
  progress?: boolean;
  onStepChange?: Dispatch<SetStateAction<number>>;
}

export const Steps: FC<IProps> = ({ children, onStepChange, className, progress }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    onStepChange && onStepChange(currentStep);
  }, [currentStep]);

  const goNext = () => {
    setCurrentStep(prevState => prevState + 1);
  };
  const goBack = () => {
    setCurrentStep(prevState => prevState - 1);
  };

  const stepsChildren = (typeof children === 'function'
    ? children({
      goNext,
      goBack,
    }).props.children
    : Children.toArray(children));

  const childrenToRender = stepsChildren instanceof Array ? stepsChildren : [stepsChildren];

  return (
    <>
      {progress && childrenToRender.length > 1
        && (
          <div
            className={styles.progress}
            style={{ width: `${((currentStep + 1) / childrenToRender.length) * 100}%` }}
          />
        )}
      <div className={`${styles.container} ${className}`}>
        <div className={styles.body}>
          {childrenToRender[currentStep]}
        </div>
        {childrenToRender.length > 1 && (
          <div className={styles.dots}>
            {Children.map(childrenToRender, (_, index) => (
              <div
                className={`${styles.dot} ${index === currentStep && styles.active}`}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};
