import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Sheet, Cell, sheetsApi } from '@/lib/api';
import { 
  generateEmptyGrid, 
  createColumns, 
  getCellRef, 
  columnToLetter 
} from '@/lib/spreadsheet-utils';

interface SpreadsheetGridProps {
  sheet: Sheet;
  onSheetUpdate: (sheet: Sheet) => void;
}

interface GridRow {
  id: number;
  [key: string]: any;
}

interface Column {
  key: string;
  name: string;
  width: number;
  resizable: boolean;
  sortable: boolean;
  editable: boolean;
  renderCell: (props: any) => React.ReactNode;
  renderEditCell?: (props: any) => React.ReactNode;
}

const SpreadsheetGrid = ({ sheet, onSheetUpdate }: SpreadsheetGridProps) => {
  const [rows, setRows] = useState<GridRow[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  


  // Initialize grid data from sheet
  useEffect(() => {
    try {
      if (!sheet || !sheet.rowCount || !sheet.columnCount) {
        // Create a fallback grid with default values
        const fallbackGrid = generateEmptyGrid(10, 5);
        const fallbackColumns = [
          {
            key: 'id',
            name: '',
            width: 50,
            frozen: true,
            resizable: false,
            sortable: false,
            renderCell: ({ row }) => (
              <div className="flex items-center justify-center h-full bg-sheet-header text-muted-foreground text-sm font-medium">
                {row.id + 1}
              </div>
            )
          },
          ...createColumns(5)
        ];
        setRows(fallbackGrid);
        setColumns(fallbackColumns);
        return;
      }

      const grid = generateEmptyGrid(sheet.rowCount, sheet.columnCount);

      // Populate with existing cell data
      if (sheet.cells && Array.isArray(sheet.cells)) {
        sheet.cells.forEach(cell => {
          const cellParts = cell.cellRef.match(/^([A-Z]+)(\d+)$/);
          if (cellParts) {
            const row = parseInt(cellParts[2]) - 1;
            const col = cellParts[1];
            if (grid[row]) {
              grid[row][col] = cell.value;
            }
          }
        });
      }

      const columns = [
        {
          key: 'id',
          name: '',
          width: 50,
          frozen: true,
          resizable: false,
          sortable: false,
          renderCell: ({ row }) => (
            <div className="flex items-center justify-center h-full bg-sheet-header text-muted-foreground text-sm font-medium">
              {row.id + 1}
            </div>
          )
        },
        ...createColumns(sheet.columnCount)
      ];

      setRows(grid);
      setColumns(columns);
    } catch (error) {
      console.error('Error initializing grid:', error);
    }
  }, [sheet?.id, sheet?.rowCount, sheet?.columnCount]);

  const handleCellChange = useCallback(async (updatedRows: GridRow[]) => {
    setRows(updatedRows);

    // Debounce updates to avoid too many API calls
    if (isUpdating) return;
    setIsUpdating(true);

    setTimeout(async () => {
      try {
        const cells: Cell[] = [];

        updatedRows.forEach((row, rowIndex) => {
          for (let colIndex = 0; colIndex < sheet.columnCount; colIndex++) {
            const cellRef = getCellRef(rowIndex, colIndex);
            const col = columnToLetter(colIndex);
            const value = row[col];

            if (value !== undefined && value !== '') {
              cells.push({
                cellRef,
                value: value
              });
            }
          }
        });

        const updatedSheet = await sheetsApi.updateSheetData(sheet.id, { cells });
        onSheetUpdate(updatedSheet);

      } catch (error) {
        console.error('Failed to update sheet:', error);
        toast({
          title: "Error",
          description: "Failed to update sheet data",
          variant: "destructive"
        });
      } finally {
        setIsUpdating(false);
      }
    }, 1000);
  }, [sheet.id, sheet.columnCount, isUpdating, onSheetUpdate, toast]);

  const addRow = () => {
    const newRowIndex = rows.length;
    const newRow: GridRow = { id: newRowIndex };

    for (let col = 0; col < sheet.columnCount; col++) {
      const colLetter = columnToLetter(col);
      newRow[colLetter] = '';
    }

    setRows(prev => [...prev, newRow]);
  };

  const removeRow = () => {
    if (rows.length > 1) {
      setRows(prev => prev.slice(0, -1));
    }
  };

  const addColumn = () => {
    const newColumnIndex = sheet.columnCount;
    const newColLetter = columnToLetter(newColumnIndex);

    // Add new column to existing rows
    setRows(prev => prev.map(row => ({
      ...row,
      [newColLetter]: ''
    })));

    // Add new column definition
    setColumns(prev => [
      ...prev,
      {
        key: newColLetter,
        name: newColLetter,
        width: 120,
        resizable: true,
        sortable: false,
        editable: true,
        renderCell: ({ row }) => row[newColLetter] || '',
        renderEditCell: ({ row, onRowChange }: any) => (
          <input
            className="w-full h-full px-2 border-0 outline-none bg-sheet-cell-editing"
            value={row[newColLetter] || ''}
            onChange={(e) => {
              onRowChange({ ...row, [newColLetter]: e.target.value });
            }}
            autoFocus
          />
        )
      }
    ]);
  };

  const removeColumn = () => {
    if (sheet.columnCount > 1) {
      const lastColIndex = sheet.columnCount - 1;
      const lastColLetter = columnToLetter(lastColIndex);

    // Remove column from rows
    setRows(prev => prev.map(row => {
      const { [lastColLetter]: removed, ...rest } = row;
      return rest as GridRow;
    }));

      // Remove column definition
      setColumns(prev => prev.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-col h-full">


      {/* Toolbar */}
      <div className="flex items-center gap-2 p-4 border-b bg-sheet-header">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={addRow}
            className="flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Row
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={removeRow}
            disabled={rows.length <= 1}
            className="flex items-center gap-1"
          >
            <Minus className="w-4 h-4" />
            Remove Row
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={addColumn}
            className="flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Column
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={removeColumn}
            disabled={sheet.columnCount <= 1}
            className="flex items-center gap-1"
          >
            <Minus className="w-4 h-4" />
            Remove Column
          </Button>
        </div>

        {isUpdating && (
          <div className="ml-auto text-sm text-muted-foreground">
            Saving...
          </div>
        )}
      </div>

      {/* Spreadsheet Grid */}
      <div className="flex-1 overflow-auto">
        
        {rows.length > 0 && columns.length > 0 ? (
          <div className="h-full overflow-auto">
            {/* Simple HTML table for testing */}
            <table className="w-full border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 px-2 py-1 text-left">#</th>
                  {columns.slice(1).map((col) => (
                    <th key={col.key} className="border border-slate-300 px-2 py-1 text-left">
                      {col.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.id}>
                    <td className="border border-slate-300 px-2 py-1 text-center bg-slate-50">
                      {row.id + 1}
                    </td>
                    {columns.slice(1).map((col) => (
                      <td key={col.key} className="border border-slate-300 px-2 py-1">
                        {row[col.key] || ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div>
              Loading grid... (Rows: {rows.length}, Columns: {columns.length})
              <br />
              <div className="text-xs mt-2">
                Sheet: {sheet?.name || 'No sheet'}, RowCount: {sheet?.rowCount || 0}, ColCount: {sheet?.columnCount || 0}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpreadsheetGrid;