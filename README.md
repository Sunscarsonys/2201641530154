# URL Shortener

A beautiful, fully functional URL Shortener application built with React, TypeScript, and Material-UI.

## Features

- **URL Shortening**: Create short URLs from long ones with custom validity periods
- **Custom Shortcodes**: Optional custom shortcode generation
- **Multiple URLs**: Process up to 5 URLs simultaneously  
- **Statistics Dashboard**: Comprehensive analytics with click tracking
- **Responsive Design**: Works perfectly on mobile and desktop
- **Real-time Validation**: Client-side validation for URLs and shortcodes
- **Copy to Clipboard**: Easy sharing with one-click copy functionality
- **Comprehensive Logging**: All events logged to evaluation service
- **Local Storage Persistence**: Data persists across browser sessions

## Technology Stack

- **React 18** with TypeScript
- **Material-UI (MUI)** for UI components and styling
- **React Router** for navigation and redirection
- **Vite** for fast development and building
- **LocalStorage** for client-side data persistence

## Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Access the Application**
   Open your browser and go to: `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── Navigation.tsx       # App navigation bar
│   ├── UrlShortener.tsx     # Main URL shortening form
│   ├── Statistics.tsx       # Statistics dashboard
│   └── RedirectPage.tsx     # Short URL redirection handler
├── pages/
│   ├── HomePage.tsx         # Home page layout
│   └── StatsPage.tsx        # Statistics page layout
├── contexts/
│   └── AuthContext.tsx      # Authentication context
├── utils/
│   ├── api.tsx              # API communication layer
│   ├── loggingMiddleware.tsx # Logging service integration
│   └── validation.tsx       # Input validation utilities
├── App.tsx                  # Main app component with routing
└── main.tsx                 # App entry point
```

## Key Features Implemented

### URL Shortening (/):
- Dynamic form management (up to 5 URLs)
- URL validation and custom shortcode support
- Validity period configuration (default: 30 minutes)
- Beautiful results display with copy functionality
- Comprehensive error handling and user feedback

### Statistics Dashboard (/stats):
- Responsive table displaying all shortened URLs
- Click tracking with detailed analytics
- Expandable sections for detailed click information
- Real-time data refresh functionality

### URL Redirection (/:shortcode):
- Automatic redirection with loading states
- Expiry validation and error handling
- Click tracking and analytics
- Graceful error messages for invalid/expired URLs

### Logging Integration:
- All significant events logged to evaluation service
- Fallback to local storage if service unavailable
- Comprehensive event tracking (API calls, user actions, errors)

### Validation:
- URL format validation using regex patterns
- Shortcode validation (alphanumeric, 4-10 characters)
- Validity period validation (positive integers)
- Real-time form validation with user feedback

## Build for Production

```bash
npm run build
```

## Technical Requirements Met

✅ **Framework**: React with TypeScript  
✅ **Styling**: Exclusively Material-UI components and sx prop  
✅ **Logging**: Custom middleware with POST requests to evaluation service  
✅ **Authentication**: Auth token management (pre-authorized)  
✅ **Routing**: React Router with redirection handling  
✅ **Validation**: Comprehensive client-side validation  
✅ **State Management**: React hooks (useState, useEffect, useContext)  
✅ **Environment**: Runs on http://localhost:3000  
✅ **Responsive Design**: Mobile and desktop optimized  
✅ **Data Persistence**: LocalStorage implementation  

## Design Highlights

- **Modern Material Design**: Clean, professional aesthetic using MUI theme
- **Responsive Layout**: Optimized for all screen sizes
- **Intuitive UX**: Clear visual feedback and loading states
- **Accessible**: Proper semantic HTML and ARIA labels
- **Performance**: Optimized rendering and state management

This application demonstrates production-ready React development skills with a focus on user experience, clean code architecture, and comprehensive functionality.
