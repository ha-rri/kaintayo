import React, { useState } from "react";
import {
  Image,
  ImageStyle,
  StyleProp,
  ImageSourcePropType,
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import { getOptimizedImageUrl } from "@/lib/cloudinary";
import { theme } from "@/lib/theme";

interface AppImageProps {
  uri?: string | null;
  style?: StyleProp<ImageStyle>;
  placeholder?: ImageSourcePropType;
  resizeMode?: "cover" | "contain" | "stretch" | "center";
  optimizeWidth?: number;
}

export const AppImage = ({
  uri,
  style,
  placeholder = require("@/assets/images/no-image.png"),
  resizeMode = "cover",
  optimizeWidth,
}: AppImageProps) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Optimize URI if it exists
  const optimizedUri = getOptimizedImageUrl(uri, optimizeWidth);

  // Determine source
  const isPlaceholder = !optimizedUri || error;
  const source = isPlaceholder ? placeholder : { uri: optimizedUri };

  // Handle loading state only if we have a valid URI and no error
  const shouldShowLoading = loading && !isPlaceholder;

  return (
    <View style={[styles.container, style]}>
      <Image
        source={source as ImageSourcePropType}
        style={[styles.image, isPlaceholder && styles.placeholderImage]}
        resizeMode={isPlaceholder ? "contain" : resizeMode}
        onLoadStart={() => {
          if (uri && !error) setLoading(true);
        }}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />

      {shouldShowLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    backgroundColor: theme.colors.background,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    marginTop: 4,
    fontSize: theme.fontSizes.xs,
    color: theme.colors.text.disabled,
  },
  placeholderImage: {
    opacity: 0.5,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
});
