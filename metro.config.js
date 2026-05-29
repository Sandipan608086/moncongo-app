// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

// /** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Allow Metro/Babel to transform TypeScript source files from packages that
// ship their TypeScript source via the "react-native" package.json field.
// Without this, Metro 0.82 (Expo SDK 53) fails with SyntaxError on }: { syntax.
const packagesToTransform = [
  'react-native-paper',
  '@react-navigation',
  'react-native-gesture-handler',
  'react-native-safe-area-context',
  'react-native-svg',
  'react-native-tab-view',
  'react-native-webview',
  'react-freeze',
  '@react-native-async-storage',
  '@jsamr',
  'immer',
  'react-hook-form',
  'wonka',
  'use-latest-callback',
  'lan-network',
  '@urql',
  '@0no-co',
];

config.transformer.transformIgnorePatterns = [
  `node_modules/(?!(${packagesToTransform.join('|')}))`,
];

module.exports = config;
