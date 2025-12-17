// src/components/admin/UserTable.tsx
import React from 'react';
import '../../styles/AdminDashboard.css';

interface User {
  id: number;
  name: string;
  email: string;
  joinDate: string;
  status: string;
}

interface UserTableProps {
  users: User[];
}

const UserTable: React.FC<UserTableProps> = ({ users }) => {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Nama</th>
          <th>Email</th>
          <th>Tanggal Bergabung</th>
          <th>Status</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="user-avatar">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#111827' }}>{user.name}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>ID: {user.id}</div>
                </div>
              </div>
            </td>
            <td>{user.email}</td>
            <td style={{ fontWeight: 500 }}>{user.joinDate}</td>
            <td>
              <span className={`status-badge status-${user.status}`}>
                {user.status === 'active' ? 'Aktif' : 
                 user.status === 'pending' ? 'Menunggu' : 
                 user.status === 'inactive' ? 'Nonaktif' : user.status}
              </span>
            </td>
            <td>
              <button className="btn-manage">
                Kelola
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;