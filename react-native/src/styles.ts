export interface Theme {
  background: string;
  text: string;
  textSecondary: string;
  headerBackground: string;
  messageBackground: string;
  inputBackground: string;
  inputContainerBackground: string;
  sidebarBackground: string;
  border: string;
}

export const themes: Record<'light' | 'dark', Theme> = {
  dark: {
    background: '#18181b',
    text: '#efeff1',
    textSecondary: 'rgba(239, 239, 241, 0.5)',
    headerBackground: '#1f1f23',
    messageBackground: 'rgba(255, 255, 255, 0.03)',
    inputBackground: '#2e2e33',
    inputContainerBackground: '#1f1f23',
    sidebarBackground: '#1f1f23',
    border: '#2e2e33',
  },
  light: {
    background: '#ffffff',
    text: '#0e0e10',
    textSecondary: 'rgba(14, 14, 16, 0.5)',
    headerBackground: '#f7f7f8',
    messageBackground: 'rgba(0, 0, 0, 0.02)',
    inputBackground: '#ffffff',
    inputContainerBackground: '#f7f7f8',
    sidebarBackground: '#f7f7f8',
    border: '#e5e5e8',
  },
};

// Font families for React Native
export const fonts = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
  displayRegular: 'InterDisplay-Regular',
  displayMedium: 'InterDisplay-Medium',
  displaySemiBold: 'InterDisplay-SemiBold',
  displayLight: 'InterDisplay-Light',
};

