import React from 'react';

export const columnToLetter = (column: number): string => {
  let result = '';
  while (column >= 0) {
    result = String.fromCharCode(65 + (column % 26)) + result;
    column = Math.floor(column / 26) - 1;
  }
  return result;
};

export const letterToColumn = (letter: string): number => {
  let result = 0;
  for (let i = 0; i < letter.length; i++) {
    result = result * 26 + (letter.charCodeAt(i) - 64);
  }
  return result - 1;
};

export const getCellRef = (row: number, column: number): string => {
  return `${columnToLetter(column)}${row + 1}`;
};

export const parseCellRef = (cellRef: string): { row: number; column: number } => {
  const match = cellRef.match(/^([A-Z]+)(\d+)$/);
  if (!match) throw new Error(`Invalid cell reference: ${cellRef}`);
  
  const [, letters, numbers] = match;
  return {
    row: parseInt(numbers) - 1,
    column: letterToColumn(letters)
  };
};

export const generateEmptyGrid = (rows: number, columns: number) => {
  const grid = [];
  
  for (let row = 0; row < rows; row++) {
    const rowData: Record<string, any> = { id: row };
    for (let col = 0; col < columns; col++) {
      const colLetter = columnToLetter(col);
      rowData[colLetter] = '';
    }
    grid.push(rowData);
  }
  
  return grid;
};

export const createColumns = (columnCount: number) => {
  const columns = [];
  
  for (let i = 0; i < columnCount; i++) {
    const key = columnToLetter(i);
    
    columns.push({
      key,
      name: key,
      width: 120,
      resizable: true,
      sortable: false,
      editable: true,
      renderCell: ({ row }: any) => {
        return row[key] || '';
      },
      renderEditCell: ({ row, onRowChange }: any) => {
        return (
          <input
            className="w-full h-full px-2 border-0 outline-none bg-sheet-cell-editing"
            value={row[key] || ''}
            onChange={(e) => {
              onRowChange({ ...row, [key]: e.target.value });
            }}
            autoFocus
          />
        );
      }
    });
  }
  
  return columns;
};