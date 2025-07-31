import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Share, FileText, LogOut } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

interface SpreadsheetHeaderProps {
  sheetName: string;
  sheetId: string;
  lastSaved?: string;
}

const SpreadsheetHeader = ({ sheetName, sheetId, lastSaved }: SpreadsheetHeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authApi.logout();
    navigate('/login');
  };

  const handleNewSheet = () => {
    navigate('/sheet');
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b bg-background shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-semibold">{sheetName}</h1>
        </div>
        <div className="text-sm text-muted-foreground">
          ID: {sheetId}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {lastSaved && (
          <div className="text-sm text-muted-foreground">
            Last saved: {new Date(lastSaved).toLocaleTimeString()}
          </div>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleNewSheet}
          className="flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          New Sheet
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Share className="w-4 h-4" />
          Share
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default SpreadsheetHeader;