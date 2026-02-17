import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppShell from '../components/AppShell';
import { useTranslation } from '../i18n/I18nProvider';
import { saveVehicleRecord } from '../lib/storage/indexedDb';
import { validateRequired, validateTime, validateExitTime } from '../lib/validation';
import { VEHICLE_TYPES, getVehicleTypeIcon } from '../lib/vehicleTypes';
import { toast } from 'sonner';
import type { SessionContext } from '../App';

interface VehicleFormScreenProps {
  sessionContext: SessionContext;
  onBack: () => void;
  onSaveSuccess: () => void;
  onNavigateToHistory: () => void;
}

export default function VehicleFormScreen({ sessionContext, onBack, onSaveSuccess, onNavigateToHistory }: VehicleFormScreenProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    vehicleType: '',
    driverName: '',
    plate: '',
    company: '',
    voucherNumber: '',
    entryTime: '',
    exitTime: '',
    destination: '',
    observations: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!validateRequired(formData.vehicleType)) {
      newErrors.vehicleType = t('validation.required');
    }
    if (!validateRequired(formData.driverName)) {
      newErrors.driverName = t('validation.required');
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
      await saveVehicleRecord({
        ...formData,
        supervisorName: sessionContext.supervisorName,
        accessPoint: sessionContext.accessPoint,
        recordDate: sessionContext.date,
        timestamp: new Date().toISOString(),
      });
      
      toast.success(t('vehicle.saveSuccess'));
      
      // Reset form
      setFormData({
        vehicleType: '',
        driverName: '',
        plate: '',
        company: '',
        voucherNumber: '',
        entryTime: '',
        exitTime: '',
        destination: '',
        observations: '',
      });
      
      // Navigate to history after a short delay
      setTimeout(() => {
        onSaveSuccess();
      }, 1000);
    } catch (error) {
      toast.error(t('vehicle.saveError'));
      console.error('Error saving vehicle record:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppShell onNavigateToHistory={onNavigateToHistory}>
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary">{t('vehicle.title')}</h1>
          </div>

          <div className="space-y-4 bg-card p-6 rounded-lg shadow-sm border">
            <div className="space-y-2">
              <Label htmlFor="vehicleType">{t('vehicle.vehicleType')} *</Label>
              <Select value={formData.vehicleType} onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}>
                <SelectTrigger className={errors.vehicleType ? 'border-destructive' : ''}>
                  <SelectValue placeholder={t('vehicle.vehicleTypePlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {VEHICLE_TYPES.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center gap-3">
                        <img
                          src={getVehicleTypeIcon(type.id)}
                          alt={t(`vehicle.types.${type.id}`)}
                          className="w-6 h-6 object-contain"
                        />
                        <span>{t(`vehicle.types.${type.id}`)}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.vehicleType && <p className="text-sm text-destructive">{errors.vehicleType}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="driverName">{t('vehicle.driverName')} *</Label>
              <Input
                id="driverName"
                value={formData.driverName}
                onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                className={errors.driverName ? 'border-destructive' : ''}
              />
              {errors.driverName && <p className="text-sm text-destructive">{errors.driverName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="plate">{t('vehicle.plate')}</Label>
              <Input
                id="plate"
                value={formData.plate}
                onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">{t('vehicle.company')}</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="voucherNumber">{t('vehicle.voucherNumber')}</Label>
              <Input
                id="voucherNumber"
                value={formData.voucherNumber}
                onChange={(e) => setFormData({ ...formData, voucherNumber: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entryTime">{t('vehicle.entryTime')} *</Label>
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
                <Label htmlFor="exitTime">{t('vehicle.exitTime')}</Label>
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
              <Label htmlFor="destination">{t('vehicle.destination')}</Label>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observations">{t('vehicle.observations')}</Label>
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                rows={3}
              />
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
