import { ButtonHTMLAttributes, FC } from "react";
import styles from "./styles.module.css";
import { ClipLoader } from "react-spinners";

export interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary";
}

export const Button: FC<IProps> = ({ className, isLoading, variant = "primary", children, ...props }) => {
  return (
    <button className={`${styles.primary} ${variant === "secondary" && styles.secondary} ${className}`} {...props}>
      {isLoading ? <ClipLoader size={20} /> : children}
    </button>
  );
};
