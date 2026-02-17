import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import AppShell from '../components/AppShell';
import { useTranslation } from '../i18n/I18nProvider';
import { saveVisitorRecord } from '../lib/storage/indexedDb';
import { validateRequired, validateTime, validateExitTime } from '../lib/validation';
import { toast } from 'sonner';
import type { SessionContext } from '../App';

interface VisitorFormScreenProps {
  sessionContext: SessionContext;
  onBack: () => void;
  onSaveSuccess: () => void;
  onNavigateToHistory: () => void;
}

export default function VisitorFormScreen({ sessionContext, onBack, onSaveSuccess, onNavigateToHistory }: VisitorFormScreenProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    visitorName: '',
    personVisited: '',
    cinNumber: '',
    vehiclePlate: '',
    company: '',
    entryTime: '',
    exitTime: '',
    destination: '',
    observations: '',
    announced: 'yes',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!validateRequired(formData.visitorName)) {
      newErrors.visitorName = t('validation.required');
    }
    if (!validateRequired(formData.personVisited)) {
      newErrors.personVisited = t('validation.required');
    }
    if (!validateRequired(formData.entryTime)) {
      newErrors.entryTime = t('validation.required');
    } else if (!validateTime(formData.entryTime)) {
      newErrors.entryTime = t('validation.invalidTime');
    }
    if (formData.exitTime && !validateTime(formData.exitTime)) {
      newErrors.exitTime = t('validation.invalidTime');
    }
    if (formData.entryTime && formData.exitTime && !validateExitTime(formData.entryTime, formData.exitTime)) {
      newErrors.exitTime = t('validation.exitBeforeEntry');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    setIsSaving(true);
    try {
      await saveVisitorRecord({
        ...formData,
        supervisorName: sessionContext.supervisorName,
        accessPoint: sessionContext.accessPoint,
        recordDate: sessionContext.date,
        timestamp: new Date().toISOString(),
      });
      
      toast.success(t('visitor.saveSuccess'));
      
      // Reset form
      setFormData({
        visitorName: '',
        personVisited: '',
        cinNumber: '',
        vehiclePlate: '',
        company: '',
        entryTime: '',
        exitTime: '',
        destination: '',
        observations: '',
        announced: 'yes',
      });
      
      // Navigate to history after a short delay
      setTimeout(() => {
        onSaveSuccess();
      }, 1000);
    } catch (error) {
      toast.error(t('visitor.saveError'));
      console.error('Error saving visitor record:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppShell onNavigateToHistory={onNavigateToHistory}>
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary">{t('visitor.title')}</h1>
          </div>

          <div className="space-y-4 bg-card p-6 rounded-lg shadow-sm border">
            <div className="space-y-2">
              <Label htmlFor="visitorName">{t('visitor.visitorName')} *</Label>
              <Input
                id="visitorName"
                value={formData.visitorName}
                onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })}
                className={errors.visitorName ? 'border-destructive' : ''}
              />
              {errors.visitorName && <p className="text-sm text-destructive">{errors.visitorName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="personVisited">{t('visitor.personVisited')} *</Label>
              <Input
                id="personVisited"
                value={formData.personVisited}
                onChange={(e) => setFormData({ ...formData, personVisited: e.target.value })}
                className={errors.personVisited ? 'border-destructive' : ''}
              />
              {errors.personVisited && <p className="text-sm text-destructive">{errors.personVisited}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cinNumber">{t('visitor.cinNumber')}</Label>
              <Input
                id="cinNumber"
                value={formData.cinNumber}
                onChange={(e) => setFormData({ ...formData, cinNumber: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehiclePlate">{t('visitor.vehiclePlate')}</Label>
              <Input
                id="vehiclePlate"
                value={formData.vehiclePlate}
                onChange={(e) => setFormData({ ...formData, vehiclePlate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">{t('visitor.company')}</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entryTime">{t('visitor.entryTime')} *</Label>
                <Input
                  id="entryTime"
                  type="time"
                  value={formData.entryTime}
                  onChange={(e) => setFormData({ ...formData, entryTime: e.target.value })}
                  className={errors.entryTime ? 'border-destructive' : ''}
                />
                {errors.entryTime && <p className="text-sm text-destructive">{errors.entryTime}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="exitTime">{t('visitor.exitTime')}</Label>
                <Input
                  id="exitTime"
                  type="time"
                  value={formData.exitTime}
                  onChange={(e) => setFormData({ ...formData, exitTime: e.target.value })}
                  className={errors.exitTime ? 'border-destructive' : ''}
                />
                {errors.exitTime && <p className="text-sm text-destructive">{errors.exitTime}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">{t('visitor.destination')}</Label>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observations">{t('visitor.observations')}</Label>
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>{t('visitor.announced')}</Label>
              <RadioGroup
                value={formData.announced}
                onValueChange={(value) => setFormData({ ...formData, announced: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="announced-yes" />
                  <Label htmlFor="announced-yes" className="font-normal cursor-pointer">
                    {t('visitor.announcedYes')}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="announced-no" />
                  <Label htmlFor="announced-no" className="font-normal cursor-pointer">
                    {t('visitor.announcedNo')}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={onBack} variant="outline" className="flex-1 h-12">
                {t('common.back')}
              </Button>
              <Button onClick={handleSave} disabled={isSaving} className="flex-1 h-12">
                {isSaving ? t('common.saving') : t('common.save')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
