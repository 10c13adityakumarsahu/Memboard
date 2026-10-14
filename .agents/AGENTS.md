# MemoryBook Development Guidelines

## Architecture Overview
MemoryBook is a real-time collaborative digital scrapbook.
- **Frontend**: React, Vite, Tailwind CSS, Konva.js (for canvas), Framer Motion, Zustand (state), React Query.
- **Backend**: Django, Django REST Framework, Django Channels (WebSockets).
- **Realtime Collaboration**: Yjs (CRDT) integrated with WebSockets.
- **Database/Cache**: PostgreSQL, Redis, Celery (background tasks).
- **Storage**: MinIO (S3-compatible) with server-side encryption.
- **Deployment**: Docker, Docker Compose.

## Coding Conventions
### Frontend
- Use modern ES6+ JavaScript.
- CSS: Tailwind CSS exclusively for utility-first styling. Extract components for repeated patterns.
- Canvas: Isolate Konva.js rendering logic. Use React-Konva where suitable.
- State: Zustand for global UI state, Yjs for collaborative document state, React Query for server state.

### Backend
- Use Django best practices: Fat models, thin views.
- API: Build RESTful APIs using DRF. Use ViewSets and Routers where standard CRUD applies.
- WebSockets: Use Django Channels with Redis as the channel layer.
- Async tasks: Use Celery for heavy tasks (image processing, PDF generation, AI calls).

## Folder Structure (Proposed)
```text
/
├── frontend/             # React SPA
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── store/        # Zustand & Yjs state
│   │   ├── canvas/       # Konva.js rendering logic
│   │   ├── api/          # API integration (React Query)
│   │   ├── utils/        # Helpers
│   │   └── assets/       # Static files
│   └── package.json
├── backend/              # Django App
│   ├── core/             # Main Django settings
│   ├── users/            # Auth & Profiles
│   ├── books/            # Book CRUD & Templates
│   ├── collaboration/    # WebSockets & Yjs Sync
│   ├── storage/          # MinIO integrations
│   ├── requirements.txt
│   └── manage.py
├── docker/               # Dockerfiles for frontend/backend
└── docker-compose.yml    # Local dev orchestration
```

## Feature Roadmap
1. **Phase 1: Foundation & Auth**: Django setup, Postgres, Redis, User models, JWT auth. React + Vite setup, routing, login/signup UI.
2. **Phase 2: Dashboard & Book Management**: CRUD for Books. Templates structure.
3. **Phase 3: Canvas Editor (Core)**: Konva integration, basic objects (Text, Image), drag-and-drop.
4. **Phase 4: Realtime Collaboration**: Yjs integration, WebSockets via Django Channels, live cursors.
5. **Phase 5: Advanced Canvas & Media**: Video, Audio, shapes, grouping, layers. Storage integration (MinIO).
6. **Phase 6: Privacy & Permissions**: Object-level permissions, encrypted storage access.
7. **Phase 7: Export & Formats**: .membook custom format, PDF generation engine.
8. **Phase 8: AI & Polish**: AI templates, smile detection, animations, mobile optimization.

## Development Workflow
- Build incrementally. Feature by feature.
- Ensure each module is designed for scalability and production deployment.
- Write unit tests for backend APIs and core frontend logic.
- Maintain a CHANGELOG.
