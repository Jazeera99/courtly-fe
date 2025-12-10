import React from 'react';

interface Props {
  headers: string[];
  data: string[][];
}

const DataTable: React.FC<Props> = ({ headers, data }) => {
  return (
    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {headers.map(h => (
            <th key={h} style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #eee' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            {row.map((cell, i) => (
              <td key={i} style={{ padding: '8px', borderBottom: '1px solid #fafafa' }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
