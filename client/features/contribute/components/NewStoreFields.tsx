import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Control, Controller } from "react-hook-form";
import { ContributeFormData } from "../types/contribute.types";
import { CATEGORIES, AMENITIES, ZONES } from "../constants/taxonomy";
import { FieldError } from "@/components/ui/FormError";

interface NewStoreFieldsProps {
  control: Control<ContributeFormData>;
  errors: any;
}

export const NewStoreFields = ({ control, errors }: NewStoreFieldsProps) => {
  return (
    <View style={styles.container}>
      {/* Zone Dropdown */}
      <Controller
        control={control}
        name="place.zone"
        render={({ field: { onChange, value } }) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Zone (Map Area)</Text>
            <View style={styles.chipContainer}>
              {ZONES.map((z) => (
                <TouchableOpacity
                  key={z}
                  style={[styles.chip, value === z && styles.activeChip]}
                  onPress={() => onChange(z)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      value === z && styles.activeChipText,
                    ]}
                  >
                    {z}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.place?.zone && (
              <FieldError message={errors.place.zone.message} />
            )}
          </View>
        )}
      />

      {/* Nearest Landmark */}
      <Controller
        control={control}
        name="place.nearestLandmark"
        render={({ field: { onChange, value } }) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nearest Landmark</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChange}
              value={value}
              placeholder="e.g. Near Gate 1"
            />
            {errors.place?.nearestLandmark && (
              <FieldError message={errors.place.nearestLandmark.message} />
            )}
          </View>
        )}
      />

      {/* Categories */}
      <Controller
        control={control}
        name="place.categories"
        render={({ field: { onChange, value } }) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Categories (Select all that apply)</Text>
            <View style={styles.chipContainer}>
              {CATEGORIES.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.chip, value?.includes(c) && styles.activeChip]}
                  onPress={() => {
                    const current = value || [];
                    if (current.includes(c))
                      onChange(current.filter((i: string) => i !== c));
                    else onChange([...current, c]);
                  }}
                >
                  <Text
                    style={[
                      styles.chipText,
                      value?.includes(c) && styles.activeChipText,
                    ]}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.place?.categories && (
              <FieldError message={errors.place.categories.message} />
            )}
          </View>
        )}
      />

      {/* Amenities */}
      <Controller
        control={control}
        name="place.amenities"
        render={({ field: { onChange, value } }) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Amenities</Text>
            <View style={styles.chipContainer}>
              {AMENITIES.map((a) => (
                <TouchableOpacity
                  key={a}
                  style={[styles.chip, value?.includes(a) && styles.activeChip]}
                  onPress={() => {
                    const current = value || [];
                    if (current.includes(a))
                      onChange(current.filter((i: string) => i !== a));
                    else onChange([...current, a]);
                  }}
                >
                  <Text
                    style={[
                      styles.chipText,
                      value?.includes(a) && styles.activeChipText,
                    ]}
                  >
                    {a}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Optional field, but if there's an error, show it */}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", color: "#666", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f8f8f8",
    fontSize: 16,
  },
  chipContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  activeChip: { backgroundColor: "#FF6B35", borderColor: "#FF6B35" },
  chipText: { color: "#666" },
  activeChipText: { color: "#fff", fontWeight: "600" },
});
