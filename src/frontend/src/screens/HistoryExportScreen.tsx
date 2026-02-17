import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, FileDown, Clock } from 'lucide-react';
import AppShell from '../components/AppShell';
import { useTranslation } from '../i18n/I18nProvider';
import { getAllVisitorRecords, getAllVehicleRecords, updateVisitorExitTime, updateVehicleExitTime } from '../lib/storage/indexedDb';
import { exportToPdf } from '../lib/pdf/exportToPdf';
import type { VisitorRecord, VehicleRecord } from '../lib/storage/types';
import { toast } from 'sonner';

interface HistoryExportScreenProps {
  onBack: () => void;
  onNewEntry: () => void;
}

type RecordType = 'all' | 'visitor' | 'vehicle';
type SortBy = 'date' | 'time';

export default function HistoryExportScreen({ onBack, onNewEntry }: HistoryExportScreenProps) {
  const { t } = useTranslation();
  const [visitorRecords, setVisitorRecords] = useState<VisitorRecord[]>([]);
  const [vehicleRecords, setVehicleRecords] = useState<VehicleRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<RecordType>('all');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [editingRecord, setEditingRecord] = useState<{ type: 'visitor' | 'vehicle'; id: number; exitTime: string } | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const visitors = await getAllVisitorRecords();
      const vehicles = await getAllVehicleRecords();
      setVisitorRecords(visitors);
      setVehicleRecords(vehicles);
    } catch (error) {
      console.error('Error loading records:', error);
      toast.error(t('history.loadError'));
    }
  };

  const handleUpdateExitTime = async () => {
    if (!editingRecord) return;

    try {
      if (editingRecord.type === 'visitor') {
        await updateVisitorExitTime(editingRecord.id, editingRecord.exitTime);
      } else {
        await updateVehicleExitTime(editingRecord.id, editingRecord.exitTime);
      }
      await loadRecords();
      setEditingRecord(null);
      toast.success(t('history.exitTimeUpdated'));
    } catch (error) {
      console.error('Error updating exit time:', error);
      toast.error(t('history.updateError'));
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const filteredVisitors = filterType === 'vehicle' ? [] : visitorRecords;
      const filteredVehicles = filterType === 'visitor' ? [] : vehicleRecords;
      
      await exportToPdf(filteredVisitors, filteredVehicles);
      toast.success(t('history.exportSuccess'));
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error(t('history.exportError'));
    } finally {
      setIsExporting(false);
    }
  };

  const filterAndSortRecords = () => {
    let allRecords: Array<{ type: 'visitor' | 'vehicle'; record: VisitorRecord | VehicleRecord }> = [];

    if (filterType === 'all' || filterType === 'visitor') {
      allRecords.push(...visitorRecords.map(r => ({ type: 'visitor' as const, record: r })));
    }
    if (filterType === 'all' || filterType === 'vehicle') {
      allRecords.push(...vehicleRecords.map(r => ({ type: 'vehicle' as const, record: r })));
    }

    // Filter by search query
    if (searchQuery) {
      allRecords = allRecords.filter(({ record }) => {
        const searchLower = searchQuery.toLowerCase();
        if ('visitorName' in record) {
          return (
            record.visitorName.toLowerCase().includes(searchLower) ||
            record.personVisited.toLowerCase().includes(searchLower) ||
            record.company.toLowerCase().includes(searchLower)
          );
        } else {
          return (
            record.driverName.toLowerCase().includes(searchLower) ||
            record.company.toLowerCase().includes(searchLower) ||
            record.vehicleType.toLowerCase().includes(searchLower)
          );
        }
      });
    }

    // Sort
    allRecords.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.record.timestamp).getTime() - new Date(a.record.timestamp).getTime();
      } else {
        return b.record.entryTime.localeCompare(a.record.entryTime);
      }
    });

    return allRecords;
  };

  const filteredRecords = filterAndSortRecords();

  return (
    <AppShell onNavigateToHistory={() => {}}>
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-primary">{t('history.title')}</h1>
            <Button onClick={onNewEntry} size="lg">
              {t('history.newEntry')}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-lg border">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder={t('history.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={(value) => setFilterType(value as RecordType)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('history.filterAll')}</SelectItem>
                <SelectItem value="visitor">{t('history.filterVisitor')}</SelectItem>
                <SelectItem value="vehicle">{t('history.filterVehicle')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">{t('history.sortByDate')}</SelectItem>
                <SelectItem value="time">{t('history.sortByTime')}</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExport} disabled={isExporting} className="gap-2">
              <FileDown className="w-5 h-5" />
              {isExporting ? t('history.exporting') : t('history.exportPdf')}
            </Button>
          </div>

          <div className="bg-card rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('history.type')}</TableHead>
                    <TableHead>{t('history.name')}</TableHead>
                    <TableHead>{t('history.company')}</TableHead>
                    <TableHead>{t('history.accessPoint')}</TableHead>
                    <TableHead>{t('history.entryTime')}</TableHead>
                    <TableHead>{t('history.exitTime')}</TableHead>
                    <TableHead>{t('history.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        {t('history.noRecords')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRecords.map(({ type, record }) => (
                      <TableRow key={`${type}-${record.id}`}>
                        <TableCell className="font-medium">
                          {type === 'visitor' ? t('entryType.visitor') : t('entryType.vehicle')}
                        </TableCell>
                        <TableCell>
                          {'visitorName' in record ? record.visitorName : record.driverName}
                        </TableCell>
                        <TableCell>{record.company || '-'}</TableCell>
                        <TableCell>{record.accessPoint}</TableCell>
                        <TableCell>{record.entryTime}</TableCell>
                        <TableCell>{record.exitTime || '-'}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingRecord({ type, id: record.id!, exitTime: record.exitTime || '' })}
                              >
                                <Clock className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{t('history.updateExitTime')}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="exitTime">{t('history.exitTime')}</Label>
                                  <Input
                                    id="exitTime"
                                    type="time"
                                    value={editingRecord?.exitTime || ''}
                                    onChange={(e) => setEditingRecord(editingRecord ? { ...editingRecord, exitTime: e.target.value } : null)}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button onClick={handleUpdateExitTime}>{t('common.save')}</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <Button onClick={onBack} variant="outline" className="w-full h-12">
            {t('common.back')}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
