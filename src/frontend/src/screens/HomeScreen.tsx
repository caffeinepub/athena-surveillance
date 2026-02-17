import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from 'lucide-react';
import AppShell from '../components/AppShell';
import { useTranslation } from '../i18n/I18nProvider';
import { ACCESS_POINTS, getAccessPointIcon } from '../lib/accessPoints';
import type { SessionContext } from '../App';

interface HomeScreenProps {
  onNext: (context: SessionContext) => void;
  initialContext: SessionContext;
  onNavigateToHistory: () => void;
}

export default function HomeScreen({ onNext, initialContext, onNavigateToHistory }: HomeScreenProps) {
  const { t } = useTranslation();
  const [supervisorName, setSupervisorName] = useState(initialContext.supervisorName);
  const [accessPoint, setAccessPoint] = useState(initialContext.accessPoint);
  const [errors, setErrors] = useState<{ supervisorName?: string; accessPoint?: string }>({});

  const today = new Date().toLocaleDateString(t('locale'), {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const validate = () => {
    const newErrors: { supervisorName?: string; accessPoint?: string } = {};
    
    if (!supervisorName.trim()) {
      newErrors.supervisorName = t('validation.required');
    }
    
    if (!accessPoint) {
      newErrors.accessPoint = t('validation.required');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext({
        supervisorName: supervisorName.trim(),
        accessPoint,
        date: new Date().toISOString().split('T')[0],
      });
    }
  };

  return (
    <AppShell onNavigateToHistory={onNavigateToHistory}>
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-primary">{t('home.title')}</h1>
            <p className="text-lg text-muted-foreground">{today}</p>
          </div>

          <div className="space-y-6 bg-card p-6 rounded-lg shadow-sm border">
            <div className="space-y-2">
              <Label htmlFor="supervisor" className="text-base flex items-center gap-2">
                <User className="w-5 h-5" />
                {t('home.supervisorName')}
              </Label>
              <Input
                id="supervisor"
                type="text"
                value={supervisorName}
                onChange={(e) => setSupervisorName(e.target.value)}
                placeholder={t('home.supervisorPlaceholder')}
                className={`h-12 text-base ${errors.supervisorName ? 'border-destructive' : ''}`}
              />
              {errors.supervisorName && (
                <p className="text-sm text-destructive">{errors.supervisorName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="accessPoint" className="text-base">
                {t('home.accessPoint')}
              </Label>
              <Select value={accessPoint} onValueChange={setAccessPoint}>
                <SelectTrigger className={`h-12 text-base ${errors.accessPoint ? 'border-destructive' : ''}`}>
                  <SelectValue placeholder={t('home.accessPointPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {ACCESS_POINTS.map((acp) => (
                    <SelectItem key={acp.id} value={acp.id} className="h-12">
                      <div className="flex items-center gap-3">
                        <img
                          src={getAccessPointIcon(acp.id)}
                          alt={acp.id}
                          className="w-6 h-6 object-contain"
                        />
                        <span className="text-base">{acp.id}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.accessPoint && (
                <p className="text-sm text-destructive">{errors.accessPoint}</p>
              )}
            </div>

            <Button
              onClick={handleNext}
              className="w-full h-12 text-lg"
              size="lg"
            >
              {t('common.next')}
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
