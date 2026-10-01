import React, { createContext, useContext, useState } from 'react';
import { COLORS, SIZES } from '@constants/theme';

interface ThemeContextType {
  isDarkMode: boolean;
  colors: typeof COLORS;
  sizes: typeof SIZES;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  colors: COLORS,
  sizes: SIZES,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        colors: COLORS,
        sizes: SIZES,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
