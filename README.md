# note-making-app
# 📓 NoteFlow — React + Node.js + PostgreSQL

A full-stack note-taking app with CRUD, search, tags, pin/unpin, color labels, sort, and list/grid view toggle.

---

## Quick Start

### 1. PostgreSQL — create the database
```bash
psql -U postgres -c "CREATE DATABASE notesdb;"
```

### 2. Backend
```bash
cd backend
cp .env.example .env      # edit DB credentials if needed
npm install
npm run dev               # → http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm start                 # → http://localhost:3000
```

---

## Project Structure

```
notes-app/
├── .gitignore
├── README.md
│
├── backend/
│   ├── config/
│   │   └── db.js                  # PostgreSQL pool + table init
│   ├── controllers/
│   │   └── notesController.js     # CRUD + pin + tag filter
│   ├── routes/
│   │   └── notes.js               # Express router
│   ├── server.js                  # Express entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── NoteCard.jsx        # Note card (grid + list view)
        │   ├── NoteModal.jsx       # Create / edit modal w/ tags + char count
        │   ├── SearchBar.jsx       # Debounced live search
        │   ├── SortBar.jsx         # Sort dropdown + grid/list toggle
        │   ├── StatsBar.jsx        # Notes / pinned / words summary
        │   ├── EmptyState.jsx      # Empty / no-results screen
        │   └── Toast.jsx           # Toast notification system
        ├── hooks/
        │   ├── useNotes.js         # Notes state + API + sort logic
        │   └── useToast.js         # Toast queue manager
        ├── services/
        │   └── api.js              # Axios API layer
        ├── App.js
        ├── App.css
        └── index.js
```

---

## API Reference

| Method | Endpoint             | Description               |
|--------|----------------------|---------------------------|
| GET    | /api/notes           | Get all notes             |
| GET    | /api/notes?search=q  | Search by title/content   |
| GET    | /api/notes?tag=work  | Filter by tag             |
| GET    | /api/notes/:id       | Get note by ID            |
| POST   | /api/notes           | Create note               |
| PUT    | /api/notes/:id       | Update note               |
| DELETE | /api/notes/:id       | Delete note               |
| PATCH  | /api/notes/:id/pin   | Toggle pin                |

### POST / PUT body
```json
{
  "title": "My Note",
  "content": "Note body text",
  "color": "#fef9c3",
  "tags": ["work", "ideas"]
}
```

---

## Features

| Feature | Detail |
|---|---|
| **Full CRUD** | Create, read, update, delete |
| **Live search** | Debounced search across title + content |
| **Tags** | Up to 5 tags per note, filterable via API |
| **Pin notes** | Pinned notes float to top |
| **7 color labels** | White, yellow, green, blue, pink, purple, orange |
| **Sort** | By latest, oldest, title A–Z, title Z–A |
| **Grid / List view** | Toggle between layouts |
| **Stats bar** | Total notes, pinned count, word count |
| **Toast notifications** | Feedback on every action |
| **Char count** | Live counter in editor (2000 char limit) |
| **Keyboard shortcut** | `Ctrl+N` / `Cmd+N` to open new note |
| **Auto DB init** | Table created automatically on first run |
| **Responsive** | Mobile-friendly layout |

---

## Environment Variables (`backend/.env`)

```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=notesdb
DB_USER=postgres
DB_PASSWORD=postgres
```
