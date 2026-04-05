import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import EventCard from '../components/EventCard';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { LayoutGrid, Calendar, AlertCircle, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// Demo events shown when backend is unavailable
const DEMO_EVENTS = [
  {
    id: 1,
    title: 'Tech Innovation Summit 2026',
    date: '2026-05-15T09:00:00',
    location: 'Convention Center, San Francisco',
    description: 'Join industry leaders for a day of cutting-edge technology presentations, hands-on workshops, and networking opportunities with innovators from around the world.',
  },
  {
    id: 2,
    title: 'Community Music Festival',
    date: '2026-06-20T14:00:00',
    location: 'Central Park Amphitheater',
    description: 'An open-air festival featuring local bands, food trucks, and family-friendly activities. Bring your friends and enjoy a day full of live music and entertainment.',
  },
  {
    id: 3,
    title: 'Startup Pitch Night',
    date: '2026-04-28T18:30:00',
    location: 'Downtown Innovation Hub, Room 301',
    description: 'Watch 10 promising startups pitch their groundbreaking ideas to a panel of investors. Network with founders and VCs over drinks and appetizers.',
  },
  {
    id: 4,
    title: 'Annual Charity Gala',
    date: '2026-07-10T19:00:00',
    location: 'Grand Ballroom, Hilton Hotel',
    description: 'An elegant evening of fine dining, silent auctions, and live entertainment — all in support of local education and community programs.',
  },
  {
    id: 5,
    title: 'Web Development Bootcamp',
    date: '2026-05-05T10:00:00',
    location: 'TechSpace Coworking, Floor 2',
    description: 'A full-day intensive workshop covering React, Node.js, and modern web development best practices. Perfect for beginners and intermediate developers.',
  },
  {
    id: 6,
    title: 'Photography Walk & Workshop',
    date: '2026-06-02T07:30:00',
    location: 'Botanical Gardens East Entrance',
    description: 'Explore photography techniques while walking through scenic gardens. Professional photographers will share tips on composition, lighting, and editing.',
  },
];

const DashboardPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { role } = useAuth();

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/events');
      setEvents(response.data);
      setError(null);
    } catch (err) {
      // Fallback to demo data when backend is unavailable
      setEvents(DEMO_EVENTS);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = (id) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-100 rounded-2xl shadow-inner ring-4 ring-indigo-50">
              <Calendar className="w-8 h-8 text-indigo-700" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Main Dashboard</h1>
              <p className="text-lg text-gray-500 font-medium">Explore all upcoming community events</p>
            </div>
          </div>

          {role === 'ORGANIZER' && (
            <Link
              to="/add-event"
              className="inline-flex items-center space-x-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-indigo-100 ring-4 ring-indigo-50"
            >
              <PlusCircle className="w-6 h-6" />
              <span>Create Event</span>
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-6">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-8 border-indigo-100 rounded-full"></div>
              <div className="absolute inset-0 border-8 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-xl font-bold text-indigo-900 tracking-wide animate-pulse">Synchronizing Events...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border-2 border-rose-100 p-8 rounded-3xl text-center max-w-2xl mx-auto shadow-sm">
            <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
            <p className="text-xl font-bold text-rose-700">{error}</p>
            <button
              onClick={fetchEvents}
              className="mt-6 font-bold text-rose-600 hover:text-rose-800 underline underline-offset-4"
            >
              Try Reconnecting
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-100 p-20 rounded-3xl text-center shadow-sm max-w-3xl mx-auto animate-in slide-in-from-bottom duration-500">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 ring-8 ring-gray-25">
              <LayoutGrid className="w-12 h-12 text-gray-300" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">No Events Discovered</h2>
            <p className="text-lg text-gray-500 max-w-md mx-auto leading-relaxed mb-10 font-medium"> It seems the calendar is empty. Start by creating a new event if you're an organizer. </p>
            {role === 'ORGANIZER' && (
              <Link
                to="/add-event"
                className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-6 py-3 rounded-xl font-bold hover:bg-indigo-100 transition-colors duration-300"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Add your first event</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                role={role}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
      <footer className="py-10 text-center border-t border-gray-100 bg-white">
        <p className="text-sm font-semibold text-gray-400 tracking-widest uppercase">Event Management Application &copy; 2026</p>
      </footer>
    </div>
  );
};

export default DashboardPage;
