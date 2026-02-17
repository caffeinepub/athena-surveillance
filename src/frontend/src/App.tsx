import { useState, useEffect } from 'react';
import { I18nProvider } from './i18n/I18nProvider';
import { Toaster } from '@/components/ui/sonner';
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import EntryTypeScreen from './screens/EntryTypeScreen';
import VisitorFormScreen from './screens/VisitorFormScreen';
import VehicleFormScreen from './screens/VehicleFormScreen';
import HistoryExportScreen from './screens/HistoryExportScreen';

type Screen = 'splash' | 'home' | 'entryType' | 'visitorForm' | 'vehicleForm' | 'history';
type EntryType = 'visitor' | 'vehicle' | null;

export interface SessionContext {
  supervisorName: string;
  accessPoint: string;
  date: string;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [sessionContext, setSessionContext] = useState<SessionContext>({
    supervisorName: '',
    accessPoint: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [entryType, setEntryType] = useState<EntryType>(null);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');

  useEffect(() => {
    // Auto-advance from splash after 2.5 seconds
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        navigateTo('home');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const navigateTo = (screen: Screen, direction: 'left' | 'right' = 'left') => {
    setSlideDirection(direction);
    setCurrentScreen(screen);
  };

  const handleHomeNext = (context: SessionContext) => {
    setSessionContext(context);
    navigateTo('entryType');
  };

  const handleEntryTypeNext = (type: EntryType) => {
    setEntryType(type);
    if (type === 'visitor') {
      navigateTo('visitorForm');
    } else if (type === 'vehicle') {
      navigateTo('vehicleForm');
    }
  };

  const handleFormSaveSuccess = () => {
    // After successful save, navigate to history
    navigateTo('history');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'home':
        return (
          <HomeScreen
            onNext={handleHomeNext}
            initialContext={sessionContext}
            onNavigateToHistory={() => navigateTo('history')}
          />
        );
      case 'entryType':
        return (
          <EntryTypeScreen
            onBack={() => navigateTo('home', 'right')}
            onNext={handleEntryTypeNext}
            selectedType={entryType}
            onNavigateToHistory={() => navigateTo('history')}
          />
        );
      case 'visitorForm':
        return (
          <VisitorFormScreen
            sessionContext={sessionContext}
            onBack={() => navigateTo('entryType', 'right')}
            onSaveSuccess={handleFormSaveSuccess}
            onNavigateToHistory={() => navigateTo('history')}
          />
        );
      case 'vehicleForm':
        return (
          <VehicleFormScreen
            sessionContext={sessionContext}
            onBack={() => navigateTo('entryType', 'right')}
            onSaveSuccess={handleFormSaveSuccess}
            onNavigateToHistory={() => navigateTo('history')}
          />
        );
      case 'history':
        return (
          <HistoryExportScreen
            onBack={() => navigateTo('home', 'right')}
            onNewEntry={() => navigateTo('home', 'right')}
          />
        );
      default:
        return <HomeScreen onNext={handleHomeNext} initialContext={sessionContext} onNavigateToHistory={() => navigateTo('history')} />;
    }
  };

  return (
    <I18nProvider>
      <div className="min-h-screen bg-background">
        <div
          key={currentScreen}
          className={`animate-in ${slideDirection === 'left' ? 'slide-in-from-right' : 'slide-in-from-left'} duration-300`}
        >
          {renderScreen()}
        </div>
        <Toaster />
      </div>
    </I18nProvider>
  );
}

export default App;
