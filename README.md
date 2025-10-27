# Project Work Together

Projekt für ein Zusammenarbeit und gegenseitige Hilfe.

## Idee

Ebay Kleinanzeigen, aber statt Objekte, werden hier Projekte angelgt und von Helfern und Projektleitern abgearbeitet.

Accounts können Projekte erzeugen, alle Projekte browsen, eigene Projekte anzeigen und zu Projekten als Helfer beitreten.
Projekte haben eine Teilnehmerzahl, Teilnehmerlisten und eine Liste an benötigten Gegenständen.
Zusätzlich haben Projekte eine Liste an Kommentaren.
Jeder Kommentar hat einen Absender, einen Timestamp und einen Text und ist einem Projekt zugeordnet.

Inhaltlicher Fokus: mehrere couchDB Datenbanken, express Server, CRUD Operationen, nano, JS für Verarbeitung, Logik und Anzeige, CSS für Design

## Tech-Stack

- **chalk** zum leichteren debugging (nicht verwendet)
- **couchDB** zum speichern der verschiedenen Datenbanken (User, Projekte, Kommentare)
- **express.js** als Webserver
- **nano** als couchDB-Client
- **WebSocket (ws)** für Echtzeit-Kommunikation
- **vanilla js** als Legacy Frontend in `public/`
- **React.js (Vite)** als neue Frontend SPA in `react_app/` mit Redux Toolkit für State Management und Tailwind CSS für Styling

## Projekt-Status/Features

### Backend:

- Projekt-Datenbank (vollständig funktional)
- Projekt-Helfer-Datenbank (vollständig funktional)
- Kommentar-Datenbank (vollständig funktional)
- Webserver (Express.js auf Port 80)
- WebSocket-Server (auf Port 8080)
- WebSocket-Handlers (Infrastruktur vorhanden, aber nicht genutzt)

### Frontend:

- Basis-Styling mit CSS (mit starker AI hilfe, aber viel manueller Korrektur und bigfixes)
- Header mit Username-Input im Header
- **React SPA (Vite) in Entwicklung**: Projekt-Übersicht mit API-Fetch, Routing mit React Router, State Management mit Redux Toolkit für User-Verwaltung, Tailwind CSS für Dark-Mode UI

### Projekte

- Projekt-Übersicht (`index.html`)
- Projekt erstellen Seite (`add_project.html`)
- Projekt bearbeiten Seite (`edit_project.html`)
- Projekte nach Nutzer filtern Seite (`my_projects.html`)
- Klickbare Projekt-Titel führen zur Detailseite (`project_page.html`)
- Projekt-Detailseite mit URL-Parametern (`project_page.html?id=....`)
- Projekt löschen (Delete mit \_id und \_rev)
- Projekt aktualisieren (Update mit \_id und \_rev)
- Eigene Projekte visuell hervorheben (Owner-Badge)
- Edit/Delete-Buttons nur für eigene Projekte
- **Vollständige CRUD-Operationen für Projekte (Create, Read, Update, Delete)**

### Helfer

- Helfer-System Backend (join_project, leave_project, helper_list)
- Helfer-System Frontend (Beitreten-Button, Verlassen-Button, Helferliste)
- Helfer-Anzahl mit Farbcodierung (rot/orange/grün)
- CRUD-Operationen für Helfer (Create, Read, Delete)

### Kommentare

- Kommentar-System Backend (new_comment, comment_list, delete_comment)
- Kommentar-System Frontend (Kommentar-Formular, Kommentar-Liste, Timestamp, Projektleiter-Badge)
- Kommentar-Anzahl-Badge auf Übersichtsseite
- Dynamisches Hinzufügen/Löschen ohne Page-Reload
- CRUD-Operationen für Kommentare (Create, Read, Delete)

## Datenbank-Schema

### Datenbanken:

| Name                     | Beschreibung             | Status        |
| ------------------------ | ------------------------ | ------------- |
| `a_projects`             | Projekt-Eigenschaften    | IN VERWENDUNG |
| `a_comments`             | Kommentar-Eigenschaften  | IN VERWENDUNG |
| `b_proj_helper_user_rel` | Projekt-Helfer Beziehung | IN VERWENDUNG |

## API Endpoints

### Projekte

- `POST /projects` - Alle Projekte oder gefiltert nach Nutzer
- `POST /new_project` - Neues Projekt erstellen
- `POST /update_project` - Projekt aktualisieren (mit \_id und \_rev)
- `POST /delete_project` - Projekt löschen
- `POST /project_page` - Einzelnes Projekt abrufen
- `POST /processProjectForm` - Formular-Daten verarbeiten

### Helfer

- `POST /helper_list` - Helferliste eines Projekts abrufen
- `POST /join_project` - Als Helfer beitreten
- `POST /leave_project` - Als Helfer verlassen

### Kommentare

- `POST /comment_list` - Kommentare eines Projektes abrufen
- `POST /new_comment` - Kommentar hinzufügen
- `POST /delete_comment` - Kommentar löschen

## Installation & Start

```bash
# Dependencies installieren
npm install

# CouchDB muss laufen (Standard: localhost:5984)
# Credentials in server/datenbanken/credentials.json anpassen

# Server starten
npm run start
```

## Development (Docker Compose)

- Lokaler Server läuft über Docker Compose mit develop.watch.
- Start im Watch-Modus (damit Änderungen in den Container synchronisiert werden):

```bash
docker compose up --watch
```

- Hinweise
  - Die `develop.watch`-Regeln in `compose.yaml` sind nur aktiv, wenn mit `--watch` gestartet wird (oder `docker compose watch`).
  - Backend-Änderungen unter `server/` triggern automatische Neustarts via nodemon.
  - Frontend-Dateien unter `public/` benötigen keinen Server-Neustart; Browser-Refresh reicht.

## Frontend-Containerisierung (Status)

- Legacy: Statische Dateien in `public/` werden über Express (`server/server.js`) geliefert.
- New: Decoupled React (Vite) SPA in `react_app/` – API-driven frontend.
  - Läuft lokal auf `localhost:5173` (`npm run dev` in `react_app/`).
  - Fetcht von Backend auf `http://localhost:80`.
  - CORS konfiguriert für `localhost:5173`, damit react_app vom server fetchen darf.
- Containerisierung ausgesetzt bis vollständige Funktionalität gemerged ist.
