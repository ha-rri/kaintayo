import React, { useState } from "react";
import {
  Image,
  ImageStyle,
  StyleProp,
  ImageSourcePropType,
} from "react-native";

interface KaintayoImageProps {
  uri?: string | null;
  style?: StyleProp<ImageStyle>;
  placeholder?: ImageSourcePropType;
  resizeMode?: "cover" | "contain" | "stretch" | "center";
}

export const KaintayoImage = ({
  uri,
  style,
  placeholder = require("@/assets/images/no-image.png"),
  resizeMode = "cover",
}: KaintayoImageProps) => {
  const [error, setError] = useState(false);

  // Determine source
  const isPlaceholder = !uri || error;
  const source = isPlaceholder ? placeholder : { uri };

  // dynamic styles for placeholder
  const finalStyle = [
    style,
    isPlaceholder && {
      backgroundColor: "#f5f5f5", // Light subtle background
      opacity: 0.6, // Faded look
    },
  ];

  return (
    <Image
      source={source as ImageSourcePropType}
      style={finalStyle}
      resizeMode={isPlaceholder ? "contain" : resizeMode} // Keep placeholder centered/contained
      onError={() => setError(true)}
    />
  );
};
