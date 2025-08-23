import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Appearance } from 'react-native';
import { colors } from '@/utils/theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: ThemeMode;
  isDark: boolean;
}

const getSystemIsDark = () => Appearance.getColorScheme() === 'dark';

const initialState: ThemeState = {
  theme: 'system',
  isDark: getSystemIsDark(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.theme = action.payload;
      state.isDark =
        action.payload === 'system'
          ? getSystemIsDark()
          : action.payload === 'dark';
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;

// Selectors
export const selectTheme = (state: { theme: ThemeState }) => state.theme.theme;
export const selectIsDark = (state: { theme: ThemeState }) => state.theme.isDark;
export const selectColors = () => colors; 