import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Sheet, sheetsApi } from '@/lib/api';
import SpreadsheetHeader from '@/components/spreadsheet/SpreadsheetHeader';
import SpreadsheetGrid from '@/components/spreadsheet/SpreadsheetGrid';
import { Loader2 } from 'lucide-react';

const SpreadsheetPage = () => {
  const { sheetId } = useParams<{ sheetId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sheetId) {
      navigate('/sheet');
      return;
    }

    const loadSheet = async () => {
      try {
        setLoading(true);
        setError(null);
        const sheetData = await sheetsApi.getSheet(sheetId);
        setSheet(sheetData);
      } catch (error: any) {
        console.error('Failed to load sheet:', error);
        const errorMessage = error.response?.data?.message || 'Failed to load sheet';
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadSheet();
  }, [sheetId, navigate, toast]);

  const handleSheetUpdate = (updatedSheet: Sheet) => {
    setSheet(updatedSheet);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading spreadsheet...</span>
        </div>
      </div>
    );
  }

  if (error || !sheet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Error</h1>
          <p className="text-muted-foreground mb-4">
            {error || 'Sheet not found'}
          </p>
          <button
            onClick={() => navigate('/sheet')}
            className="text-primary hover:underline"
          >
            Create a new sheet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-sheet-background">
      <SpreadsheetHeader
        sheetName={sheet.name}
        sheetId={sheet.id}
        lastSaved={sheet.updatedAt}
      />
      <div className="flex-1 overflow-hidden">
        <SpreadsheetGrid
          sheet={sheet}
          onSheetUpdate={handleSheetUpdate}
        />
      </div>
    </div>
  );
};

export default SpreadsheetPage;