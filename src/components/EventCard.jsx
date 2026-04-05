import React from 'react';
import { Calendar, MapPin, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const EventCard = ({ event, role, onDelete }) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axiosInstance.delete(`/events/${event.id}`);
        onDelete(event.id);
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] flex flex-col h-full group">
      <div className="p-6 flex-grow">
        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-700 transition-colors duration-300">
          {event.title}
        </h3>
        <div className="flex items-center text-gray-600 mb-2 space-x-2">
          <Calendar className="w-5 h-5 text-indigo-500" />
          <span className="text-sm font-medium">{formatDate(event.date)}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-4 space-x-2">
          <MapPin className="w-5 h-5 text-rose-500" />
          <span className="text-sm font-medium">{event.location}</span>
        </div>
        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4">
          {event.description}
        </p>
      </div>

      {role === 'ORGANIZER' && (
        <div className="p-4 bg-gray-50 flex space-x-3 border-t border-gray-100 mt-auto">
          <Link
            to={`/edit-event/${event.id}`}
            className="flex-1 flex items-center justify-center space-x-2 bg-indigo-50 text-indigo-700 font-semibold py-2.5 rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-300 border border-indigo-100"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </Link>
          <button
            onClick={handleDelete}
            className="flex-1 flex items-center justify-center space-x-2 bg-rose-50 text-rose-700 font-semibold py-2.5 rounded-xl hover:bg-rose-600 hover:text-white transition-all duration-300 border border-rose-100"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default EventCard;
