'use client';
import { ThemeProvider } from './ThemeProvider';
import { LanguageProvider } from './LanguageProvider';
import { AuthProvider } from './AuthProvider';
import { ToastProvider } from './ToastProvider';
export default function AppProviders({ children }) {
  return <ThemeProvider><LanguageProvider><ToastProvider><AuthProvider>{children}</AuthProvider></ToastProvider></LanguageProvider></ThemeProvider>;
}
