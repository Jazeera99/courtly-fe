// src/components/admin/UserTable.tsx
import React from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  joinDate: string;
}

interface UserTableProps {
  users: User[];
}

const UserTable: React.FC<UserTableProps> = ({ users }) => {
  return (
    <div className="user-table">
      <table>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Email</th>
            <th>Tanggal Bergabung</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <div className="user-cell">
                  <div className="user-avatar">
                    {user.name.charAt(0)}
                  </div>
                  <span>{user.name}</span>
                </div>
              </td>
              <td>{user.email}</td>
              <td>{user.joinDate}</td>
              <td>
                <div className="action-buttons">
                  <button className="btn-action view">Lihat</button>
                  <button className="btn-action edit">Edit</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;