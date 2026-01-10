import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import placeService from "@/features/directory/services/placeService"; // Fixed import
import { placeSchema } from "@/features/contribute/schemas/contributeSchema";
import { NewStoreFields } from "@/features/contribute/components/NewStoreFields";
import { FieldError } from "@/components/ui/FormError";
import { Place } from "@/types/Place";
import { z } from "zod";

// We only need the "place" part of the schema for editing a place
const editPlaceSchema = z.object({
  place: placeSchema,
});

type EditPlaceFormData = z.infer<typeof editPlaceSchema>;

interface AdminEditPlaceFormProps {
  place: Place;
  onSuccess: (updatedPlace: Place) => void;
  onCancel: () => void;
}

export const AdminEditPlaceForm = ({
  place,
  onSuccess,
  onCancel,
}: AdminEditPlaceFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditPlaceFormData>({
    resolver: zodResolver(editPlaceSchema),
    defaultValues: {
      place: {
        name: place.name,
        zone: place.zoneMacro === "inside" ? "Inside Campus" : "Outside Campus",
        nearestLandmark: place.nearestLandmark,
        categories: place.categories as any, // Cast to any to avoid strict tuple mismatch if needed
        amenities: place.amenities as any, // Cast to avoid type mismatch
        coverImage: place.coverImage,
      },
    },
  });

  const onSubmit = async (data: EditPlaceFormData) => {
    try {
      const result = await placeService.updatePlace(place._id, data.place);
      Alert.alert("Success", "Place updated successfully");
      onSuccess(result);
    } catch (error) {
      console.error("Update Place Error:", error);
      Alert.alert("Error", "Failed to update place");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Edit Place</Text>
      <Text style={styles.headerSubtitle}>{place.name}</Text>

      <Text style={styles.headerSubtitle}>{place.name}</Text>

      {/* Place Name Field */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Place Name</Text>
        <Controller
          control={control}
          name="place.name"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              placeholder="Enter place name"
            />
          )}
        />
        {errors.place?.name && (
          <FieldError message={errors.place.name.message as string} />
        )}
      </View>

      {/* Reusing NewStoreFields with casted control to bypass strict ContributeFormData mismatch */}
      <NewStoreFields control={control as any} errors={errors} />

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.btn, styles.cancelBtn]}
          onPress={onCancel}
          disabled={isSubmitting}
        >
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.saveBtn, isSubmitting && styles.disabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          <Text style={styles.saveBtnText}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f8f8f8",
    fontSize: 16,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  btn: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "#f5f5f5",
  },
  saveBtn: {
    backgroundColor: "#FF6B35",
  },
  cancelBtnText: {
    color: "#666",
    fontWeight: "600",
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "700",
  },
  disabled: {
    opacity: 0.7,
  },
});
