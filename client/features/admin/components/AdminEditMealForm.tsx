import React from "react";
import { View, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mealService } from "@/features/directory/services/mealService";
import { mealSchema } from "@/features/contribute/schemas/contributeSchema";
import { MealForm } from "@/features/contribute/components/MealForm";
import { Meal } from "@/types/Meal";
import { z } from "zod";

// Create a schema specifically for editing a meal
// We need to match the structure expected by MealForm: { meal: { ... } }
const editMealSchema = z.object({
  meal: mealSchema,
});

type EditMealFormData = z.infer<typeof editMealSchema>;

interface AdminEditMealFormProps {
  meal: Meal;
  onSuccess: (updatedMeal: Meal) => void;
  onCancel: () => void;
}

export const AdminEditMealForm = ({
  meal,
  onSuccess,
  onCancel,
}: AdminEditMealFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue, // We need setValue for MealForm if we want to support toggling logic from parent, but MealForm handles it internally via control?
    // Wait, MealForm props are: { control, setValue, errors }. So we DO need setValue.
  } = useForm<EditMealFormData>({
    resolver: zodResolver(editMealSchema) as any, // Cast to avoid strict coercion type mismatch
    defaultValues: {
      meal: {
        title: meal.title,
        priceRegular: meal.priceRegular,
        priceHalf: meal.priceHalf,
        imageUri: meal.imageUri,
      },
    },
  });

  const onSubmit = async (data: EditMealFormData) => {
    try {
      const result = await mealService.updateMeal(meal._id, data.meal);
      Alert.alert("Success", "Meal updated successfully");
      onSuccess(result);
    } catch (error) {
      console.error("Update Meal Error:", error);
      console.error("Update Meal Error:", error);
      Alert.alert("Error", "Failed to update meal");
    }
  };

  const onDelete = () => {
    Alert.alert(
      "Delete Meal?",
      "Are you sure you want to delete this meal? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await mealService.deleteMeal(meal._id);
              Alert.alert("Success", "Meal deleted successfully");
              onSuccess({ ...meal, isDeleted: true } as any); // Type cast since isDeleted isn't in Meal type
            } catch (error) {
              console.error("Delete Meal Error:", error);
              Alert.alert("Error", "Failed to delete meal");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Edit Meal</Text>
          <Text style={styles.headerSubtitle}>{meal.title}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={onDelete} style={styles.iconBtn}>
            <Ionicons name="trash-outline" size={24} color="#DC2626" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onCancel} style={styles.iconBtn}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.divider} />

      {/* Reusing MealForm with casted control to bypass strict ContributeFormData mismatch */}
      <MealForm control={control as any} setValue={setValue} errors={errors} />

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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginBottom: 20,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
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
