import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Smartphone, Chrome, MoreVertical, Home, CheckCircle } from 'lucide-react';

export default function InstallOnAndroidHelp() {
  return (
    <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Smartphone className="w-5 h-5" />
          Install on Android
        </DialogTitle>
        <DialogDescription>
          This is a web application (PWA) that can be installed on your Android device. An Android APK is not available from this project.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6 py-4">
        <div className="space-y-4">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Chrome className="w-4 h-4" />
            Installation Steps for Android Chrome:
          </h3>
          
          <ol className="space-y-4 text-sm">
            <li className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                1
              </span>
              <div className="flex-1">
                <p className="font-medium mb-1">Open the browser menu</p>
                <p className="text-muted-foreground">
                  Tap the three vertical dots <MoreVertical className="inline w-3 h-3" /> in the top-right corner of Chrome
                </p>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                2
              </span>
              <div className="flex-1">
                <p className="font-medium mb-1">Select "Add to Home screen" or "Install app"</p>
                <p className="text-muted-foreground">
                  Look for the option with a <Home className="inline w-3 h-3" /> icon in the menu
                </p>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                3
              </span>
              <div className="flex-1">
                <p className="font-medium mb-1">Confirm the installation</p>
                <p className="text-muted-foreground">
                  Tap "Add" or "Install" in the confirmation dialog
                </p>
              </div>
            </li>
          </ol>
        </div>

        <div className="bg-muted rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success" />
            Offline Use
          </h4>
          <p className="text-sm text-muted-foreground">
            After the first successful load while online, this app will work offline. All your data is stored locally on your device.
          </p>
        </div>
      </div>
    </DialogContent>
  );
}
