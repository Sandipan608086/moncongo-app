import { createNavigationContainerRef } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    try {
      navigationRef.navigate(name, params);
    } catch (e) {
      console.warn('Navigation error:', e?.message);
    }
  }
}
