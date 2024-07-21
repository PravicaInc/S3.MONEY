import { AvatarSize } from "./types";
import { CSSProperties } from "react";

export const useAvatarSize = (size: AvatarSize): CSSProperties => {
  switch (size) {
    case "tiny":
      return {
        width: "2.4rem",
        height: "2.4rem",
        minWidth: "2.4rem",
        minHeight: "2.4rem",
        borderRadius: "0.4rem",
      };
    default:
      return {};
  }
};
