import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../api/axiosInstance';
import EventCard from '../components/EventCard';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { PlusCircle, Calendar, MapPin, Sparkles, Zap, LayoutGrid } from 'lucide-react';

/* ─── Demo fallback data ─────────────────────────────────────────── */
const DEMO_EVENTS = [
  { id: 1, title: 'Tech Innovation Summit 2026', date: '2026-05-15T09:00:00', location: 'Convention Center, San Francisco', description: 'Join industry leaders for a day of cutting-edge technology presentations, hands-on workshops, and networking opportunities with innovators from around the world.' },
  { id: 2, title: 'Community Music Festival', date: '2026-06-20T14:00:00', location: 'Central Park Amphitheater', description: 'An open-air festival featuring local bands, food trucks, and family-friendly activities. Bring your friends and enjoy a day full of live music and entertainment.' },
  { id: 3, title: 'Startup Pitch Night', date: '2026-04-28T18:30:00', location: 'Downtown Innovation Hub, Room 301', description: 'Watch 10 promising startups pitch their groundbreaking ideas to a panel of investors. Network with founders and VCs over drinks and appetizers.' },
  { id: 4, title: 'Annual Charity Gala', date: '2026-07-10T19:00:00', location: 'Grand Ballroom, Hilton Hotel', description: 'An elegant evening of fine dining, silent auctions, and live entertainment — all in support of local education and community programs.' },
  { id: 5, title: 'Web Development Bootcamp', date: '2026-05-05T10:00:00', location: 'TechSpace Coworking, Floor 2', description: 'A full-day intensive workshop covering React, Node.js, and modern web development best practices. Perfect for beginners and intermediate developers.' },
  { id: 6, title: 'Photography Walk & Workshop', date: '2026-06-02T07:30:00', location: 'Botanical Gardens East Entrance', description: 'Explore photography techniques while walking through scenic gardens. Professional photographers will share tips on composition, lighting, and editing.' },
];

/* ─── Floating particle component ───────────────────────────────── */
const Particle = ({ style }) => (
  <div className="absolute rounded-full pointer-events-none" style={style} />
);

/* ─── Animated stat pill ─────────────────────────────────────────── */
const StatPill = ({ icon: Icon, label, value, delay }) => (
  <div
    className="dash-stat-pill"
    style={{ animationDelay: delay }}
  >
    <div className="dash-stat-icon">
      <Icon size={14} />
    </div>
    <span className="dash-stat-value">{value}</span>
    <span className="dash-stat-label">{label}</span>
  </div>
);

/* ─── Enhanced Event Card ────────────────────────────────────────── */
const GlassEventCard = ({ event, role, onDelete, index }) => {
  const [hovered, setHovered] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -14;
    cardRef.current.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (cardRef.current) cardRef.current.style.transform = '';
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axiosInstance.delete(`/events/${event.id}`);
    } catch (_) { /* demo mode */ }
    setTimeout(() => onDelete(event.id), 400);
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const accentColors = [
    { glow: '#6366f1', tag: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
    { glow: '#8b5cf6', tag: 'bg-violet-500/20 text-violet-300 border-violet-500/30' },
    { glow: '#06b6d4', tag: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
    { glow: '#10b981', tag: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    { glow: '#f59e0b', tag: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    { glow: '#ec4899', tag: 'bg-pink-500/20 text-pink-300 border-pink-500/30' },
  ];
  const accent = accentColors[index % accentColors.length];

  return (
    <div
      className={`glass-card ${deleting ? 'card-delete' : ''}`}
      style={{
        animationDelay: `${index * 90}ms`,
        '--glow-color': accent.glow,
      }}
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow border */}
      <div className="glass-card-glow" style={{ opacity: hovered ? 1 : 0 }} />

      {/* Top accent line */}
      <div className="glass-card-accent-line" />

      {/* Content */}
      <div className="p-6 flex flex-col h-full">
        {/* Tag */}
        <div className={`self-start text-xs font-bold px-3 py-1 rounded-full border mb-4 tracking-wider uppercase ${accent.tag}`}>
          Event
        </div>

        {/* Title */}
        <h3 className="text-white font-bold text-xl leading-snug mb-3 line-clamp-2 group-hover:text-indigo-200 transition-colors">
          {event.title}
        </h3>

        {/* Meta */}
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Calendar size={13} className="flex-shrink-0" style={{ color: accent.glow }} />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <MapPin size={13} className="flex-shrink-0" style={{ color: accent.glow }} />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 flex-grow">
          {event.description}
        </p>

        {/* Divider */}
        <div className="glass-card-divider" />

        {/* Actions */}
        {role === 'ORGANIZER' && (
          <div className="flex gap-3">
            {confirmDelete ? (
              <>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 transition-all duration-200"
                >
                  Confirm Delete
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-slate-700/50 text-slate-300 border border-slate-600/30 hover:bg-slate-700 transition-all duration-200"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <Link
                  to={`/edit-event/${event.id}`}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-center bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/25 hover:border-indigo-400/40 transition-all duration-200"
                >
                  Edit Event
                </Link>
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/25 hover:border-red-400/40 transition-all duration-200"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Loader ─────────────────────────────────────────────────────── */
const CosmicLoader = () => (
  <div className="flex flex-col items-center justify-center py-32 gap-8">
    <div className="loader-rings">
      <div className="ring ring-1" />
      <div className="ring ring-2" />
      <div className="ring ring-3" />
      <div className="ring-core">
        <Sparkles size={20} className="text-indigo-400" />
      </div>
    </div>
    <div className="text-center">
      <p className="text-white font-bold text-xl tracking-wide mb-1">Loading Events</p>
      <p className="text-slate-500 text-sm loader-dots">Syncing from server</p>
    </div>
  </div>
);

/* ─── Main Dashboard ─────────────────────────────────────────────── */
const DashboardPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const { role } = useAuth();

  /* Generate particles once */
  const particles = useRef(
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${6 + Math.random() * 10}s`,
      opacity: Math.random() * 0.4 + 0.05,
      color: ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981'][i % 4],
    }))
  ).current;

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/events');
      setEvents(response.data);
      setError(null);
    } catch (_) {
      setEvents(DEMO_EVENTS);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleDelete = (id) => setEvents((prev) => prev.filter((e) => e.id !== id));

  return (
    <>
      {/* ─ Injected styles ─ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .dash-root {
          min-height: 100vh;
          background: #050816;
          font-family: 'DM Sans', sans-serif;
          color: #e2e8f0;
          position: relative;
          overflow-x: hidden;
        }

        /* ── Background mesh ── */
        .dash-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background:
            radial-gradient(ellipse 80% 60% at 10% 0%, rgba(99,102,241,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 90% 100%, rgba(139,92,246,0.14) 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 50% 50%, rgba(6,182,212,0.06) 0%, transparent 60%);
        }

        .dash-grid {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-image:
            linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        /* ── Particles ── */
        .particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: float-particle var(--dur) var(--delay) ease-in-out infinite alternate;
        }
        @keyframes float-particle {
          0%   { transform: translateY(0px) scale(1); opacity: var(--op); }
          100% { transform: translateY(-40px) scale(1.5); opacity: calc(var(--op) * 0.3); }
        }

        /* ── Page enter ── */
        .dash-content {
          position: relative;
          z-index: 1;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .dash-content.mounted {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Header ── */
        .dash-header-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.3);
          color: #a5b4fc;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 999px;
          margin-bottom: 16px;
          animation: badge-in 0.5s ease both;
        }
        @keyframes badge-in {
          from { opacity: 0; transform: scale(0.85) translateY(-8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        .dash-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.2rem, 5vw, 3.5rem);
          font-weight: 800;
          line-height: 1.1;
          color: #fff;
          margin: 0 0 8px;
          animation: title-in 0.6s 0.1s ease both;
        }
        @keyframes title-in {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .dash-title span {
          background: linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #67e8f9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .dash-subtitle {
          color: #64748b;
          font-size: 1rem;
          font-weight: 400;
          animation: title-in 0.6s 0.2s ease both;
        }

        /* ── Stat pills ── */
        .dash-stat-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 999px;
          padding: 7px 14px;
          font-size: 13px;
          animation: pill-in 0.5s ease both;
          backdrop-filter: blur(8px);
        }
        @keyframes pill-in {
          from { opacity: 0; transform: translateY(10px) scale(0.9); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .dash-stat-icon { color: #818cf8; }
        .dash-stat-value { color: #e2e8f0; font-weight: 600; }
        .dash-stat-label { color: #475569; font-size: 12px; }

        /* ── Create button ── */
        .dash-create-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          padding: 14px 28px;
          border-radius: 14px;
          text-decoration: none;
          position: relative;
          overflow: hidden;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          box-shadow: 0 8px 32px rgba(99,102,241,0.35), 0 0 0 1px rgba(255,255,255,0.08) inset;
          animation: btn-in 0.5s 0.3s ease both;
          letter-spacing: 0.01em;
        }
        @keyframes btn-in {
          from { opacity: 0; transform: scale(0.9) translateX(10px); }
          to   { opacity: 1; transform: scale(1) translateX(0); }
        }
        .dash-create-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
          pointer-events: none;
        }
        .dash-create-btn::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -60%;
          width: 40%;
          height: 200%;
          background: rgba(255,255,255,0.18);
          transform: skewX(-20deg);
          transition: left 0.4s ease;
        }
        .dash-create-btn:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 14px 40px rgba(99,102,241,0.45), 0 0 0 1px rgba(255,255,255,0.1) inset; }
        .dash-create-btn:hover::after { left: 120%; }
        .dash-create-btn:active { transform: translateY(0) scale(0.99); }

        /* ── Glass cards ── */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
          padding-bottom: 60px;
        }

        .glass-card {
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          backdrop-filter: blur(20px);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease, box-shadow 0.25s ease;
          opacity: 0;
          transform: translateY(30px);
          animation: card-enter 0.55s ease forwards;
          cursor: default;
        }
        @keyframes card-enter {
          to { opacity: 1; transform: translateY(0); }
        }

        .card-delete {
          animation: card-exit 0.4s ease forwards !important;
        }
        @keyframes card-exit {
          to { opacity: 0; transform: scale(0.88) translateY(-12px); }
        }

        .glass-card-glow {
          position: absolute;
          inset: -1px;
          border-radius: 20px;
          border: 1.5px solid var(--glow-color, #6366f1);
          pointer-events: none;
          transition: opacity 0.25s ease;
          box-shadow: 0 0 24px var(--glow-color, #6366f1), inset 0 0 24px rgba(99,102,241,0.05);
        }

        .glass-card-accent-line {
          position: absolute;
          top: 0;
          left: 24px;
          right: 24px;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--glow-color, #6366f1), transparent);
          border-radius: 0 0 4px 4px;
          opacity: 0.6;
        }

        .glass-card-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
          margin: 20px 0 16px;
        }

        /* ── Loader ── */
        .loader-rings {
          position: relative;
          width: 80px;
          height: 80px;
        }
        .ring {
          position: absolute;
          border-radius: 50%;
          border: 2px solid transparent;
        }
        .ring-1 {
          inset: 0;
          border-top-color: #6366f1;
          animation: spin 1.2s linear infinite;
        }
        .ring-2 {
          inset: 10px;
          border-right-color: #8b5cf6;
          animation: spin 1.8s linear infinite reverse;
        }
        .ring-3 {
          inset: 20px;
          border-bottom-color: #06b6d4;
          animation: spin 2.4s linear infinite;
        }
        .ring-core {
          position: absolute;
          inset: 30px;
          background: rgba(99,102,241,0.12);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse-core 2s ease-in-out infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse-core {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.15); opacity: 0.7; }
        }

        .loader-dots::after {
          content: '';
          animation: dots 1.5s steps(4, end) infinite;
        }
        @keyframes dots {
          0%   { content: ''; }
          25%  { content: '.'; }
          50%  { content: '..'; }
          75%  { content: '...'; }
          100% { content: ''; }
        }

        /* ── Empty state ── */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 40px;
          background: rgba(15,23,42,0.5);
          border: 1px dashed rgba(99,102,241,0.2);
          border-radius: 24px;
          backdrop-filter: blur(12px);
          animation: card-enter 0.5s ease both;
          text-align: center;
        }

        .empty-icon-ring {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: rgba(99,102,241,0.08);
          border: 1px solid rgba(99,102,241,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 28px;
          animation: float-icon 3s ease-in-out infinite;
        }
        @keyframes float-icon {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }

        /* ── Divider ── */
        .section-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 36px;
          animation: title-in 0.5s 0.25s ease both;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.25), transparent);
        }
        .divider-count {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* ── Footer ── */
        .dash-footer {
          position: relative;
          z-index: 1;
          border-top: 1px solid rgba(255,255,255,0.05);
          padding: 28px;
          text-align: center;
          font-size: 12px;
          color: #334155;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
      `}</style>

      <div className="dash-root">
        {/* Background layers */}
        <div className="dash-bg" />
        <div className="dash-grid" />

        {/* Particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              width: p.size,
              height: p.size,
              left: p.left,
              top: p.top,
              backgroundColor: p.color,
              '--dur': p.duration,
              '--delay': p.delay,
              '--op': p.opacity,
            }}
          />
        ))}

        <Navbar />

        <main className={`dash-content ${mounted ? 'mounted' : ''} max-w-7xl mx-auto px-6 py-12 w-full`}>

          {/* ── Header ── */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-16">
            <div>
              <div className="dash-header-badge">
                <Zap size={10} />
                Event Management Platform
              </div>
              <h1 className="dash-title">
                Your <span>Event Hub</span>
              </h1>
              <p className="dash-subtitle">Discover and manage all upcoming community events</p>

              {/* Stat pills */}
              <div className="flex flex-wrap gap-3 mt-6">
                <StatPill icon={Calendar} label="Events" value={events.length} delay="0.3s" />
                <StatPill icon={MapPin} label="Locations" value={new Set(events.map(e => e.location)).size} delay="0.4s" />
                <StatPill icon={Sparkles} label={role === 'ORGANIZER' ? 'Organizer' : 'Viewer'} value="Role" delay="0.5s" />
              </div>
            </div>

            {role === 'ORGANIZER' && (
              <div className="flex-shrink-0 pt-2">
                <Link to="/add-event" className="dash-create-btn">
                  <PlusCircle size={18} />
                  Create Event
                </Link>
              </div>
            )}
          </div>

          {/* ── Body ── */}
          {isLoading ? (
            <CosmicLoader />
          ) : error ? (
            <div className="empty-state">
              <p className="text-red-400 font-bold text-lg mb-3">Failed to load events</p>
              <p className="text-slate-500 text-sm mb-6">{error}</p>
              <button onClick={fetchEvents} className="dash-create-btn" style={{ fontSize: '0.8rem', padding: '10px 20px' }}>
                Retry
              </button>
            </div>
          ) : events.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon-ring">
                <LayoutGrid size={36} className="text-indigo-500" />
              </div>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
                No Events Yet
              </h2>
              <p style={{ color: '#64748b', maxWidth: '360px', lineHeight: 1.6, marginBottom: '32px' }}>
                The calendar is empty. Organizers can create the first event to get things started.
              </p>
              {role === 'ORGANIZER' && (
                <Link to="/add-event" className="dash-create-btn">
                  <PlusCircle size={16} />
                  Add First Event
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="section-divider">
                <div className="divider-line" />
                <span className="divider-count">{events.length} event{events.length !== 1 ? 's' : ''} found</span>
                <div className="divider-line" />
              </div>

              <div className="cards-grid">
                {events.map((event, i) => (
                  <GlassEventCard
                    key={event.id}
                    event={event}
                    role={role}
                    onDelete={handleDelete}
                    index={i}
                  />
                ))}
              </div>
            </>
          )}
        </main>

        <footer className="dash-footer">
          Event Management Application &copy; 2026
        </footer>
      </div>
    </>
  );
};

export default DashboardPage;