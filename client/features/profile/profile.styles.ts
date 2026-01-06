import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  /* --- Shared / Container --- */
  container: {
    flex: 1,
    backgroundColor: "#e8e8e8",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 30,
  },
  avatarContainer: {
    marginBottom: 30,
  },
  avatar: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#c4c4c4",
    justifyContent: "center",
    alignItems: "center",
  },

  /* --- Guest View (Landing) --- */
  header: {
    backgroundColor: "#FF6B35",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#fff",
    opacity: 0.8,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 10,
    textAlign: "center",
  },
  ctaSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 20,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
    gap: 12,
  },
  loginButton: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  registerButton: {
    backgroundColor: "#FF6B35",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },

  /* --- Auth View (Tabs & Container) --- */
  authHeader: {
    backgroundColor: "#FF6B35",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  authHeaderTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  backButton: {
    marginRight: 10,
  },
  authContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 30,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FF6B35",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#d0d0d0",
    borderRadius: 25,
    padding: 4,
    marginBottom: 30,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#FF6B35",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  activeTabText: {
    color: "#fff",
  },
});
