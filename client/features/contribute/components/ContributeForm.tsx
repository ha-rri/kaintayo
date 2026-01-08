import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contributeSchema } from "../schemas/contributeSchema";
import { ContributeFormData } from "../types/contribute.types";
import { StoreForm } from "./StoreForm";
import { MealForm } from "./MealForm";
import { useContribute } from "../hooks/useContribute";

export const ContributeForm = () => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
    clearErrors,
  } = useForm<ContributeFormData>({
    resolver: zodResolver(contributeSchema) as any,
    defaultValues: {
      isNewPlace: false,
      place: {
        categories: [],
      },
      meal: {
        title: "",
        priceRegular: undefined,
        priceHalf: undefined,
      },
    },
  });

  const { mutateAsync: submitContribution, isPending } = useContribute();

  const onSubmit = async (data: ContributeFormData) => {
    try {
      await submitContribution(data);
      Alert.alert(
        "Success",
        "Your contribution has been submitted for review!",
        [{ text: "OK" }]
      );
      reset(); // Reset form on success
    } catch {
      Alert.alert("Error", "Failed to submit contribution. Please try again.");
    }
  };

  // Watch for conditional rendering
  const isPlaceSelected = useWatch({ control, name: "placeId" });
  const isNewPlace = useWatch({ control, name: "isNewPlace" });
  const hasPlaceContext = !!isPlaceSelected || isNewPlace;

  return (
    <View>
      {/* Step 1: Identify Store */}
      <StoreForm
        control={control}
        setValue={setValue}
        errors={errors}
        clearErrors={clearErrors}
      />

      {/* Step 2: Meal Details */}
      <MealForm control={control} setValue={setValue} errors={errors} />

      {/* Action Buttons */}
      <TouchableOpacity
        style={[
          styles.submitBtn,
          (isSubmitting || isPending) && styles.disabledBtn,
        ]}
        onPress={
          !hasPlaceContext
            ? () =>
                Alert.alert(
                  "Select a Store",
                  "Please select an existing store or request a new one to continue."
                )
            : handleSubmit(onSubmit)
        }
        disabled={isSubmitting || isPending}
      >
        <Text style={styles.submitBtnText}>
          {isSubmitting || isPending ? "Submitting..." : "Submit"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  submitBtn: {
    backgroundColor: "#FF6B35",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledBtn: {
    backgroundColor: "#ffb09c",
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 16, // Matched original
    fontWeight: "700", // Matched original
  },
});
