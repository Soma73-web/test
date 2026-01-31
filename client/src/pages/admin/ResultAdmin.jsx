import React, { useEffect, useState } from 'react';
import api from '../../api'; // Axios instance with baseURL
import { notifyContentUpdate } from '../../hooks/useAutoRefresh';

const ResultAdmin = () => {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedYear, setSelectedYear] = useState('all');
  const [availableYears, setAvailableYears] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: '',
    rank: '',
    college: '',
    year: '',
    image: null,
  });
  const [preview, setPreview] = useState(null); // Thumbnail preview

  // ─────── Fetch results once ───────
  useEffect(() => {
    fetchResults();
  }, []);

  // ─────── Filter results when year changes ───────
  useEffect(() => {
    if (selectedYear === 'all') {
      setFilteredResults(results);
    } else {
      setFilteredResults(results.filter(r => r.year === selectedYear));
    }
  }, [selectedYear, results]);

  // ─────── Get all results ───────
  const fetchResults = async () => {
    try {
      const { data } = await api.get('/api/results');
      const resultsData = data || [];
      setResults(resultsData);
      
      // Extract unique years and sort them
      const years = [...new Set(resultsData.map(r => r.year))].sort((a, b) => b - a);
      setAvailableYears(years);
    } catch (err) {
      console.error('Error fetching results:', err);
      alert('Failed to load results.');
    }
  };

  // ─────── Handle input changes ───────
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const file = files?.[0];
    setForm((prev) => ({ ...prev, [name]: file || value }));

    if (name === 'image' && file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // ─────── Submit form ───────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('rank', form.rank);
    fd.append('college', form.college);
    fd.append('year', form.year);
    if (form.image) fd.append('image', form.image);

    try {
      if (form.id) {
        await api.put(`/api/results/${form.id}`, fd);
      } else {
        await api.post('/api/results', fd);
      }
      fetchResults();
      resetForm();
      
      // Trigger frontend refresh across all pages
      notifyContentUpdate('content-updated');
    } catch (err) {
      console.error('Error saving result:', err);
      alert('Failed to save result.');
    }
  };

  // ─────── Reset form ───────
  const resetForm = () => {
    setForm({
      id: null,
      name: '',
      rank: '',
      college: '',
      year: '',
      image: null,
    });
    setPreview(null);
    
    // Reset form inputs
    const formElement = document.querySelector("form");
    if (formElement) formElement.reset();
  };

  // ─────── Edit row ───────
  const handleEdit = (item) => {
    setForm({
      id: item.id,
      name: item.name,
      rank: item.rank,
      college: item.college,
      year: item.year,
      image: null, // Must upload new image to change
    });
    setPreview(`/api/results/${item.id}/image`);
  };

  // ─────── Delete row ───────
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this result?')) return;
    
    // Store original state before optimistic update
    const originalResults = [...results];

    try {
      // Optimistic update - remove from UI immediately
      const updatedResults = results.filter(r => r.id !== id);
      setResults(updatedResults);

      await api.delete(`/api/results/${id}`);
      
      // Trigger frontend refresh across all pages
      notifyContentUpdate('content-updated');
      
      // Don't call fetchResults() here - the optimistic update is already applied
    } catch (err) {
      console.error('Error deleting result:', err);
      alert('Failed to delete result.');
      // Revert optimistic update on error
      setResults(originalResults);
    }
  };

  // ─────── UI ───────
  return (
    <div className="border p-6 bg-white rounded shadow mb-10">
      <h2 className="text-xl font-semibold mb-4 text-blue-800">Manage Results</h2>

      {/* ─────── Year Filter ─────── */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Year:
        </label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border px-4 py-2 rounded bg-white"
        >
          <option value="all">All Years</option>
          {availableYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <span className="ml-4 text-sm text-gray-600">
          Showing {filteredResults.length} of {results.length} results
        </span>
      </div>

      {/* ─────── Form ─────── */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {['name', 'rank', 'college', 'year'].map((field) => (
          <input
            key={field}
            name={field}
            value={form[field]}
            onChange={handleChange}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            required
            className="border px-4 py-2 rounded"
          />
        ))}

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="border px-4 py-2 rounded"
        />

        {preview && (
          <div className="md:col-span-2">
            <img src={preview} alt="Preview" className="h-24 rounded shadow mx-auto" />
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded col-span-1 md:col-span-2"
        >
          {form.id ? 'Update Result' : 'Add Result'}
        </button>
      </form>

      {/* ─────── Results List ─────── */}
      <div className="space-y-6">
        {availableYears.length > 0 && selectedYear === 'all' ? (
          // Group by year when showing all
          availableYears.map(year => {
            const yearResults = results.filter(r => r.year === year);
            return (
              <div key={year} className="border rounded-lg p-4 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
                  Year {year} ({yearResults.length} results)
                </h3>
                <ul className="space-y-3">
                  {yearResults.map((r) => (
                    <li key={r.id} className="flex justify-between items-center bg-white p-3 rounded shadow-sm">
                      <div className="flex items-center gap-3">
                        <img
                          src={`/api/results/${r.id}/image`}
                          alt={r.name}
                          className="w-12 h-12 object-cover rounded-full border"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <div className="w-12 h-12 bg-gray-200 rounded-full border flex items-center justify-center text-gray-500 text-xs" style={{display: 'none'}}>
                          No Image
                        </div>
                        <div>
                          <p className="font-medium">{r.name} — Rank {r.rank}</p>
                          <p className="text-sm text-gray-600">{r.college}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => handleEdit(r)} className="text-blue-600 hover:underline">Edit</button>
                        <button onClick={() => handleDelete(r.id)} className="text-red-600 hover:underline">Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })
        ) : (
          // Show filtered results
          <ul className="space-y-3">
            {filteredResults.map((r) => (
              <li key={r.id} className="flex justify-between items-center bg-gray-100 p-3 rounded">
                <div className="flex items-center gap-3">
                  <img
                    src={`/api/results/${r.id}/image`}
                    alt={r.name}
                    className="w-12 h-12 object-cover rounded-full border"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="w-12 h-12 bg-gray-200 rounded-full border flex items-center justify-center text-gray-500 text-xs" style={{display: 'none'}}>
                    No Image
                  </div>
                  <div>
                    <p className="font-medium">{r.name} — Rank {r.rank}</p>
                    <p className="text-sm text-gray-600">{r.college} ({r.year})</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleEdit(r)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(r.id)} className="text-red-600 hover:underline">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
        
        {filteredResults.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {selectedYear === 'all' ? 'No results found.' : `No results found for year ${selectedYear}.`}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultAdmin;
