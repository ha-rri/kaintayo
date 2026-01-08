import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Control, useWatch, UseFormClearErrors } from "react-hook-form";
import { ContributeFormData } from "../types/contribute.types";
import { Ionicons } from "@expo/vector-icons";
import { StoreSearch } from "./StoreSearch";
import { NewStoreFields } from "./NewStoreFields";

interface StoreFormProps {
  control: Control<ContributeFormData>;
  setValue: (name: any, value: any) => void;
  errors: any;
  clearErrors: UseFormClearErrors<ContributeFormData>;
}

export const StoreForm = ({
  control,
  setValue,
  errors,
  clearErrors,
}: StoreFormProps) => {
  const isNewPlace = useWatch({ control, name: "isNewPlace" });

  const handleClearSelection = () => {
    setValue("placeId", undefined);
    setValue("isNewPlace", false);
    setValue("place.name", "");
    clearErrors();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.sectionHeader}>
        <Ionicons name="location" size={24} color="#FF6B35" />
        <Text style={styles.sectionTitle}>Where are you?</Text>
      </View>

      {/* Logic A: Search Input */}
      <StoreSearch
        control={control}
        setValue={setValue}
        errors={errors}
        onClear={handleClearSelection}
      />

      {/* Logic B: New Store Form */}
      {isNewPlace && <NewStoreFields control={control} errors={errors} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Card styling removed
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#333" },
});
