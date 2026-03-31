import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        adminService.getAllUsers().then(res => {
            if (res.data.success) setUsers(res.data.data);
        });
    }, []);

    return (
        <div className="container py-4 fade-in">
            <h1 className="fw-bolder mb-4">User <span className="text-primary">Management</span></h1>
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id}>
                                <td className="fw-bold">{u.name}</td>
                                <td>{u.email}</td>
                                <td><span className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>{u.role}</span></td>
                                <td className="text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default AdminUsers;
