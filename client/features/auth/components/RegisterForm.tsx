import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/features/auth/schemas/authSchema";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { authStyles as styles } from "@/features/auth/styles/auth.styles";
import { FormError, FieldError } from "@/components/ui/FormError";

// Clean import type
import type {
  RegisterRequest,
  RegisterInput,
} from "@/features/auth/services/auth.service";

export default function RegisterForm() {
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    if (!agreeTerms) {
      setErrorMsg("You must certify you are a student.");
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      // Omit confirmPassword before sending to API
      const { confirmPassword, ...apiData } = data;
      await register(apiData as RegisterRequest);
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.form}>
      <FormError message={errorMsg} />

      {/* Username */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username</Text>
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, errors.username && styles.inputError]}
              placeholder="Username"
              placeholderTextColor="#999"
              value={value}
              onChangeText={onChange}
              autoCapitalize="none"
            />
          )}
        />
        {errors.username && <FieldError message={errors.username.message} />}
      </View>

      {/* Email */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="email@example.com"
              placeholderTextColor="#999"
              value={value}
              onChangeText={onChange}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        {errors.email && <FieldError message={errors.email.message} />}
      </View>

      {/* Password */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <View
          style={[
            styles.passwordContainer,
            errors.password && styles.inputError,
          ]}
        >
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                placeholderTextColor="#999"
                value={value}
                onChangeText={onChange}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
            )}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        </View>
        {errors.password && <FieldError message={errors.password.message} />}
      </View>

      {/* Confirm Password */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirm Password</Text>
        <View
          style={[
            styles.passwordContainer,
            errors.confirmPassword && styles.inputError,
          ]}
        >
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm Password"
                placeholderTextColor="#999"
                value={value}
                onChangeText={onChange}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
            )}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons
              name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        </View>
        {errors.confirmPassword && (
          <FieldError message={errors.confirmPassword.message} />
        )}
      </View>

      {/* Terms Checkbox */}
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => setAgreeTerms(!agreeTerms)}
      >
        <View style={[styles.checkbox, agreeTerms && styles.checkboxActive]}>
          {agreeTerms && <Ionicons name="checkmark" size={16} color="#fff" />}
        </View>
        <Text style={styles.checkboxText}>
          I certify I am a student and will post real, accurate data.
        </Text>
      </TouchableOpacity>

      {/* Button */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Register</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleButton}>
        <Ionicons name="logo-google" size={20} color="#DB4437" />
        <Text style={styles.googleButtonText}>Join with Google</Text>
      </TouchableOpacity>
    </View>
  );
}
