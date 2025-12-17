import React from 'react';

interface DataTableProps {
  headers: string[];
  data: React.ReactNode[][];
  emptyMessage?: string;
}

const DataTable: React.FC<DataTableProps> = ({ headers, data, emptyMessage = 'Tidak ada data' }) => {
  if (data.length === 0) {
    return (
      <div style={{ 
        padding: 40, 
        textAlign: 'center', 
        color: '#6b7280',
        background: '#f9fafb',
        borderRadius: 12
      }}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {headers.map((h, index) => (
            <th key={index} style={{ 
              textAlign: 'left', 
              padding: '16px 20px', 
              borderBottom: '2px solid #e5e7eb',
              background: '#f9fafb',
              color: '#374151',
              fontWeight: 600,
              fontSize: 13,
              textTransform: 'uppercase'
            }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} style={{ 
            transition: 'background-color 0.2s',
            ':hover': {
              backgroundColor: '#f8fafc'
            }
          }}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} style={{ 
                padding: '16px 20px', 
                borderBottom: '1px solid #f3f4f6',
                color: '#374151',
                fontSize: 14
              }}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;