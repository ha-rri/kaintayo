import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { Control, Controller } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { AppImage } from "@/components/ui/AppImage";
import { theme } from "@/lib/theme";

interface FormImagePickerProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholderText?: string;
  aspect?: [number, number];
  containerStyle?: ViewStyle;
  imageHeight?: number;
}

export const FormImagePicker = ({
  control,
  name,
  label,
  placeholderText = "Tap to Upload Photo",
  aspect = [1, 1], // Default square
  containerStyle,
  imageHeight = 200,
}: FormImagePickerProps) => {
  const pickImage = async (onChange: (uri: string) => void) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: aspect,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onChange(result.assets[0].uri);
    }
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={[styles.container, containerStyle]}>
          {label && <Text style={styles.label}>{label}</Text>}

          <TouchableOpacity
            style={[
              styles.pickerButton,
              { height: imageHeight },
              error && styles.errorBorder,
            ]}
            onPress={() => pickImage(onChange)}
          >
            {value ? (
              <AppImage
                uri={value}
                style={styles.image}
                optimizeWidth={400} // Optimize for picker preview
              />
            ) : (
              <View style={styles.placeholder}>
                <Ionicons
                  name="camera"
                  size={32}
                  color={
                    error
                      ? theme.colors.status.error
                      : theme.colors.text.disabled
                  }
                />
                <Text
                  style={[
                    styles.text,
                    error && { color: theme.colors.status.error },
                  ]}
                >
                  {placeholderText}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  pickerButton: {
    width: "100%",
    height: 200,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: "dashed",
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 8,
    color: theme.colors.text.secondary,
    fontSize: theme.fontSizes.sm,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  errorBorder: {
    borderColor: theme.colors.status.error,
    borderStyle: "solid",
  },
  errorText: {
    color: theme.colors.status.error,
    fontSize: theme.fontSizes.xs,
    marginTop: 4,
    marginLeft: 4,
  },
});
