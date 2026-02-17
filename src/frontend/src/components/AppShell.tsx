import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { History, Languages } from 'lucide-react';
import { useTranslation } from '../i18n/I18nProvider';
import { SiCaffeine } from 'react-icons/si';

interface AppShellProps {
  children: ReactNode;
  onNavigateToHistory?: () => void;
}

export default function AppShell({ children, onNavigateToHistory }: AppShellProps) {
  const { language, setLanguage, t } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'ar' : 'fr');
  };

  return (
    <div className={`min-h-screen flex flex-col ${language === 'ar' ? 'rtl' : 'ltr'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/athena-logo.dim_512x512.png"
                alt="ATHENA SURVEILLANCE"
                className="w-10 h-10 object-contain"
              />
              <h1 className="text-xl font-bold">ATHENA SURVEILLANCE</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLanguage}
                className="text-primary-foreground hover:bg-primary-foreground/10"
                title={t('common.changeLanguage')}
              >
                <Languages className="w-5 h-5" />
              </Button>
              {onNavigateToHistory && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onNavigateToHistory}
                  className="text-primary-foreground hover:bg-primary-foreground/10"
                  title={t('history.title')}
                >
                  <History className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-muted py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            © {new Date().getFullYear()} ATHENA SURVEILLANCE • Built with{' '}
            <SiCaffeine className="w-4 h-4 text-primary" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
