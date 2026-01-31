import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const LeadsAdmin = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [popupEnabled, setPopupEnabled] = useState(true);
  const [popupLoading, setPopupLoading] = useState(false);

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('admin_token');
        const res = await axios.get(`${API_BASE}/api/leads`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeads(res.data);
      } catch (err) {
        setError('Failed to fetch leads.');
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  useEffect(() => {
    const fetchPopupConfig = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/leads/popup-config`);
        setPopupEnabled(res.data.enabled);
      } catch (err) {
        // Default to enabled if error
        setPopupEnabled(true);
      }
    };
    fetchPopupConfig();
  }, []);

  const handleTogglePopup = async () => {
    setPopupLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.post(
        `${API_BASE}/api/leads/popup-config`,
        { enabled: !popupEnabled },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPopupEnabled(res.data.enabled);
    } catch (err) {
      alert('Failed to update popup state.');
    } finally {
      setPopupLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading leads..." />;
  if (error) return <div className="text-red-600 p-6">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Leads</h1>
        <button
          onClick={handleTogglePopup}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${popupEnabled ? 'bg-green-600 text-white' : 'bg-gray-400 text-gray-800'}`}
          disabled={popupLoading}
        >
          {popupLoading ? 'Updating...' : popupEnabled ? 'Popup Enabled' : 'Popup Disabled'}
        </button>
      </div>
      {leads.length === 0 ? (
        <div className="text-gray-600">No leads found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Name</th>
                <th className="px-4 py-2 border-b">Phone</th>
                <th className="px-4 py-2 border-b">Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="px-4 py-2 border-b">{lead.name}</td>
                  <td className="px-4 py-2 border-b">{lead.phone}</td>
                  <td className="px-4 py-2 border-b">{new Date(lead.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeadsAdmin; 