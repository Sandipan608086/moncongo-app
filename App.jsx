import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppNav from "./Navigation/AppNav";
import store from "./store/Store";
import { Provider as StoreProvider } from "react-redux";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync().catch(() => {});

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>App Error</Text>
          <Text style={styles.errorMsg}>{String(this.state.error)}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff" },
  errorTitle: { fontSize: 20, fontWeight: "bold", color: "red", marginBottom: 10 },
  errorMsg: { fontSize: 13, color: "#333", textAlign: "center" },
});

export default () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <StoreProvider store={store}>
          <AppNav />
        </StoreProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
};
