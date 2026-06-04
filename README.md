# Work Together

**Ein Schwarzes Brett für Nachbarschafts- und Hilfsprojekte – wie eBay Kleinanzeigen, aber statt Gegenständen werden Projekte angeboten, denen man als Helfer beitritt.**

Jeder kann ein Projekt anlegen (z. B. „Gemeinschaftsgarten anlegen"), beschreiben, wie viele Helfer gesucht werden und welche Materialien gebraucht werden. Andere browsen die Projekte, treten als Helfer bei und stimmen sich in einem **Echtzeit-Kommentarbereich** ab. Projektleiter:innen verwalten ihr Projekt (bearbeiten, löschen), sehen die Helferliste und diskutieren live mit den Beteiligten.

![Übersicht](docs/gallery/overview.png)

Die Echtzeit-Abstimmung läuft über WebSockets – neue Kommentare erscheinen sofort bei allen, die die Projektseite offen haben, ohne Neuladen:

<video src="https://github.com/husaammaster/work-together/raw/main/docs/gallery/feature-realtime-chat.mp4" controls autoplay loop muted playsinline width="720"></video>

> Hinweis: Es gibt (noch) keine echte Anmeldung – oben rechts wählt man frei einen Namen und ist „eingeloggt als" diese Person. Das genügt, um Eigentümer, Helfer und Kommentarautoren auseinanderzuhalten.

## Features

### ✅ Umgesetzt

- **Projekt-CRUD** – Projekte anlegen, ansehen, bearbeiten und löschen (mit `_id`/`_rev`-Handling über CouchDB).
- **Projektübersicht & Detailseite** – Liste aller Projekte; Detailseite mit Beschreibung, Materialien, Helferliste und Kommentaren.
- **„Meine Projekte"** – serverseitig nach Nutzer gefilterte Projektliste.
- **Eigentümer-Rechte** – „Bearbeiten" und „Löschen" erscheinen nur für die Projektleiter:in; beim Bearbeiten kann das Projekt an eine andere Person übergeben werden.
- **Helfer-System** – einem Projekt als Helfer beitreten / es verlassen, mit Helferliste und **farbcodiertem Zähler** (rot → orange → grün).
- **Echtzeit-Kommentare über WebSocket** – Kommentare schreiben und löschen; alle offenen Projektseiten werden live aktualisiert (projektbezogene „Rooms", kein Polling). Ein „Live"-Badge zeigt die WebSocket-Verbindung an. Projektleiter-Kommentare bekommen ein Badge.
- **Theming** – Tailwind v4 + daisyUI v5, mehrere Themes (automatischer Wechsel im Header).
- **Containerisierung** – CouchDB, Express-Backend und React-Dev-Server laufen per Docker Compose mit File-Sync/Hot-Reload.

### 📋 Geplant / angelegt, aber nicht aktiv

- **Echte Nutzerkonten / Authentifizierung** – die Datenbanken `a_users` sowie die Beziehungs-DBs für Eigentümer (`b_proj_owner_user_rel`, `b_comment_owner_user_rel`, `b_proj_comment_rel`) werden beim Start angelegt, aber noch nicht verwendet. Aktuell ersetzt ein frei wählbarer Anzeigename die Anmeldung.
- **Legacy-Frontend (`public/`)** – die ursprüngliche Vanilla-JS/HTML-Variante. Vom Express-Server weiterhin ausgeliefert, aber durch die React-SPA abgelöst; nicht der gepflegte Stand.

## Tech-Stack

**Backend**
- Node.js (ES Modules), **Express 5**
- **CouchDB** als Datenbank, Client **`nano`**
- **`ws`** für den Echtzeit-WebSocket-Server (Kommentar-Chat)

**Frontend (`react_app/`)**
- **React 19** + **Vite 7**, **TypeScript**
- **React Router 7** (SPA-Routing)
- **Redux Toolkit** (globaler State, z. B. aktueller Nutzer)
- **Tailwind CSS v4** + **daisyUI v5** (Styling/Themes)

**Tooling / Betrieb**
- **Docker** & **Docker Compose** (Multi-Service-Dev mit `--watch`)
- **nodemon** (Backend-Reload)

> Nur vom Legacy-Frontend genutzt: `formidable` (Formular-Parsing im Endpoint `/processProjectForm`) und `bootstrap-icons`.

## Erste Schritte

Voraussetzungen: **Docker** (für CouchDB) und **Node.js**.

```bash
# 1. CouchDB-Zugangsdaten anlegen
cp .env.example .env        # admin/password sind als Default ok

# 2. CouchDB starten (Docker)
docker compose up -d couchdb

# 3. Backend (Express + WebSocket) – im Projektwurzelverzeichnis
#    COUCHDB_URL muss auf localhost:5984 zeigen, wenn das Backend lokal läuft
npm install
COUCHDB_URL=localhost:5984 npm run start
#    → REST-API auf http://localhost:80, WebSocket auf ws://localhost:8080

# 4. React-Frontend
cd react_app
npm install
npm run dev                 # → http://localhost:5173
```

### Alternativ: kompletter Stack in Docker

Bringt CouchDB, Backend und den React-Dev-Server zusammen hoch (Hot-Reload via File-Sync):

```bash
cp .env.example .env        # COUCHDB_URL=couchdb:5984 für den Compose-Pfad belassen
docker compose up --watch
```

- Backend (REST): http://localhost:80, WebSocket: ws://localhost:8080
- React-Dev-Server: http://localhost:5174
- CouchDB: http://localhost:5984

## Tests

Es gibt aktuell keine automatisierte Test-Suite (`npm test` ist ein Platzhalter). Das Frontend bietet jedoch Typprüfung und Linting:

```bash
cd react_app
npm run type-check   # tsc --noEmit
npm run lint         # eslint
```

## Galerie

Eine ausführliche, bebilderte Tour durch alle Features steht in [Gallery.md](Gallery.md).

## API-Endpunkte

REST (Express, Port 80):

| Bereich | Endpunkt | Zweck |
| --- | --- | --- |
| Projekte | `POST /projects` | Alle Projekte (oder nach Nutzer gefiltert) |
| | `POST /new_project` | Projekt anlegen (gibt neue `_id` zurück) |
| | `POST /project_page` | Einzelnes Projekt laden |
| | `POST /update_project` | Projekt aktualisieren (`proj_id` + `_rev`) |
| | `POST /delete_project` | Projekt löschen |
| Helfer | `POST /helper_list` | Helferliste eines Projekts |
| | `POST /join_project` | Als Helfer beitreten (`helper`) |
| | `POST /leave_project` | Als Helfer verlassen (`helper`) |
| Kommentare | `POST /comment_list` | Kommentare eines Projekts (Erstabruf) |

WebSocket (Port 8080) – der Echtzeit-Kommentar-Chat:

| Nachrichtentyp | Richtung | Zweck |
| --- | --- | --- |
| `subscribe` | Client → Server | Projekt-„Room" abonnieren (`{ proj_id }`) |
| `new_comment` | Client → Server | Kommentar speichern + an den Room broadcasten |
| `delete_comment` | Client → Server | Kommentar löschen + Löschung broadcasten |
| `comment_added` | Server → Clients | Neuer Kommentar (live) |
| `comment_deleted` | Server → Clients | Kommentar entfernt (live) |
