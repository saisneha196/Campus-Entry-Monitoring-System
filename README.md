# RVVM - Real-time Visitor & Vehicle Management System

A comprehensive full-stack application for managing visitor entries, vehicle tracking, and QR code-based check-ins for corporate environments.

## 🚀 Features

### 🎯 Core Functionality
- **Real-time Visitor Management** - Track and manage visitor entries in real-time
- **QR Code Generation & Scanning** - Ultra-robust QR scanner with multi-strategy camera access
- **Vehicle Entry Management** - Track cab/vehicle entries and exits
- **Multi-role Authentication** - Separate interfaces for Security, Hosts, and Visitors
- **Real-time Dashboard** - Live updates using Firebase real-time database
- **Mobile-responsive Design** - Works seamlessly on all devices

### 🔒 Security Features
- **Protected Routes** - Role-based access control
- **Firebase Authentication** - Secure user management
- **Data Validation** - Comprehensive input validation and sanitization
- **Environment Variables** - Secure configuration management

### 📱 QR Scanner Features
- **Ultra-robust Camera Access** - 4 different constraint strategies with retry logic
- **Multi-format QR Support** - Handles both JSON and plain text QR codes
- **Manual Input Fallback** - Alternative input methods when camera fails
- **Flash Support** - Built-in flash toggle for low-light conditions
- **Comprehensive Error Handling** - Clear error messages and recovery options

## 🏗 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for modern UI components
- **React Router** for navigation
- **Firebase SDK** for authentication and database
- **QR Scanner Library** for camera-based QR code scanning
- **Context API** for state management

### Backend
- **Node.js** with TypeScript
- **Express.js** framework
- **Firebase Admin SDK** for server-side operations
- **CORS** for cross-origin requests
- **Environment-based configuration**

### Database & Services
- **Firebase Firestore** for real-time database
- **Firebase Authentication** for user management
- **Firebase Storage** for file uploads (if needed)

## 📁 Project Structure

```
RVVM-Auxia_Hackathon/
├── rvvm-backend/                 # Node.js TypeScript Backend
│   ├── src/
│   │   ├── controllers/          # API Controllers
│   │   ├── middleware/           # Authentication & validation
│   │   ├── routes/               # API Routes
│   │   ├── services/             # Firebase Admin & business logic
│   │   ├── types/                # TypeScript type definitions
│   │   └── index.ts              # Server entry point
│   ├── firestore.rules           # Firestore security rules
│   ├── package.json
│   └── tsconfig.json
│
├── rvvm-react-app/               # React TypeScript Frontend
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── contexts/             # React Context providers
│   │   ├── hooks/                # Custom React hooks
│   │   ├── pages/                # Page components
│   │   │   ├── auth/             # Authentication pages
│   │   │   ├── host/             # Host dashboard pages
│   │   │   ├── security/         # Security dashboard pages
│   │   │   └── visitor/          # Visitor-facing pages
│   │   ├── services/             # Firebase configuration
│   │   ├── types/                # TypeScript interfaces
│   │   └── data/                 # Static data and configurations
│   ├── firebase.json             # Firebase hosting config
│   ├── firestore.rules           # Frontend Firestore rules
│   └── package.json
│
├── .gitignore                    # Git ignore rules
└── README.md                     # This file
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Firebase Project** with Firestore enabled
- **Git** for version control

### 1. Clone the Repository
```bash
git clone <repository-url>
cd RVVM-Auxia_Hackathon
```

### 2. Backend Setup

```bash
cd rvvm-backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Firebase service account key and configuration

# Start development server
npm run dev
```

**Backend Environment Variables (.env):**
```
FIREBASE_SERVICE_ACCOUNT_KEY=path/to/serviceAccountKey.json
PORT=5000
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd rvvm-react-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Firebase web configuration

# Start development server
npm start
```

**Frontend Environment Variables (.env):**
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 4. Firebase Setup

1. **Create Firebase Project**
2. **Enable Authentication** (Email/Password)
3. **Create Firestore Database**
4. **Set up Firestore Rules** (use provided rules files)
5. **Generate Service Account Key** for backend

## 📱 Usage

### For Security Personnel
1. **Login** with security credentials
2. **Scan QR codes** for visitor check-ins
3. **Register new visitors** on-the-spot
4. **View real-time dashboard** with all entries
5. **Manage cab/vehicle entries**

### For Hosts/Employees
1. **Login** with employee credentials
2. **Pre-register visitors** for meetings
3. **View pending visitor approvals**
4. **Track visitor status** in real-time

### For Visitors
1. **Register** for building entry
2. **Receive QR code** via email/SMS
3. **Show QR code** at security for quick check-in
4. **Track visit status**

## 🔧 API Endpoints

### Visitor Management
```
POST   /api/visitors              # Create new visitor entry
GET    /api/visitors              # Get all visitors
GET    /api/visitors/:id          # Get specific visitor
PUT    /api/visitors/:id          # Update visitor status
DELETE /api/visitors/:id          # Remove visitor entry
```

### Authentication
```
POST   /api/auth/login            # User login
POST   /api/auth/register         # User registration
POST   /api/auth/logout           # User logout
GET    /api/auth/profile          # Get user profile
```

## 🛡 Security Considerations

- **Environment Variables** - Never commit .env files
- **Firestore Rules** - Implement proper read/write permissions
- **Input Validation** - All user inputs are validated and sanitized
- **CORS Configuration** - Properly configured for production
- **Authentication** - JWT-based authentication with Firebase
- **HTTPS Only** - Camera access requires HTTPS in production

## 🐛 Troubleshooting

### QR Scanner Issues
- **Camera Permission**: Ensure browser allows camera access
- **HTTPS Requirement**: Camera works on localhost or HTTPS only
- **Multiple Strategies**: Scanner tries 4 different camera configurations
- **Manual Fallback**: Use manual QR input if camera fails

### Common Issues
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Reset Firebase cache
firebase logout
firebase login

# Check environment variables
cat .env
```

## 🚀 Deployment

### Frontend (Firebase Hosting)
```bash
cd rvvm-react-app
npm run build
firebase deploy --only hosting
```

### Backend (Node.js Server)
```bash
cd rvvm-backend
npm run build
# Deploy to your preferred hosting service (Heroku, DigitalOcean, etc.)
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 👥 Team

- **Frontend Development** - React TypeScript with Material-UI
- **Backend Development** - Node.js TypeScript with Express
- **Database Design** - Firebase Firestore
- **QR Scanner** - Ultra-robust camera access implementation
- **Authentication** - Firebase Auth integration

## 🆘 Support

For support and questions:
- **Create an issue** in this repository
- **Check the troubleshooting section** above
- **Review Firebase documentation** for configuration issues

## 📊 Features Roadmap

- [ ] **Notification System** - SMS/Email notifications
- [ ] **Analytics Dashboard** - Visit patterns and statistics
- [ ] **Bulk Import** - CSV import for pre-registered visitors
- [ ] **Mobile App** - Native mobile applications
- [ ] **Integration APIs** - Third-party system integration
- [ ] **Advanced Reporting** - Detailed visit reports and exports

---

**Built with ❤️ for efficient visitor and vehicle management**
