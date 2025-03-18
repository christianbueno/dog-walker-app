# PawWalker - Dog Walker Application

A modern web application for connecting pet owners with dog walkers. PawWalker provides a platform where pet owners can find trusted dog walkers in their area and book their services.

## Features

- User authentication and authorization (pet owners and dog walkers)
- Profile management for both user types
- Pet management for pet owners
- Booking system for dog walking services
- Search and filter dog walkers
- Reviews and ratings

## Tech Stack

### Frontend
- React with TypeScript
- React Router for navigation
- Context API for state management
- Styled with CSS

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT for authentication

## Project Structure

```
dog-walker-app/
├── client/           # React frontend
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       ├── types/
│       └── utils/
│
├── server/           # Node.js/Express backend
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── types/
│       └── utils/
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd dog-walker-app
```

2. Install dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Set up environment variables
   - Create a `.env` file in the server directory based on the `.env.example` file
   - Create a `.env` file in the client directory based on the `.env.example` file

4. Start the development servers
```bash
# Start both client and server concurrently (from root directory)
npm start

# Or start them separately
# Start client
cd client
npm start

# Start server
cd ../server
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `GET /api/users/dog-walkers` - Get all dog walkers
- `GET /api/users/dog-walkers/:id` - Get specific dog walker profile

### Pets
- `GET /api/pets` - Get all pets for current user
- `POST /api/pets` - Create a new pet
- `GET /api/pets/:id` - Get a specific pet
- `PUT /api/pets/:id` - Update a pet
- `DELETE /api/pets/:id` - Delete a pet

### Bookings
- `GET /api/bookings` - Get all bookings for current user
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/:id` - Get a specific booking
- `PATCH /api/bookings/:id/status` - Update booking status
- `DELETE /api/bookings/:id` - Cancel a booking

## Recent Updates

- Added missing page components:
  - PetOwnerProfile: Profile management for pet owners
  - DogWalkerProfile: Profile management for dog walkers
  - PetList: List of pets for pet owners
  - PetDetail: Detailed view and management of a pet
  - BookingList: List of bookings for both user types
  - BookingDetail: Detailed view of a booking

- Fixed TypeScript environment variable type definitions
- Updated server configuration to work without MongoDB for demo purposes
- Added placeholder images for the application
- Configured GitHub Pages deployment with demo mode

## GitHub Pages Deployment

The frontend of this application is deployed to GitHub Pages in demo mode. In this mode, the application works without a backend server by using mock data.

### Demo Features

- Full UI experience without requiring a backend server
- Mock data for pets, users, and bookings
- Simulated authentication flow
- All CRUD operations simulated with in-memory data

### Deployment URL

The application is deployed at: `https://[username].github.io/dog-walker-app/`

### Deployment Process

The application is automatically deployed to GitHub Pages using GitHub Actions whenever changes are pushed to the main branch. The deployment workflow:

1. Builds the React application with Vite
2. Configures the application for GitHub Pages
3. Deploys the built files to GitHub Pages

To deploy manually:

```bash
# Navigate to the client directory
cd client

# Build the application
npm run build

# Deploy to GitHub Pages (if using gh-pages package)
npm run deploy
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
