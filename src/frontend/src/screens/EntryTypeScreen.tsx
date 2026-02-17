import { Button } from '@/components/ui/button';
import { UserCircle, Truck } from 'lucide-react';
import AppShell from '../components/AppShell';
import { useTranslation } from '../i18n/I18nProvider';

interface EntryTypeScreenProps {
  onBack: () => void;
  onNext: (type: 'visitor' | 'vehicle') => void;
  selectedType: 'visitor' | 'vehicle' | null;
  onNavigateToHistory: () => void;
}

export default function EntryTypeScreen({ onBack, onNext, selectedType, onNavigateToHistory }: EntryTypeScreenProps) {
  const { t } = useTranslation();

  return (
    <AppShell onNavigateToHistory={onNavigateToHistory}>
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary">{t('entryType.title')}</h1>
          </div>

          <div className="grid gap-4">
            <Button
              onClick={() => onNext('visitor')}
              variant={selectedType === 'visitor' ? 'default' : 'outline'}
              className="h-24 text-xl flex items-center justify-center gap-4"
              size="lg"
            >
              <UserCircle className="w-10 h-10" />
              {t('entryType.visitor')}
            </Button>

            <Button
              onClick={() => onNext('vehicle')}
              variant={selectedType === 'vehicle' ? 'default' : 'outline'}
              className="h-24 text-xl flex items-center justify-center gap-4"
              size="lg"
            >
              <Truck className="w-10 h-10" />
              {t('entryType.vehicle')}
            </Button>
          </div>

          <Button
            onClick={onBack}
            variant="outline"
            className="w-full h-12 text-lg"
            size="lg"
          >
            {t('common.back')}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
