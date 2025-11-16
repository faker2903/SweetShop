# SweetShop — AI Premium Treats E-Commerce Platform

SweetShop is a modern, full‑stack e-commerce application built for a premium confectionary experience. The project pairs an AI‑generated polished frontend design with a human‑developed backend to deliver a performant, secure, and beautiful shopping experience.

- Frontend: AI-designed glass‑morphism UI and responsive React components.
- Backend: Human-developed REST API with Express, MongoDB, and JWT authentication.
- live demo ("https://sweet-shop-steel.vercel.app/")
- Admin email : admin@sweetshop.com
- Admin password: admin123
  

---

Table of contents
- Project overview
- Highlights
- Tech stack
- Architecture
- Getting started (local)
- Environment variables
- Running the app
- API (common endpoints)
- Frontend routes (overview)
- Contributing
- License & acknowledgements

---

## Project overview

SweetShop demonstrates a hybrid development workflow where UI/UX and frontend implementation were produced by an advanced AI assistant (BLACKBOXAI), while the backend, business logic, and security were implemented and maintained by a human developer.

The result is a feature-rich storefront focused on aesthetics (glass morphism, micro-interactions, responsive layout) and production‑ready backend functionality (auth, role-based access control, cart & order handling).

---

## Highlights

- Glass-morphism UI with backdrop blur, subtle shadows, and premium feel
- Responsive React components: SweetCard, AuthForm, Dashboard, Cart, AdminForm
- User authentication (JWT) with role support (user / admin)
- Admin CRUD for sweets (create, read, update, delete)
- Shopping cart management + purchase flow
- Smart image handling with category defaults and custom image URL support
- Mobile-first and accessible interactions with polished micro-interactions

---

## Tech stack

- Frontend
  - React 18
  - Tailwind CSS
  - React Router
  - Axios (HTTP client)
- Backend
  - Node.js, Express
  - MongoDB with Mongoose
  - JWT for authentication
  - bcryptjs for password hashing
  - Validation & security middleware (input validation, auth checks)

---

## Architecture

- Frontend and backend are separate projects (root/frontend and root/backend or similar).
- Frontend consumes backend REST API endpoints for auth, sweets, cart, and orders.
- Backend exposes a REST API with JWT-protected routes and role-based middleware for admin operations.
- MongoDB stores users, sweets, cart items, and orders.

---

## Getting started (local development)

Prerequisites
- Node.js (LTS recommended)
- npm or yarn
- MongoDB (local or hosted Atlas cluster)

Quick start
1. Clone the repo
   git clone https://github.com/faker2903/SweetShop.git
2. Install dependencies
   - Frontend:
     cd frontend
     npm install
   - Backend:
     cd backend
     npm install
3. Create environment files (see below)
4. Start development servers
   - Backend:
     cd backend
     npm run dev (or npm start)
   - Frontend:
     cd frontend
     npm start
5. Open the app
   - Frontend default: http://localhost:3000
   - Backend default: http://localhost:5000 (or configured port)

---

## Environment variables

Below are example environment variables you should set in the backend (backend/.env) and optionally in the frontend (.env.local).

Backend (.env)
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_jwt_secret_key
- PORT=5000
- NODE_ENV=development

Frontend (.env.local)
- VITE_API_URL=http://localhost:5000/api
  or
- REACT_APP_API_URL=http://localhost:5000/api
(Depending on how the frontend reads env vars; check frontend config.)

---

## Running

Scripts may vary depending on the project setup. Typical commands:

Backend
- npm run dev — start backend in development with nodemon
- npm start — start backend in production

Frontend
- npm start — start React dev server
- npm run build — build optimized production bundle
- npm run preview — serve production build (if configured)

---

## API (common endpoints — adjust to actual implementation)

The backend exposes REST endpoints. Verify exact routes in backend code. Typical endpoints include:

- Auth
  - POST /api/auth/register — register a new user
  - POST /api/auth/login — login and receive JWT
  - GET /api/auth/me — get current authenticated user

- Sweets
  - GET /api/sweets — list all sweets (with optional filters)
  - GET /api/sweets/:id — get single sweet details
  - POST /api/sweets — create a sweet (admin)
  - PUT /api/sweets/:id — update sweet (admin)
  - DELETE /api/sweets/:id — delete sweet (admin)

- Cart & Orders
  - GET /api/cart — get current user's cart
  - POST /api/cart — add item to cart / update cart
  - DELETE /api/cart/:itemId — remove item from cart
  - POST /api/orders — create a purchase/order
  - GET /api/orders — get user orders (admin can access all)

- Admin
  - Protected endpoints that require admin role — manage sweets, view all orders, etc.

Authentication: JWT tokens should be sent in Authorization header as `Bearer <token>`.

---

## Frontend routes (typical)

- / — Home / Featured sweets
- /sweets — Browse sweets / categories
- /sweets/:id — Sweet detail page
- /cart — Shopping cart
- /checkout — Checkout / purchase flow
- /auth/login — Login
- /auth/register — Register
- /dashboard — User dashboard / orders
- /admin — Admin panel (protected)

---

## Testing

- Unit and integration tests (if present) can be run via:
  - Backend: npm test
  - Frontend: npm test
- Add tests for critical business logic (auth, cart management, payments).

---

## Deployment

- Backend: Deploy to a Node-compatible host (Heroku, Render, Railway, DigitalOcean App Platform, etc.). Ensure MONGO_URI and JWT_SECRET are set in the environment.
- Frontend: Host static build on Netlify, Vercel, Cloudflare Pages, or serve via CDN with backend API configured.

Production tips
- Use HTTPS and set secure cookie / token handling.
- Configure CORS to allow the frontend domain.
- Use environment-specific image URLs and CDN for assets.
- Enable rate limiting and input validation on backend endpoints.

---

## Contributing

Contributions are welcome. Suggested workflow:
1. Fork the repository
2. Create a branch for your feature/fix
3. Make changes and add tests
4. Open a pull request describing your changes

Please follow code style and add clear commit messages. If you modify the API, update the README API section.

---

## Acknowledgements & AI usage

- Frontend: Designed and implemented using BLACKBOXAI (AI-assisted). The AI produced the complete glass-morphism UI, responsive components, animations, and Tailwind styling.
- Backend: Implemented and maintained by the human developer (repository owner), including API design, security, and business logic.

This repository demonstrates an AI-human collaboration pattern: AI for UI/UX engineering, human for server, security, and domain logic.

---

## License

Specify your license here (e.g., MIT). If none, add a LICENSE file to clarify reuse terms.

---

If you'd like, I can:
- Add a badge section (build, license, coverage).
- Generate an example .env file.
- Produce API documentation (OpenAPI/Swagger) from the actual backend routes if you point me to the backend code.
