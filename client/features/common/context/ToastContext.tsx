import React, { createContext, useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
  DeviceEventEmitter,
} from "react-native";

type ToastType = "success" | "error" | "info";

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  visible: boolean;
  message: string;
  fadeAnim: Animated.Value;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastUIProps {
  visible: boolean;
  message: string;
  fadeAnim: Animated.Value;
  style?: any;
}

export const ToastUI: React.FC<ToastUIProps> = ({
  visible,
  message,
  fadeAnim,
  style,
}) => {
  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.toastContainer, { opacity: fadeAnim }, style]}
      pointerEvents="none"
    >
      <View style={styles.toast}>
        <Text style={styles.toastText}>{message}</Text>
      </View>
    </Animated.View>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [fadeAnim] = useState(new Animated.Value(0));
  const animationRef = React.useRef<Animated.CompositeAnimation | null>(null);

  const showToast = useCallback(
    (msg: string, toastType: ToastType = "info") => {
      // 1. Cancel previous animation if any
      if (animationRef.current) {
        animationRef.current.stop();
      }

      setMessage(msg);
      setVisible(true); // Mount the toast

      // 2. Reset value
      fadeAnim.setValue(0);

      // 3. Create and store new animation
      const anim = Animated.sequence([
        // Fade In
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        // Wait
        Animated.delay(2000),
        // Fade Out
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]);

      animationRef.current = anim;

      anim.start(({ finished }) => {
        if (finished) {
          setVisible(false);
          animationRef.current = null;
        }
      });
    },
    [fadeAnim]
  );

  // Global Event Listener
  React.useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "SHOW_TOAST",
      ({ message, type }: { message: string; type?: ToastType }) => {
        showToast(message, type);
      }
    );
    return () => {
      subscription.remove();
    };
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, visible, message, fadeAnim }}>
      {children}
      <ToastUI visible={visible} message={message} fadeAnim={fadeAnim} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 40 : 30, // Direct bottom positioning
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 9999,
  },
  toast: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toastText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
