# Backend - Movie Time & Ticket Booking

Express.js REST API server for movie ticket booking system.

## 📦 Dependencies

- `express` - Web framework
- `mongoose` - MongoDB ODM
- `cors` - Cross-Origin Resource Sharing
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `dotenv` - Environment variables
- `express-validator` - Request validation
- `nodemon` - Development auto-reload

## 🗂️ Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── authController.js   # Authentication logic
│   ├── movieController.js  # Movie CRUD operations
│   ├── showtimeController.js
│   ├── bookingController.js
│   └── supportController.js
├── middleware/
│   └── auth.js            # JWT verification & role check
├── models/
│   ├── User.js            # User schema
│   ├── Movie.js           # Movie schema
│   ├── Showtime.js        # Showtime schema
│   ├── Booking.js         # Booking schema
│   └── SupportMessage.js  # Support message schema
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── movies.js
│   ├── showtimes.js
│   ├── bookings.js
│   └── support.js
├── .env.example
├── package.json
└── server.js              # Entry point
```

## 🔧 Setup

1. Install dependencies:
```powershell
npm install
```

2. Create `.env` file:
```powershell
copy .env.example .env
```

3. Configure `.env`:
```
PORT=5000
MONGO_URI=mongodb+srv://Komal2004:komal123@moviesystem.jehy2sa.mongodb.net/?appName=MovieSystem
JWT_SECRET=your_secure_jwt_secret_here
```

4. Run server:
```powershell
# Production
npm start

# Development (auto-reload)
npm run dev
```

Server runs on `http://localhost:5000`

## 🔐 Authentication

JWT tokens are required for protected routes. Include token in Authorization header:
```
Authorization: Bearer <token>
```

## 🛡️ Middleware

- `protect` - Verifies JWT token and attaches user to request
- `admin` - Checks if authenticated user has admin role

## 📊 Models

### User
- name, email, password (hashed)
- role: `user` | `admin`

### Movie
- title, description, duration, genre, poster
- showtimes (ref to Showtime)

### Showtime
- movie (ref), startTime, price
- totalSeats, availableSeats

### Booking
- user (ref), showtime (ref)
- seats, totalPrice, status

### SupportMessage
- user (optional ref), name, email
- message, adminReply

## 🚀 API Routes

All routes prefixed with `/api`

- `/auth` - Registration, login, profile
- `/users` - User management (admin)
- `/movies` - Movie CRUD
- `/showtimes` - Showtime management
- `/bookings` - Booking operations
- `/support` - Support messages

See main README for detailed endpoints.
