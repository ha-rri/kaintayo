import { View, Text, StyleSheet } from "react-native";

interface FormErrorProps {
  message: string | null;
}

export const FormError: React.FC<FormErrorProps> = ({ message }) => {
  if (!message) return null;

  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
};

export const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return <Text style={styles.fieldError}>{message}</Text>;
};

const styles = StyleSheet.create({
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffcdd2",
  },
  errorText: {
    color: "#c62828",
    fontSize: 14,
  },
  fieldError: {
    fontSize: 12,
    color: "#FF4444",
    marginTop: 4,
  },
});
