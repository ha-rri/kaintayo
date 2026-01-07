import React from "react";
import { View, Text } from "react-native";
import { errorStyles } from "@/styles/error.styles";

interface FormErrorProps {
  message: string | null;
}

export const FormError: React.FC<FormErrorProps> = ({ message }) => {
  if (!message) return null;

  return (
    <View style={errorStyles.errorContainer}>
      <Text style={errorStyles.errorText}>{message}</Text>
    </View>
  );
};