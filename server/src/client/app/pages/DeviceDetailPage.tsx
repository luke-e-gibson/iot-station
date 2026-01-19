import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { deviceApi } from '../api/client';

interface DeviceData {
  id: number;
  data: Record<string, unknown>;
}

interface DeviceInfo {
  id: number;
  name: string;
  deviceId: string;
}

export default function DeviceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [device, setDevice] = useState<DeviceInfo | null>(null);
  const [deviceData, setDeviceData] = useState<DeviceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.authToken || !id) return;

    const fetchDeviceData = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await deviceApi.getData(user.authToken, id);

        if (response.errorMessage) {
          setError(response.errorMessage);
        } else if (response.data) {
          setDevice(response.data.device);
          setDeviceData(response.data.data);
        }
      } catch (err) {
        setError('Failed to load device data');
      } finally {
        setLoading(false);
      }
    };

    fetchDeviceData();
  }, [user?.authToken, id]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="page device-detail-page">
        <div className="loading">Loading device data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page device-detail-page">
        <div className="error-message">{error}</div>
        <Link to="/dashboard" className="btn btn-secondary">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!device) {
    return (
      <div className="page device-detail-page">
        <div className="error-message">Device not found</div>
        <Link to="/dashboard" className="btn btn-secondary">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="page device-detail-page">
      <div className="device-detail-header">
        <button 
          onClick={() => navigate('/dashboard')}
          className="btn btn-secondary"
        >
          ← Back
        </button>
        <div className="device-title">
          <h1>{device.name}</h1>
          <p className="device-id-display">
            Device ID: 
            <code>{device.deviceId}</code>
            <button 
              className="btn-icon"
              onClick={() => copyToClipboard(device.deviceId)}
              title="Copy Device ID"
            >
              📋
            </button>
          </p>
        </div>
      </div>

      <div className="device-stats">
        <div className="stat-card">
          <h3>Total Records</h3>
          <p className="stat-value">{deviceData.length}</p>
        </div>
      </div>

      <div className="device-data-section">
        <h2>Data Records</h2>
        
        {deviceData.length === 0 ? (
          <div className="empty-state">
            <p>No data submitted yet for this device.</p>
            <p className="text-muted">Use the device token to submit data via the API.</p>
          </div>
        ) : (
          <div className="data-list">
            {deviceData.map((record) => (
              <div key={record.id} className="data-record">
                <div className="data-record-header">
                  <span className="record-id">Record #{record.id}</span>
                </div>
                <pre className="data-content">
                  {JSON.stringify(record.data, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
