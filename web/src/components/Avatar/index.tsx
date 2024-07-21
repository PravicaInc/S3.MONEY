import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { AvatarProps as Props } from "./types";
import { Typography } from "../Typography";
import { ClipLoader } from "react-spinners";
import styles from "./styles.module.css";
import { useAvatarSize } from "./useAvatarSize";
import { readFileAsBase64 } from "../../utils/helpers.ts";
import { getInitials } from "../../utils/string_formats.ts";
import Plus from "../../assets/plus.svg?react";
import User from "../../assets/user.svg?react";

export const Avatar: FC<Props> = ({
  src,
  isWorking,
  viewOnly = true,
  size = "tiny",
  backgroundColor,
  onChange,
  border,
  disabled,
  iconColor,
  radius,
  counter,
  initials,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | undefined>();
  const avatarStyles = useAvatarSize(size);

  useEffect(() => {
    setImage(src);
  }, [src]);

  const handleFileUpload = () => inputRef.current?.click();

  const handleChange = async ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (target.files) {
      onChange && onChange(await readFileAsBase64(target.files[0]));
      const objectUrl = URL.createObjectURL(target.files[0]);
      setImage(objectUrl);
    }
  };

  return initials && !src && viewOnly ? (
    <div style={avatarStyles} className={`${styles.initialsContainer} ${disabled && styles.disabled}`}>
      <Typography type={"t_xs-500"} color={initials.color}>
        {getInitials(initials.text)}
      </Typography>
    </div>
  ) : (
    <div
      style={{ background: backgroundColor, ...avatarStyles }}
      className={`${styles.avatar} ${border && styles.bordered} ${disabled && styles.disabled}`}
    >
      {image && (
        <img
          src={image}
          alt="avatar"
          style={{
            objectFit: "contain",
            ...avatarStyles,
            borderRadius: radius || avatarStyles.borderRadius,
          }}
        />
      )}
      {counter && (
        <div className={styles.conunterContainer}>
          <Typography type="t_xs-700">{counter}</Typography>
        </div>
      )}
      {!src && (
        <User
          style={{
            stroke: iconColor,
            width: avatarStyles.width,
            height: avatarStyles.height,
          }}
        />
      )}
      {!viewOnly && (
        <div className={styles.upload}>
          <input ref={inputRef} type="file" onChange={handleChange} style={{ display: "none" }} />
          {isWorking && <ClipLoader size={"2em"} color="var(--white-scale-100)" />}
          {!isWorking && <Plus onClick={handleFileUpload} className={styles.plus} />}
        </div>
      )}
    </div>
  );
};
