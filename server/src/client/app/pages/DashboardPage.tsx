import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { deviceApi, authApi, Device } from '../api/client';
import { Link } from 'react-router';

export default function DashboardPage() {
  const { user } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Create device form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  // Create token modal
  const [showTokenForm, setShowTokenForm] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [tokenName, setTokenName] = useState('');
  const [creatingToken, setCreatingToken] = useState(false);
  const [tokenError, setTokenError] = useState('');
  const [newToken, setNewToken] = useState<string>('');

  const fetchDevices = async () => {
    if (!user?.authToken) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await deviceApi.list(user.authToken);
      
      if (response.errorMessage) {
        setError(response.errorMessage);
      } else if (response.data?.devices) {
        setDevices(response.data.devices);
      }
    } catch (err) {
      setError('Failed to load devices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, [user?.authToken]);

  const handleCreateDevice = async (e: FormEvent) => {
    e.preventDefault();
    if (!user?.authToken) return;
    
    setCreating(true);
    setCreateError('');
    
    try {
      const response = await deviceApi.create(user.authToken, newDeviceName);
      
      if (response.errorMessage) {
        setCreateError(response.errorMessage);
      } else if (response.data?.deviceId) {
        // Refresh devices list to get the new device
        await fetchDevices();
        setNewDeviceName('');
        setShowCreateForm(false);
      }
    } catch (err) {
      setCreateError('Failed to create device');
    } finally {
      setCreating(false);
    }
  };

  const handleCreateToken = async (e: FormEvent) => {
    e.preventDefault();
    if (!user?.authToken) return;
    
    setCreatingToken(true);
    setTokenError('');
    setNewToken('');
    
    try {
      const response = await authApi.createToken(user.authToken, tokenName);
      
      if (response.errorMessage) {
        setTokenError(response.errorMessage);
      } else if (response.data?.deviceToken) {
        setNewToken(response.data.deviceToken);
        setTokenName('');
      }
    } catch (err) {
      setTokenError('Failed to create token');
    } finally {
      setCreatingToken(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  const openTokenModal = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    setShowTokenForm(true);
    setNewToken('');
    setTokenError('');
  };

  const closeTokenModal = () => {
    setShowTokenForm(false);
    setTokenName('');
    setNewToken('');
    setTokenError('');
  };

  return (
    <div className="page dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowCreateForm(true)}
        >
          + Add Device
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Create Device Modal */}
      {showCreateForm && (
        <div className="modal-overlay" onClick={() => setShowCreateForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Device</h2>
            
            {createError && <div className="error-message">{createError}</div>}
            
            <form onSubmit={handleCreateDevice}>
              <div className="form-group">
                <label htmlFor="deviceName">Device Name</label>
                <input
                  type="text"
                  id="deviceName"
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                  required
                  placeholder="e.g., Living Room Sensor"
                  disabled={creating}
                />
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowCreateForm(false)}
                  disabled={creating}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={creating}
                >
                  {creating ? 'Creating...' : 'Create Device'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Token Modal */}
      {showTokenForm && (
        <div className="modal-overlay" onClick={closeTokenModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create Device Token</h2>
            
            {tokenError && <div className="error-message">{tokenError}</div>}
            
            {newToken ? (
              <div className="token-display">
                <p className="token-warning">
                  Save this token! It won't be shown again.
                </p>
                <div className="token-value">
                  <code>{newToken}</code>
                  <button 
                    className="btn btn-small"
                    onClick={() => copyToClipboard(newToken)}
                  >
                    Copy
                  </button>
                </div>
                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={closeTokenModal}
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateToken}>
                <div className="form-group">
                  <label htmlFor="tokenName">Token Name</label>
                  <input
                    type="text"
                    id="tokenName"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    required
                    placeholder="e.g., API Key 1"
                    disabled={creatingToken}
                  />
                </div>
                
                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={closeTokenModal}
                    disabled={creatingToken}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={creatingToken}
                  >
                    {creatingToken ? 'Creating...' : 'Create Token'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading devices...</div>
      ) : devices.length === 0 ? (
        <div className="empty-state">
          <p>No devices yet. Add your first device to get started!</p>
        </div>
      ) : (
        <div className="devices-grid">
          {devices.map((device) => (
            <div key={device.id} className="device-card">
              <Link to={`/device/${device.deviceId}`} className="device-card-link">
                <div className="device-header">
                  <h3>{device.name}</h3>
                </div>
                <div className="device-info">
                  <p className="device-id">
                    <strong>Device ID:</strong>
                    <code className="device-code">{device.deviceId}</code>
                  </p>
                </div>
              </Link>
              <div className="device-actions">
                <button 
                  className="btn-icon"
                  onClick={(e) => {
                    e.preventDefault();
                    copyToClipboard(device.deviceId);
                  }}
                  title="Copy Device ID"
                >
                  📋
                </button>
                <button 
                  className="btn btn-small btn-primary"
                  onClick={() => openTokenModal(device.deviceId)}
                >
                  + Create API Token
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
