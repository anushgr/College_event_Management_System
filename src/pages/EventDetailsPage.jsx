import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, AlignLeft, ArrowLeft, RefreshCcw, Edit, Clock } from 'lucide-react';

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

const EventDetailsPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { role } = useAuth();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axiosInstance.get(`/events/${id}`);
        setEvent(response.data);
        setError(null);
      } catch (err) {
        // Fallback to demo events if API is unavailable or returns an error
        const fallbackEvent = DEMO_EVENTS.find(e => String(e.id) === String(id));
        if (fallbackEvent) {
          setEvent(fallbackEvent);
          setError(null);
        } else {
          setError('Failed to fetch event details. It may have been removed or does not exist.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const formatDate = (dateStr) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };
  
  const formatTime = (dateStr) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateStr).toLocaleTimeString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center justify-center space-y-6 py-24">
            <RefreshCcw className="w-12 h-12 text-indigo-600 animate-spin" />
            <p className="text-xl font-bold text-indigo-900 tracking-wide animate-pulse">Loading Event Details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow max-w-4xl mx-auto px-4 py-12 w-full flex flex-col items-center justify-center">
          <div className="bg-rose-50 border-2 border-rose-100 p-8 rounded-3xl text-center shadow-sm w-full">
            <p className="text-2xl font-bold text-rose-700 mb-6">{error || 'Event not found.'}</p>
            <Link to="/dashboard" className="px-6 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition inline-block">
              Back to Dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-5xl mx-auto px-4 py-12 w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="group inline-flex items-center space-x-2 text-indigo-700 font-bold text-lg hover:text-indigo-900 transition-colors duration-200"
          >
            <ArrowLeft className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" />
            <span>Back to Events</span>
          </Link>
        </div>

        <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden shadow-indigo-100/50">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-10 md:p-14 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Calendar className="w-64 h-64 transform rotate-12" />
            </div>
            <div className="relative z-10 max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                {event.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-indigo-50 font-medium text-lg">
                <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20">
                  <Calendar className="w-5 h-5" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20">
                  <Clock className="w-5 h-5" />
                  <span>{formatTime(event.date)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-10 md:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold flex items-center space-x-3 text-gray-900 mb-4">
                    <AlignLeft className="w-6 h-6 text-indigo-600" />
                    <span>About This Event</span>
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-inner">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-rose-500" />
                    <span>Location Details</span>
                  </h3>
                  <p className="text-gray-700 font-medium">{event.location}</p>
                </div>

                {role === 'ORGANIZER' && (
                  <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100">
                     <h3 className="text-lg font-bold text-indigo-900 mb-4">Organizer Actions</h3>
                     <Link
                       to={`/edit-event/${event.id}`}
                       className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-indigo-700 transition"
                     >
                       <Edit className="w-5 h-5" />
                       <span>Edit Event Details</span>
                     </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventDetailsPage;
