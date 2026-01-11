import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Place } from "@/types/Place";
import { Meal } from "@/types/Meal";
import { AdminEditPlaceForm } from "./AdminEditPlaceForm";
import { AdminEditMealForm } from "./AdminEditMealForm";

interface AdminEditModalProps {
  visible: boolean;
  type: "place" | "meal" | null;
  target: Place | Meal | null;
  onClose: () => void;
  onSuccess: (data?: any) => void;
}

export const AdminEditModal = ({
  visible,
  type,
  target,
  onClose,
  onSuccess,
}: AdminEditModalProps) => {
  if (!target) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          {type === "place" && (
            <AdminEditPlaceForm
              place={target as Place}
              onCancel={onClose}
              onSuccess={onSuccess}
            />
          )}

          {type === "meal" && (
            <AdminEditMealForm
              meal={target as Meal}
              onCancel={onClose}
              onSuccess={onSuccess}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: {
    paddingBottom: 40,
  },
});
