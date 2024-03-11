import React, { useState } from 'react';
import './StatusDialog.css'

const StatusDialog = ({ currentStatus, onUpdate, onCancel }) => {
    const [selectedStatus, setSelectedStatus] = useState('');

    const handleUpdate = () => {
        onUpdate(selectedStatus);
    };

    const handleCancel = () => {
        onCancel();
    };

    return (
        <div className="dialog-overlay">
            <div className="dialog">
                <div className="dialog-header">
                    <h2>Update Status</h2>
                </div>
                <div className="dialog-body">
                    <p>Current Status: {currentStatus}</p>
                    <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                        <option value="">Select Status</option>
                        <option value="REVIEWED">Reviewed</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                </div>
                <div className="dialog-footer">
                    <button onClick={handleCancel}>Cancel</button>
                    <button onClick={handleUpdate} disabled={!selectedStatus}>Update</button>
                </div>
            </div>
        </div>
    );
};

export default StatusDialog;
