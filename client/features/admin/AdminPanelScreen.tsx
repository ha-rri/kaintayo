import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePendingItems } from "./hooks/usePendingItems";
import { useAdminActions } from "./hooks/useAdminActions";
import PendingItemCard from "./components/PendingItemCard";
import AdminReviewModal from "./components/AdminReviewModal";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/lib/theme"; // Import theme
import { ScreenHeader } from "@/components/ui/ScreenHeader";

export default function AdminPanelScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<"pending" | "reported">("pending");
  const [selectedItem, setSelectedItem] = useState<any | null>(null); // State for modal

  const { data: pendingItems, isLoading, refetch } = usePendingItems();
  const { approve, reject, isApproving, isRejecting } = useAdminActions();

  // Helper wrappers
  const handleApprove = (type: "place" | "meal", id: string) => {
    if (isApproving) return;
    approve(
      { type, id },
      {
        onSuccess: () => setSelectedItem(null), // Close modal on success
      }
    );
  };

  const handleReject = (type: "place" | "meal", id: string) => {
    if (isRejecting) return;
    reject(
      { type, id },
      {
        onSuccess: () => setSelectedItem(null), // Close modal on success
      }
    );
  };

  const queryClient = useQueryClient();

  const handleUpdateItem = (updatedItem: any) => {
    // 1. Update local selected item (Instant Modal Refresh)
    setSelectedItem((prev: any) => ({ ...prev, ...updatedItem }));

    // 2. Update React Query Cache (Instant List Refresh)
    queryClient.setQueryData(
      ["admin", "pending"],
      (oldItems: any[] | undefined) => {
        if (!oldItems) return [];
        return oldItems.map((item) =>
          item._id === updatedItem._id ? { ...item, ...updatedItem } : item
        );
      }
    );
  };

  // Header replaced by ScreenHeader component

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "pending" && styles.activeTab]}
        onPress={() => setActiveTab("pending")}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "pending" && styles.activeTabText,
          ]}
        >
          Pending Queue
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === "reported" && styles.activeTab]}
        onPress={() => setActiveTab("reported")}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "reported" && styles.activeTabText,
          ]}
        >
          Reported Items
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    if (activeTab === "reported") {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="flag-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>Reporting System Coming Soon</Text>
          <Text style={styles.emptySubtext}>
            This feature is scheduled for Phase 2.
          </Text>
        </View>
      );
    }

    if (isLoading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      );
    }

    if (!pendingItems || pendingItems.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="documents-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>All Caught Up!</Text>
          <Text style={styles.emptySubtext}>
            There are no pending submissions to review.
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={pendingItems}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <PendingItemCard
            item={item}
            onPress={(item) => setSelectedItem(item)}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
        onRefresh={refetch}
        refreshing={isLoading}
      />
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Admin Panel" showBackButton={true} />
      {renderTabs()}
      <View style={styles.content}>{renderContent()}</View>

      {/* Review Modal */}
      <AdminReviewModal
        visible={!!selectedItem}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        onUpdate={handleUpdateItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // Header styles removed (now in ScreenHeader)
  tabContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tab: {
    paddingVertical: 12,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: theme.fontSizes.sm,
    fontWeight: "600",
    color: theme.colors.text.disabled, // #999 -> disabled
  },
  activeTabText: {
    color: theme.colors.primary,
  },
  content: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: theme.spacing.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: theme.fontSizes.lg,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text.disabled,
    textAlign: "center",
    marginTop: 8,
  },
});
