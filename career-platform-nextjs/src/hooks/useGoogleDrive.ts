import { useCallback } from 'react';
import usePicker from 'react-google-drive-picker';

type ViewIdOptions = 'DOCS' | 'DOCS_IMAGES' | 'DOCS_VIDEOS' | 'SPREADSHEETS' | 'PRESENTATIONS' | 'FORMS' | 'DOCS_UPLOAD';

interface PickerConfig {
  viewId?: ViewIdOptions;
  showUploadView?: boolean;
  showUploadFolders?: boolean;
  supportDrives?: boolean;
  multiselect?: boolean;
  callbackFunction: (data: any) => void;
}

interface GoogleDriveDocument {
  id: string;
  name: string;
  mimeType: string;
  lastEditedUtc: number;
  size: string;
  description: string;
  iconUrl: string;
  embedUrl: string;
  type: string;
  url: string;
}

interface GoogleDriveResponse {
  action: string;
  docs: GoogleDriveDocument[];
}

export const useGoogleDrive = () => {
  const [openPickerDialog] = usePicker();

  const openPicker = useCallback((config: PickerConfig) => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const developerKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

    if (!clientId || !developerKey) {
      console.error('Google Drive credentials are not configured');
      return;
    }

    openPickerDialog({
      clientId,
      developerKey,
      viewId: config.viewId,
      showUploadView: config.showUploadView,
      showUploadFolders: config.showUploadFolders,
      supportDrives: config.supportDrives,
      multiselect: config.multiselect,
      callbackFunction: (data: GoogleDriveResponse) => {
        config.callbackFunction(data);
      },
    });
  }, [openPickerDialog]);

  return { openPicker };
};
