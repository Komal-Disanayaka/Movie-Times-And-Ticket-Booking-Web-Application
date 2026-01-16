# Frontend - Movie Time & Ticket Booking

React.js web application with Material-UI for movie ticket booking.

## 📦 Dependencies

- `react` & `react-dom` - React library
- `react-router-dom` - Client-side routing
- `@mui/material` - Material-UI components
- `@emotion/react` & `@emotion/styled` - MUI styling
- `@mui/icons-material` - Material icons
- `axios` - HTTP client
- `react-scripts` - Create React App scripts

## 🗂️ Structure

```
frontend/src/
├── components/
│   ├── NavBar.js          # Navigation bar with role-based menu
│   └── MovieCard.js       # Movie display card
├── context/
│   └── AuthContext.js     # Global auth state
├── pages/
│   ├── Home.js            # Landing page
│   ├── Movies.js          # Movie listing
│   ├── MovieDetails.js    # Movie details & booking
│   ├── Login.js           # Login form
│   ├── Register.js        # Registration form
│   ├── Profile.js         # User profile
│   ├── Cart.js            # Shopping cart
│   ├── Bookings.js        # User booking history
│   ├── Support.js         # Support contact form
│   └── AdminPanel.js      # Admin dashboard (tabs)
├── services/
│   ├── api.js             # Axios instance with interceptors
│   └── auth.js            # Auth API calls
├── App.js                 # Main app with routing
├── index.js               # React entry point
└── index.css              # Global styles
```

## 🔧 Setup

1. Install dependencies:
```powershell
npm install
```

2. (Optional) Create `.env` file to configure API URL:
```
REACT_APP_API_URL=http://localhost:5000/api
```

3. Start development server:
```powershell
npm start
```

App runs on `http://localhost:3000`

## 🎨 Pages & Routes

- `/` - Home (Welcome page)
- `/movies` - Browse all movies
- `/movies/:id` - Movie details with showtimes
- `/login` - Login page
- `/register` - Registration page
- `/profile` - User profile (protected)
- `/cart` - Shopping cart (protected)
- `/bookings` - Booking history (protected)
- `/support` - Contact support
- `/admin` - Admin panel (admin only)

## 🔐 Authentication Flow

1. User registers/logs in
2. JWT token saved to localStorage
3. Token attached to API requests via axios interceptor
4. User profile fetched and stored in AuthContext
5. Routes protected based on user role

## 🧭 Navigation

NavBar dynamically shows/hides menu items based on:
- Guest (not logged in): Home, Movies, Login, Register
- Registered User: Home, Movies, Profile, Cart, Bookings, Support, Logout
- Admin: Home, Movies, Admin Panel, Logout

## 🛠️ Admin Panel

Tabbed interface for:
1. **Users** - View all registered users
2. **Movies** - Create/Edit/Delete movies
3. **Bookings** - View all bookings
4. **Support** - View/Reply to support messages

## 🎬 Key Features

### Guest Users
✅ Browse movies  
✅ View movie details  
❌ Cannot book or access cart

### Registered Users
✅ Book movies  
✅ View booking history  
✅ Manage cart (placeholder)  
✅ Send support messages

### Admin
✅ Manage movies & showtimes  
✅ View all users & bookings  
✅ Reply to support messages  
❌ Cannot book movies or add to cart

## 🚀 Build

To create production build:
```powershell
npm run build
```

Output in `build/` directory ready for deployment.

## 🎨 Customization

- Modify theme in `App.js` by wrapping with MUI ThemeProvider
- Update styles in `index.css`
- Add custom components in `components/`
