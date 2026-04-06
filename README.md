# Event Management Application — Frontend

A modern, responsive React frontend for managing community events. Built with **React 18**, **Tailwind CSS**, and **React Router v6**, connecting to a Spring Boot REST API backend.

---

## Screenshots

### Dashboard (Public)
The main dashboard displays all events in a responsive card grid — accessible without login.

### Login Page
A clean, centered login form for authentication with JWT support.

### Add / Edit Event (Organizer Only)
Form pages for creating and editing events, with field validation and modern UI.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI library with functional components & hooks |
| **React Router DOM v6** | Client-side routing & navigation |
| **Tailwind CSS 3** | Utility-first CSS framework |
| **Axios** | HTTP client for REST API communication |
| **Lucide React** | Beautiful SVG icon library |
| **Vite 6** | Fast dev server & build tool |
| **Context API** | Global state management (auth/role) |

---

## Project Structure

```
src/
├── api/
│   └── axiosInstance.js          # Axios instance with base URL + JWT interceptor
├── context/
│   └── AuthContext.jsx           # Auth context: token, role, login(), logout()
├── components/
│   ├── Navbar.jsx                # Navigation bar with role-based links
│   ├── EventCard.jsx             # Event card with edit/delete for organizers
│   └── ProtectedRoute.jsx        # Route guard for organizer-only pages
├── pages/
│   ├── LoginPage.jsx             # Login form with error handling
│   ├── DashboardPage.jsx         # Event grid with loading/empty/error states
│   ├── AddEventPage.jsx          # Create new event form (organizer only)
│   └── EditEventPage.jsx         # Edit existing event form (organizer only)
├── App.jsx                       # React Router routes configuration
├── main.jsx                      # Application entry point
└── index.css                     # Global styles + Tailwind directives
```

---

## API Endpoints

This frontend connects to a **Spring Boot REST API** at `http://localhost:8080/api`:

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/auth/login` | Authenticate user, returns JWT + role | Public |
| `GET` | `/events` | Fetch all events | Public |
| `GET` | `/events/{id}` | Fetch single event by ID | Public |
| `POST` | `/events` | Create a new event | Organizer |
| `PUT` | `/events/{id}` | Update an existing event | Organizer |
| `DELETE` | `/events/{id}` | Delete an event | Organizer |

---

## Routes

| Path | Component | Access |
|------|-----------|--------|
| `/` | Redirects to `/dashboard` | Public |
| `/login` | `LoginPage` | Public |
| `/dashboard` | `DashboardPage` | Public |
| `/add-event` | `AddEventPage` | Organizer only |
| `/edit-event/:id` | `EditEventPage` | Organizer only |

---

## Getting Started

### Prerequisites

- **Node.js** v18+ and **npm** v9+
- Spring Boot backend running on port `8080` (optional — demo data shown when unavailable)

### Installation

```bash
# Clone the repository
git clone https://github.com/Abhijith-K-N/event-management.git
cd event-management

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:3000**

### Build for Production

```bash
npm run build
npm run preview
```

---

## Authentication & Roles

The app uses **JWT-based authentication** with two roles:

| Role | Capabilities |
|------|-------------|
| **USER** | View all events on the dashboard |
| **ORGANIZER** | View events + Create, Edit, and Delete events |

- Token and role are stored in `localStorage`
- Axios interceptor automatically attaches `Authorization: Bearer <token>` to all requests
- Protected routes redirect unauthorized users

---

## Features

- ✅ **Public Dashboard** — Browse events without login
- ✅ **JWT Authentication** — Secure login with token persistence
- ✅ **Role-Based Access** — Organizer-only routes for event management
- ✅ **Responsive Design** — 3-col desktop, 2-col tablet, 1-col mobile
- ✅ **Loading States** — Animated spinners on all async operations
- ✅ **Error Handling** — Inline error messages (no alerts)
- ✅ **Demo Fallback** — Shows sample events when backend is unavailable
- ✅ **Hover Animations** — Cards scale up with shadow on hover
- ✅ **Form Validation** — All fields required with focus ring styling
- ✅ **Delete Confirmation** — Confirmation dialog before deleting events
- ✅ **Modern Typography** — Google Fonts (Outfit, Inter)

---

## Design System

- **Primary Color**: Indigo/Purple (`#3047eb`)
- **Accent**: Rose for destructive actions
- **Background**: Gray-50 (`#f9fafb`)
- **Cards**: White with rounded corners and hover shadows
- **Font Family**: Outfit / Inter (Google Fonts)
- **Border Radius**: `rounded-2xl` / `rounded-3xl`

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server on port 3000 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the ISC License.

---

