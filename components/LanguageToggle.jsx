'use client';
import { useLanguage } from '@/providers/LanguageProvider';

export default function LanguageToggle({ className }) {
  const { language, setLanguage } = useLanguage();
  const next = language === 'ar' ? 'en' : 'ar';

  return (
    <button
      type="button"
      onClick={() => setLanguage(next)}
      className={className}
      aria-label={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      {language === 'ar' ? '🇬🇧 EN' : '🇸🇦 عربي'}
    </button>
  );
}