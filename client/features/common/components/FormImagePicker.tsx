import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { Control, Controller } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

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
      render={({ field: { onChange, value } }) => (
        <View style={[styles.container, containerStyle]}>
          {label && <Text style={styles.label}>{label}</Text>}

          <TouchableOpacity
            style={[styles.pickerButton, { height: imageHeight }]}
            onPress={() => pickImage(onChange)}
          >
            {value ? (
              <Image source={{ uri: value }} style={styles.image} />
            ) : (
              <View style={styles.placeholder}>
                <Ionicons name="camera-outline" size={32} color="#999" />
                <Text style={styles.placeholderText}>{placeholderText}</Text>
              </View>
            )}
          </TouchableOpacity>
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
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#ddd",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholder: {
    alignItems: "center",
    gap: 8,
  },
  placeholderText: {
    color: "#999",
    fontWeight: "500",
    fontSize: 14,
  },
});
