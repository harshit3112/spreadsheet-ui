import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { sheetsApi } from '@/lib/api';
import { FileText, Loader2 } from 'lucide-react';

const CreateSheetPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    rowCount: 100,
    columnCount: 26
  });
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a sheet name",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      const sheet = await sheetsApi.createSheet({
        name: formData.name.trim(),
        userId: "1",
        rowCount: formData.rowCount,
        columnCount: formData.columnCount
      });
      
      toast({
        title: "Success",
        description: `Sheet "${sheet.name}" created successfully`
      });
      
      navigate(`/spreadsheet/${sheet.data}`);
    } catch (error: any) {
      console.error('Failed to create sheet:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create sheet",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Create New Spreadsheet
          </CardTitle>
          <CardDescription className="text-center">
            Set up your new spreadsheet with custom dimensions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Sheet Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter sheet name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rows">Rows</Label>
                <Input
                  id="rows"
                  type="number"
                  min="1"
                  max="1000"
                  value={formData.rowCount}
                  onChange={(e) => handleChange('rowCount', parseInt(e.target.value) || 1)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="columns">Columns</Label>
                <Input
                  id="columns"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.columnCount}
                  onChange={(e) => handleChange('columnCount', parseInt(e.target.value) || 1)}
                  required
                />
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Spreadsheet'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateSheetPage;