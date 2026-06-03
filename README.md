# Neighborify

A neighborhood social media Progressive Web App built for India. Connect with residents around your pincode through posts, stories, forums, events, classifieds, real-time chat, and notifications.

## Features

- **Pincode-based Communities** — 2,946 real Indian pincodes across all 36 states/UTs
- **Instagram-quality Feed** — Post cards with double-tap like animation, media carousel, action bar
- **Stories** — Full-screen viewer with progress bars, swipe navigation, 5s auto-advance
- **Real-time Chat** — Socket.IO powered messaging with typing indicators
- **Forums** — Category-based discussions (General, Help, Safety, Buy/Sell, Events)
- **Events** — Create, RSVP, and track local neighborhood events
- **Classifieds** — Buy/sell listings with price, condition, and category filters
- **Community Alerts** — Safety, traffic, weather, lost & found alerts with color-coded severity
- **Dark Mode** — Full light/dark theme with system preference detection
- **PWA** — Installable on mobile, works offline with service worker caching
- **Premium UI** — Glassmorphism, skeleton loading, smooth animations, Inter font

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Redux Toolkit, React Router 6, Vite 5, Vite-PWA |
| Backend | Node.js 20, Express, Mongoose, Socket.IO, JWT |
| Database | MongoDB 7 (Docker) |
| Icons | Custom SVG icon components (Feather-style) |
| Styling | CSS Design System with variables, dark mode tokens, 13 animations |

## Prerequisites

- Node.js 20+
- Docker (for MongoDB)
- npm or yarn

## Quick Start

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/neighborify.git
cd neighborify

# Start MongoDB
docker run -d --name neighborify-mongo -p 27017:27017 -v mongodb-data:/data/db mongo:7

# Backend
cd backend
cp ../.env.example .env
npm install
npm run seed      # Seed 7 test users, posts, stories, forums, events, listings
npm run dev       # http://localhost:5000

# Frontend (new terminal)
cd frontend
npm install
npm run dev       # http://localhost:5173
```

## Test Accounts

| Role | Phone | Password | Pincode |
|------|-------|----------|---------|
| User | +919876543210 | Test@1234 | 110001 (Delhi) |
| User | +919876543211 | Test@1234 | 110001 (Delhi) |
| User | +919876543212 | Test@1234 | 560001 (Bangalore) |
| User | +919876543213 | Test@1234 | 560001 (Bangalore) |
| User | +919876543214 | Test@1234 | 400001 (Mumbai) |
| Moderator | +919876543215 | Test@1234 | 400001 (Mumbai) |
| Admin | +919999999999 | Admin@123 | 110001 (Delhi) |

## Project Structure

```
neighborify/
├── backend/
│   ├── config/          # DB, Cloudinary, Firebase, Razorpay
│   ├── controllers/     # 13 route controllers
│   ├── middleware/       # Auth, validation, rate limiting, uploads
│   ├── models/          # 13 Mongoose schemas
│   ├── routes/          # 13 route files
│   ├── seed/            # Database seeder
│   ├── utils/           # Pincode data (2,946 entries), helpers, cache
│   └── app.js           # Express app
├── frontend/
│   ├── src/
│   │   ├── components/  # TopBar, BottomNav, PostCard, StoryCircle, Icons
│   │   ├── pages/       # 17 pages (Feed, Stories, Profile, Chat, etc.)
│   │   ├── store/       # Redux slices (auth, feed, chat, notifications)
│   │   ├── styles/      # Design system (variables, globals, components)
│   │   └── api/         # Axios instance with token refresh
│   └── vite.config.js
├── docker-compose.yml
└── .env.example
```

## Environment Variables

See `.env.example` for the full list of required environment variables.

## PWA Install

Open `http://localhost:5173` on a mobile browser, tap the browser menu, and select "Add to Home Screen".

## License

MIT
