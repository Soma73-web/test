import React, { useState } from 'react';
import api from '../../api';
import { notifyContentUpdate } from '../../hooks/useAutoRefresh';

const TestimonialAdmin = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: '',
    college: '',
    message: '',
    video_link: '', // YouTube link
    instagram_link: '', // Instagram link
  });

  const fetchTestimonials = async () => {
    try {
      const res = await api.get('/api/testimonials');
      setTestimonials(res.data || []);
    } catch (err) {
      console.error('Failed to fetch testimonials:', err);
      alert('Could not load testimonials.');
    }
  };

  // Initial fetch
  fetchTestimonials();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await api.put(`/api/testimonials/${form.id}`, form);
      } else {
        await api.post('/api/testimonials', form);
      }
      fetchTestimonials();
      resetForm();
      
      // Trigger frontend refresh across all pages
      notifyContentUpdate('content-updated');
      
      // Reset form inputs
      const formElement = document.querySelector("form");
      if (formElement) formElement.reset();
    } catch (err) {
      console.error('Error submitting testimonial:', err);
      alert('Failed to save testimonial.');
    }
  };

  const resetForm = () => {
    setForm({ id: null, name: '', college: '', message: '', video_link: '', instagram_link: '' });
  };

  const handleEdit = (item) => {
    setForm({ ...item });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      // Store original state before optimistic update
      const originalTestimonials = [...testimonials];

      try {
        // Optimistic update - remove from UI immediately
        const updatedTestimonials = testimonials.filter(t => t.id !== id);
        setTestimonials(updatedTestimonials);

        await api.delete(`/api/testimonials/${id}`);
        
        // Trigger frontend refresh across all pages
        notifyContentUpdate('content-updated');
        
        // Don't call fetchTestimonials() here - the optimistic update is already applied
      } catch (err) {
        console.error('Error deleting testimonial:', err);
        alert('Failed to delete testimonial.');
        // Revert optimistic update on error
        setTestimonials(originalTestimonials);
      }
    }
  };

  return (
    <div className="border p-6 bg-white rounded shadow mb-10">
      <h2 className="text-xl font-semibold mb-4 text-blue-800">Manage Testimonials</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
          className="border px-4 py-2 rounded"
        />
        <input
          name="college"
          value={form.college}
          onChange={handleChange}
          placeholder="College"
          required
          className="border px-4 py-2 rounded"
        />
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Message"
          rows={3}
          className="border px-4 py-2 rounded col-span-1 md:col-span-2"
        />
        <input
          name="video_link"
          value={form.video_link}
          onChange={handleChange}
          placeholder="YouTube Video URL"
          className="border px-4 py-2 rounded col-span-1 md:col-span-2"
        />
        <input
          name="instagram_link"
          value={form.instagram_link}
          onChange={handleChange}
          placeholder="Instagram Post URL"
          className="border px-4 py-2 rounded col-span-1 md:col-span-2"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded col-span-1 md:col-span-2"
        >
          {form.id ? 'Update Testimonial' : 'Add Testimonial'}
        </button>
      </form>

      {testimonials.length === 0 ? (
        <p className="text-gray-500 text-sm">No testimonials added yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {testimonials.map((item) => (
            <div key={item.id} className="border rounded p-3 shadow text-sm bg-gray-50">
              <div className="aspect-video mb-2">
                {item.video_link ? (
                  <iframe
                    src={item.video_link}
                    title={item.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full rounded"
                  />
                ) : item.instagram_link ? (
                  <iframe
                    src={item.instagram_link}
                    title={item.name}
                    allow="encrypted-media"
                    className="w-full h-full rounded"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-gray-500">
                    No media
                  </div>
                )}
              </div>
              <h4 className="font-semibold">{item.name} – {item.college}</h4>
              <p className="text-gray-600 mt-1">{item.message}</p>
              <div className="flex gap-4 mt-2">
                <button onClick={() => handleEdit(item)} className="text-blue-600 hover:underline">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestimonialAdmin;
