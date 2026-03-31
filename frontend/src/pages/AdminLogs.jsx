import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';

const AdminLogs = () => {
    const [logs, setLogs] = useState([]);
    useEffect(() => {
        adminService.getLogs().then(res => {
             if (res.data.success) setLogs(res.data.data);
        });
    }, []);

    return (
        <div className="container py-4 fade-in">
            <h1 className="fw-bolder mb-4">System <span className="text-primary">Logs</span></h1>
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Action</th>
                            <th>User ID</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(log => (
                            <tr key={log._id}>
                                <td><span className="badge bg-secondary p-2">{log.action}</span></td>
                                <td className="font-monospace text-muted small">{log.user}</td>
                                <td>{new Date(log.date).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default AdminLogs;
