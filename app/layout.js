import './globals.css';
import AppProviders from '@/providers/AppProviders';

export const metadata = {
  title: 'AdGenie',
  description: 'AI-powered advertising campaign generator',
};

const boot = `
(function(){
  try {
    var theme=localStorage.getItem('adgenie_theme');
    if(!theme) theme=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
    document.documentElement.classList.toggle('dark',theme==='dark');
    document.documentElement.dataset.theme=theme;
    document.documentElement.style.colorScheme=theme;
    var lang=localStorage.getItem('adgenie_lang')==='en'?'en':'ar';
    document.documentElement.lang=lang;
    document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  } catch(e) {}
})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: boot }} /></head>
      <body><AppProviders>{children}</AppProviders></body>
    </html>
  );
}
