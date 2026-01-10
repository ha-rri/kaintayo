import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Control, Controller, useWatch } from "react-hook-form";
import { ContributeFormData } from "../types/contribute.types";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { FieldError } from "@/components/ui/FormError";
import { FormImagePicker } from "@/features/common/components/FormImagePicker";

interface MealFormProps {
  control: Control<ContributeFormData>;
  setValue: (name: any, value: any) => void;
  errors: any;
}

export const MealForm = ({ control, setValue, errors }: MealFormProps) => {
  const priceHalf = useWatch({ control, name: "meal.priceHalf" });

  const [isHalfOrder, setIsHalfOrder] = useState<boolean>(!!priceHalf);

  // Sync internal state if form value changes externally (e.g. draft load)
  useEffect(() => {
    if (priceHalf && !isHalfOrder) {
      setIsHalfOrder(true);
    }
  }, [priceHalf, isHalfOrder]);

  const handleToggleHalfOrder = () => {
    const newState = !isHalfOrder;
    setIsHalfOrder(newState);
    if (!newState) {
      setValue("meal.priceHalf", undefined);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons name="food" size={24} color="#FF6B35" />
        <Text style={styles.sectionTitle}>What&apos;s on the menu?</Text>
      </View>

      {/* Image Upload */}
      <FormImagePicker
        control={control}
        name="meal.imageUri"
        placeholderText="Tap to Upload Meal Photo"
        aspect={[1, 1]}
        imageHeight={250}
        containerStyle={{ marginBottom: 20 }}
      />

      {/* Meal Name */}
      <Controller
        control={control}
        name="meal.title"
        render={({ field: { onChange, value } }) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Meal Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChange}
              value={value}
              placeholder="e.g. Pork Sisig"
            />
            <FieldError message={errors.meal?.title?.message} />
          </View>
        )}
      />

      {/* Price Fields */}
      <View style={styles.row}>
        {/* Regular Price */}
        <Controller
          control={control}
          name="meal.priceRegular"
          render={({ field: { onChange, value } }) => (
            <View style={styles.priceField}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Regular Price</Text>
              </View>
              <View style={styles.priceInputContainer}>
                <Text style={styles.currencySymbol}>₱</Text>
                <TextInput
                  style={styles.priceInput}
                  onChangeText={onChange}
                  value={value ? value.toString() : ""}
                  placeholder="- - -"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
              <FieldError message={errors.meal?.priceRegular?.message} />
            </View>
          )}
        />

        {/* Half Price */}
        <Controller
          control={control}
          name="meal.priceHalf"
          render={({ field: { onChange, value } }) => (
            <View style={styles.priceField}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Half Order</Text>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={handleToggleHalfOrder}
                >
                  {isHalfOrder && (
                    <Ionicons name="checkmark" size={16} color="#FF6B35" />
                  )}
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.priceInputContainer,
                  !isHalfOrder && styles.disabledInput,
                ]}
              >
                <Text
                  style={[
                    styles.currencySymbol,
                    !isHalfOrder && styles.disabledText,
                  ]}
                >
                  ₱
                </Text>
                <TextInput
                  style={[
                    styles.priceInput,
                    !isHalfOrder && styles.disabledText,
                  ]}
                  onChangeText={onChange}
                  value={value ? value.toString() : ""}
                  placeholder="- - -"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  editable={isHalfOrder}
                />
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12, // Matched original
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#333" }, // Matched original size
  inputContainer: { marginBottom: 15 },
  label: { fontSize: 13, fontWeight: "600", color: "#666", marginBottom: 8 }, // Matched original
  input: {
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    color: "#333",
    borderColor: "#e0e0e0",
  },
  row: { flexDirection: "row", gap: 12, marginBottom: 20 },
  priceField: { flex: 1 },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    height: 30,
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  currencySymbol: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginRight: 5,
  },
  priceInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  // Checkbox Styles
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#FF6B35",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledInput: {
    backgroundColor: "#fafafa",
    opacity: 0.6,
  },
  disabledText: {
    color: "#999",
  },
});
