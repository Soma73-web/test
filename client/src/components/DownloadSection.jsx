
import React, { useState, useCallback } from 'react';
import api from '../api';
import { FaFileAlt, FaDownload, FaSpinner } from 'react-icons/fa';
import { useAutoRefresh } from '../hooks/useAutoRefresh';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const DownloadSection = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDownloads = useCallback(async (refreshType = 'initial') => {
    try {
      console.log(`Fetching downloads (${refreshType})...`);
      const res = await api.get('/api/downloads');
      
      // Remove duplicates by ID and ensure unique entries
      const uniqueData = res.data.reduce((acc, current) => {
        const x = acc.find(item => item.id === current.id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      
      setDownloads(uniqueData || []);
    } catch (err) {
      console.error('Error fetching downloads:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Use the auto-refresh hook
  useAutoRefresh(fetchDownloads, [], 30000);

  if (!API_BASE_URL) {
    return (
      <div className="text-center text-red-600 py-10">
        ⚠️ <code>REACT_APP_API_BASE_URL</code> not configured.
      </div>
    );
  }

  return (
    <section id="downloads" className="pt-28 pb-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-800">
          Download Study Materials
        </h2>

        {loading ? (
          <div className="text-center py-8 text-blue-600 flex justify-center items-center gap-2">
            <FaSpinner className="animate-spin text-2xl" />
            <span className="text-lg font-medium">Loading files…</span>
          </div>
        ) : downloads.length === 0 ? (
          <p className="text-center text-gray-500">No files uploaded yet.</p>
        ) : (
          <ul className="space-y-4">
            {downloads.map((doc) => (
              <li
                key={doc.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 border rounded shadow p-4"
              >
                <div className="flex items-center gap-3">
                  <FaFileAlt className="text-indigo-500 text-xl" />
                  <span className="text-gray-800 font-medium">{doc.title}</span>
                </div>

                <a
                  href={`${API_BASE_URL}/api/downloads/${doc.id}/download`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 sm:mt-0 inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition text-sm"
                  download
                  onError={e => { e.target.onerror = null; alert('Download failed!'); }}
                >
                  <FaDownload />
                  Download
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default DownloadSection;
