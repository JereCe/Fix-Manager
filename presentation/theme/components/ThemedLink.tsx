import React from "react";
import { Link, LinkProps } from "expo-router";

import { useThemeColor } from "../hooks/useThemeColor";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props extends LinkProps {}

const ThemedLink = ({ style, ...rest }: Props) => {
  const primary = useThemeColor({}, "primary");
  return (
    <Link
      style={[
        {
          color: primary,
        },
        style,
      ]}
      {...rest}
    />
  );
};

export default ThemedLink;
