import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  // Main Container
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6", // bg-muted equivalent
  },

  // Orange Header Bar
  headerBar: {
    height: 48, // h-12
    backgroundColor: "#f97316", // bg-primary (Orange-500)
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  // Carousel Area
  carouselContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  slideItem: {
    width: width,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  // Icon Styling
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(249, 115, 22, 0.2)", // primary/20
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  // Text Styling
  textContainer: {
    alignItems: "center",
    gap: 12,
  },
  headline: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a", // text-foreground
    textAlign: "center",
  },
  subtext: {
    fontSize: 16,
    color: "#64748b", // text-muted-foreground
    textAlign: "center",
    lineHeight: 24,
  },

  // Bottom Section
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 24,
  },

  // Pagination Dots
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: "#f97316", // primary
  },
  inactiveDot: {
    width: 8,
    backgroundColor: "rgba(100, 116, 139, 0.3)", // muted-foreground/30
  },

  // Buttons
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    height: 44,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  nextButton: {
    flex: 2, // Takes up more space
    backgroundColor: "#f97316",
  },
  buttonTextBack: {
    color: "#0f172a",
    fontWeight: "600",
  },
  buttonTextNext: {
    color: "#ffffff",
    fontWeight: "600",
  },
});
