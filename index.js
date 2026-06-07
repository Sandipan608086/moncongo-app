import { registerRootComponent } from 'expo';
import App from './App';
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import { setJSExceptionHandler } from 'react-native-exception-handler';

// Show JS crashes as alerts so we can diagnose production crashes
setJSExceptionHandler((error, isFatal) => {
  let details = '';
  try {
    if (typeof error === 'string') {
      details = error;
    } else if (error && error.message) {
      details = `${error.name ?? 'Error'}: ${error.message}`;
      if (error.stack) details += '\n\n' + error.stack.slice(0, 400);
    } else {
      details = JSON.stringify(error, Object.getOwnPropertyNames(error ?? {}), 2) || String(error);
    }
  } catch (e) {
    details = 'Could not serialize error: ' + String(e);
  }
  Alert.alert(isFatal ? 'Fatal Error' : 'JS Error', details || '(empty error)', [{ text: 'OK' }]);
}, true);

// Background message handler must be registered at the top level,
// outside any React component tree.
setBackgroundMessageHandler(getMessaging(), async (remoteMessage) => {
  console.log('Background FCM message received:', remoteMessage);
  // Navigation is not possible here (app is backgrounded/killed).
  // Firebase will automatically show the notification if it contains
  // a "notification" payload. For data-only messages, handle display
  // via expo-notifications in the foreground handler.
});

registerRootComponent(App);

