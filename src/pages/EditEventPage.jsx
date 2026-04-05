import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import Navbar from '../components/Navbar';
import { Calendar, MapPin, AlignLeft, Type, ArrowLeft, Save, XCircle, RefreshCcw } from 'lucide-react';

const EditEventPage = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axiosInstance.get(`/events/${id}`);
        // Ensure date is in the correct format for the datetime-local input
        const eventData = response.data;
        if (eventData.date) {
          eventData.date = new Date(eventData.date).toISOString().slice(0, 16);
        }
        setFormData(eventData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch event data. Please verify the ID or your connection.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await axiosInstance.put(`/events/${id}`, formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update event. Please check all fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto px-4 py-12 w-full animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center justify-between mb-10">
          <Link
            to="/dashboard"
            className="group inline-flex items-center space-x-2 text-indigo-700 font-bold text-lg hover:text-indigo-900 transition-colors duration-200"
          >
            <ArrowLeft className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" />
            <span>Return to Dashboard</span>
          </Link>
          <div className="text-right">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-none mb-1">Modify Event</h1>
            <span className="text-indigo-600 font-bold uppercase text-xs tracking-widest bg-indigo-50 px-3 py-1 rounded-full italic">Organizer Access Mode</span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-6">
            <RefreshCcw className="w-12 h-12 text-indigo-600 animate-spin" />
            <p className="text-xl font-bold text-indigo-900 tracking-wide animate-pulse">Syncing Event Details...</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden shadow-indigo-100/50">
            <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Title */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-sm font-bold text-indigo-900 uppercase tracking-widest">
                    <Type className="w-4 h-4 text-indigo-500" />
                    <span>Event Title</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="block w-full border-2 border-gray-100 rounded-2xl bg-gray-50 px-5 py-4 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all duration-300 font-medium text-gray-700 shadow-sm"
                    required
                  />
                </div>

                {/* Date */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-sm font-bold text-indigo-900 uppercase tracking-widest">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    <span>Event Date</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="block w-full border-2 border-gray-100 rounded-2xl bg-gray-50 px-5 py-4 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all duration-300 font-medium text-gray-700 shadow-sm"
                    required
                  />
                </div>

                {/* Location */}
                <div className="space-y-3 md:col-span-2">
                  <label className="flex items-center space-x-2 text-sm font-bold text-indigo-900 uppercase tracking-widest">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    <span>Event Location</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="block w-full border-2 border-gray-100 rounded-2xl bg-gray-50 px-5 py-4 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all duration-300 font-medium text-gray-700 shadow-sm"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-3 md:col-span-2">
                  <label className="flex items-center space-x-2 text-sm font-bold text-indigo-900 uppercase tracking-widest">
                    <AlignLeft className="w-4 h-4 text-indigo-500" />
                    <span>Detailed Description</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    className="block w-full border-2 border-gray-100 rounded-2xl bg-gray-50 px-5 py-4 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all duration-300 font-medium text-gray-700 shadow-sm resize-none"
                    required
                  ></textarea>
                </div>
              </div>

              {error && (
                <div className="bg-rose-50 border-2 border-rose-100 p-5 rounded-2xl flex items-center space-x-4 animate-in fade-in duration-300">
                  <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                  <p className="text-sm font-bold text-rose-700">{error}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 pt-4 border-t border-gray-50">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-indigo-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-indigo-700 transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-indigo-200 flex items-center justify-center space-x-3 disabled:bg-gray-400 group h-16"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Save className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                      <span>Update Official Record</span>
                    </>
                  )}
                </button>
                <Link
                  to="/dashboard"
                  className="flex-1 bg-gray-50 text-gray-700 py-5 rounded-2xl font-bold text-lg hover:bg-gray-100 text-center transition-all duration-300 border-2 border-gray-100 flex items-center justify-center h-16"
                >
                  Cancel Edit
                </Link>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default EditEventPage;
