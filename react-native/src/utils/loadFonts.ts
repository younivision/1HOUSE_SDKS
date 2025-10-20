/**
 * Font Loading Utility for Expo
 * 
 * This file helps with font loading in Expo apps.
 * For bare React Native, fonts are linked via react-native.config.js
 */

import * as Font from 'expo-font';

export async function loadFonts() {
  await Font.loadAsync({
    // Poppins fonts
    'Poppins-Regular': require('../../../fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../../../fonts/Poppins/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('../../../fonts/Poppins/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('../../../fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-Light': require('../../../fonts/Poppins/Poppins-Light.ttf'),
    
    // Inter Display fonts
    'InterDisplay-Regular': require('../../../fonts/Inter/interdisplay-regular.ttf'),
    'InterDisplay-Medium': require('../../../fonts/Inter/interdisplay-medium.ttf'),
    'InterDisplay-SemiBold': require('../../../fonts/Inter/interdisplay-semibold.ttf'),
    'InterDisplay-Light': require('../../../fonts/Inter/interdisplay-light.ttf'),
  });
}

export const fonts = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
  light: 'Poppins-Light',
  displayRegular: 'InterDisplay-Regular',
  displayMedium: 'InterDisplay-Medium',
  displaySemiBold: 'InterDisplay-SemiBold',
  displayLight: 'InterDisplay-Light',
};

