import { CSSProperties } from "react";

export type AvatarSize = "tiny";
export type AvatarProps = {
  src?: string;
  radius?: string;
  isWorking?: boolean;
  viewOnly?: boolean;
  size?: AvatarSize;
  border?: boolean;
  disabled?: boolean;
  onChange?: (file: string) => void;
  backgroundColor?: CSSProperties["backgroundColor"];
  iconColor?: string;
  counter?: number | string;
  initials?: InitialsProps;
};

type InitialsProps = { text: string; color?: string };
