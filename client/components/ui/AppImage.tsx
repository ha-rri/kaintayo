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

interface AppImageProps {
  uri?: string | null;
  style?: StyleProp<ImageStyle>;
  placeholder?: ImageSourcePropType;
  resizeMode?: "cover" | "contain" | "stretch" | "center";
}

export const AppImage = ({
  uri,
  style,
  placeholder = require("@/assets/images/no-image.png"),
  resizeMode = "cover",
}: AppImageProps) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Determine source
  const isPlaceholder = !uri || error;
  const source = isPlaceholder ? placeholder : { uri };

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
          <ActivityIndicator size="small" color="#FF6B35" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    backgroundColor: "#f5f5f5", // Always have a neutral background
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    opacity: 0.5,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5", // Match container bg
  },
});
