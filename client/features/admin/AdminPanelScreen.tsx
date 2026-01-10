import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePendingItems } from "./hooks/usePendingItems";
import { useAdminActions } from "./hooks/useAdminActions";
import PendingItemCard from "./components/PendingItemCard";
import AdminReviewModal from "./components/AdminReviewModal";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function AdminPanelScreen() {
  const router = useRouter();
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

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle}>Admin Panel</Text>
        <Text style={styles.headerSubtitle}>Manage community submissions</Text>
      </View>
      <View style={{ width: 24 }} />
    </View>
  );

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
          <ActivityIndicator size="large" color="#FF6B35" />
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
        contentContainerStyle={styles.listContent}
        onRefresh={refetch}
        refreshing={isLoading}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderTabs()}
      <View style={styles.content}>{renderContent()}</View>

      {/* Review Modal */}
      <AdminReviewModal
        visible={!!selectedItem}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#FF6B35", // BRAND ORANGE
    borderBottomWidth: 0, // Remove border for cleaner look
    elevation: 4, // Shadow for depth
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff", // White text
    textAlign: "center",
  },
  headerTitleContainer: {
    alignItems: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)", // Semi-transparent white
    marginTop: 2,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tab: {
    paddingVertical: 12,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#FF6B35",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#999",
  },
  activeTabText: {
    color: "#FF6B35",
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
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
  },
});
