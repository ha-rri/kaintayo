import { StyleSheet } from "react-native";

export const authStyles = StyleSheet.create({
  // Form Containers
  form: {
    gap: 15,
  },
  inputContainer: {
    gap: 8,
  },

  // Inputs
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  inputError: {
    borderColor: "#FF4444",
  },

  // Password Specific
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  passwordInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },

  // Checkbox
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#FF6B35",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: {
    backgroundColor: "#FF6B35",
  },
  checkboxText: {
    flex: 1,
    fontSize: 12,
    color: "#333",
  },

  // Buttons
  submitButton: {
    backgroundColor: "#FF6B35",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  googleButton: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  // Errors
  fieldError: {
    fontSize: 12,
    color: "#FF4444",
  },
});
