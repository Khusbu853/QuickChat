# 💬 QuickChat

QuickChat is a web-based messaging platform that combines individual and group messaging in one interface. you get real-time one-on-one chats with contacts, but also the ability to create and join channels where groups can collaborate. Messages are persisted to a database, users can upload images/files, and everything happens in real-time through WebSocket connections.

## ✨ Why QuickChat is Interesting

- **Clean Separation:** Real-time direct messages and channels work seamlessly together
- **Socket.io Patterns:** Demonstrates scalable chat architecture patterns for production
- **Modern Stack:** React 19, Express 5, MongoDB, Redux state management
- **File Sharing:** Support for image/file uploads via Cloudinary


## 🏗️ Architecture

### Frontend Architecture
```
React SPA (Vite)
├── Redux Store (Auth + User State)
├── Pages
│   ├── /auth → Signup/Login
│   ├── /profile → User onboarding
│   └── /chat → Main interface (DMs + Channels)
└── Real-time Connection
    └── Socket.io client
```

### Backend Architecture
```
Express Server
├── Routes
│   ├── /api/auth → Signup, Login, Token refresh
│   ├── /api/contacts → Get user contacts
│   ├── /api/messages → Send/fetch direct messages
│   ├── /api/users → User profiles
│   └── /api/channels → Channel operations
├── Database
│   └── MongoDB (Users, Messages, Channels)
└── Real-time Layer
    └── Socket.io (WebSocket server)
        ├── User connection mapping (userId → socketId)
        └── Message broadcasting
```

