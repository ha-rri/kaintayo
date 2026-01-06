import { useState } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import GuestView from "./components/GuestView";
import AuthView from "./components/AuthView";
import DashboardView from "./components/DashboardView";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [showAuthScreen, setShowAuthScreen] = useState(false);
  const [initialAuthTab, setInitialAuthTab] = useState<"login" | "register">(
    "login"
  );

  // Helper to open specific auth tab
  const openAuth = (tab: "login" | "register") => {
    setInitialAuthTab(tab);
    setShowAuthScreen(true);
  };

  // 1. Not Logged In - Show Profile CTA (Landing)
  if (!user && !showAuthScreen) {
    return (
      <GuestView
        onLoginPress={() => openAuth("login")}
        onRegisterPress={() => openAuth("register")}
      />
    );
  }

  // 2. Auth Screen (Login/Register Forms)
  if (!user && showAuthScreen) {
    return (
      <AuthView
        initialTab={initialAuthTab}
        onBack={() => setShowAuthScreen(false)}
      />
    );
  }

  // 3. Logged In State (Dashboard)
  return <DashboardView user={user} onLogout={logout} />;
}
