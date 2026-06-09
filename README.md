# Work Together

**Ein Schwarzes Brett für Nachbarschafts- und Hilfsprojekte – wie eBay Kleinanzeigen, aber statt Gegenständen werden Projekte angeboten, denen man als Helfer beitritt.**

Jeder kann ein Projekt anlegen (z. B. „Gemeinschaftsgarten anlegen"), beschreiben, wie viele Helfer gesucht werden und welche Materialien gebraucht werden. Andere browsen die Projekte, treten als Helfer bei und stimmen sich in einem Kommentarbereich ab. Projektleiter:innen verwalten ihr Projekt (bearbeiten, löschen, Helfer entfernen), sehen die Helferliste und diskutieren live mit den Beteiligten.

Die ganze App ist **in Echtzeit synchron**: die Projektübersicht, die Helfer- und Kommentarzähler, die Helferlisten und der Kommentar-Chat aktualisieren sich über WebSockets sofort bei allen, die sie offen haben – ohne Neuladen. Jede Projektkarte zeigt den Helferstand farbcodiert (rot = leer, orange = teilweise, grün = voll) und die Kommentarzahl.

![Übersicht](docs/gallery/overview.png)

Während eine Person zusieht (links), aktualisiert sich die Übersicht live, sobald jemand anderes (rechts) beitritt, kommentiert oder ein neues Projekt anlegt – die Echtzeit-Clips sind als zwei gleichzeitig aufgenommene Fenster nebeneinander zu sehen:

<video src="https://github.com/husaammaster/work-together/raw/main/docs/gallery/feature-live-list.mp4" controls autoplay loop muted playsinline width="860"></video>

> Hinweis: Es gibt (noch) keine echte Anmeldung – oben rechts wählt man frei einen Namen und ist „eingeloggt als" diese Person. Das genügt, um Eigentümer, Helfer und Kommentarautoren auseinanderzuhalten.

## Features

### ✅ Umgesetzt

- **Projekt-CRUD** – Projekte anlegen, ansehen, bearbeiten und löschen (mit `_id`/`_rev`-Handling über CouchDB). Nach dem Anlegen geht es direkt auf die neue Detailseite.
- **Live-Projektübersicht** – Liste aller Projekte; neue/geänderte/gelöschte Projekte erscheinen, ändern sich und verschwinden in Echtzeit bei allen offenen Listen. Jede Karte ist komplett anklickbar.
- **Farbcodierte Live-Zähler** – jede Karte zeigt den Helferstand relativ zur gesuchten Anzahl (rot = 0, orange = teilweise, grün = voll/überbelegt) und die Kommentarzahl; beide aktualisieren sich live.
- **Detailseite** – Beschreibung, Materialien, Helferliste und Kommentare, alles live.
- **„Meine Projekte"** – serverseitig nach Nutzer gefilterte Projektliste.
- **Eigentümer-Rechte** – „Bearbeiten" und „Löschen" erscheinen nur für die Projektleiter:in; beim Bearbeiten kann das Projekt übergeben werden; die Projektleiter:in kann außerdem einzelne Helfer entfernen. Wird ein offenes Projekt gelöscht, zeigt die Seite live einen „Projekt wurde gelöscht"-Hinweis.
- **Echtzeit-Helfer & -Kommentare über WebSocket** – beitreten/verlassen/entfernen und Kommentare schreiben/löschen laufen über projektbezogene „Rooms" (kein Polling); alle offenen Seiten aktualisieren sich sofort. Ein „Live"-Badge zeigt die WebSocket-Verbindung, Projektleiter-Kommentare bekommen ein Badge.
- **Theming** – Tailwind v4 + daisyUI v5; im Header schaltet ein 🎨-Button manuell durch die Themes (kein Auto-Wechsel), die Auswahl wird in `localStorage` gemerkt.
- **Containerisierung** – CouchDB, Express-Backend und React-Dev-Server laufen per Docker Compose mit File-Sync/Hot-Reload.

### 📋 Geplant / angelegt, aber nicht aktiv

- **Echte Nutzerkonten / Authentifizierung** – die Datenbanken `a_users` sowie die Beziehungs-DBs für Eigentümer (`b_proj_owner_user_rel`, `b_comment_owner_user_rel`, `b_proj_comment_rel`) werden beim Start angelegt, aber noch nicht verwendet. Aktuell ersetzt ein frei wählbarer Anzeigename die Anmeldung.
- **Legacy-Frontend (`public/`)** – die ursprüngliche Vanilla-JS/HTML-Variante. Vom Express-Server weiterhin ausgeliefert, aber durch die React-SPA abgelöst; nicht der gepflegte Stand.

## Tech-Stack

**Backend**
- Node.js (ES Modules), **Express 5**
- **CouchDB** als Datenbank, Client **`nano`**
- **`ws`** für den Echtzeit-WebSocket-Server (Projektliste, Helfer, Kommentare, Live-Zähler)

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
#    → REST-API auf http://localhost:5100, WebSocket auf ws://localhost:8080

# 4. React-Frontend
cd react_app
npm install
npm run dev                 # → http://localhost:5101
```

Ports folgen dem `PORTS.md`-Schema (Block 5100–5199): Backend `5100`, lokaler React-Dev `5101`, WebSocket `8080`, CouchDB `5984`.

Zum Befüllen/Zurücksetzen der Datenbank auf einen bekannten Demo-Stand (3 Projekte mit unterschiedlichen Helfer-Füllständen + Kommentare) gibt es einen Endpunkt – praktisch für Tests und Aufnahmen:

```bash
curl -X POST http://localhost:5100/dev/seed
```

### Alternativ: kompletter Stack in Docker

Bringt CouchDB, Backend und den React-Dev-Server zusammen hoch (Hot-Reload via File-Sync):

```bash
cp .env.example .env        # COUCHDB_URL=couchdb:5984 für den Compose-Pfad belassen
docker compose up --watch
```

- Backend (REST): http://localhost:5100, WebSocket: ws://localhost:8080
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

REST (Express, Port 5100):

REST wird für den Erstabruf (Listen/Detail) und die Projektformulare genutzt; Mutationen werden zusätzlich über WebSocket an alle offenen Clients gebroadcastet.

| Bereich | Endpunkt | Zweck |
| --- | --- | --- |
| Dev | `POST /dev/seed` | Datenbank auf den Demo-Seed zurücksetzen (für Tests/Aufnahmen) |
| Projekte | `POST /projects` | Alle Projekte (oder nach Nutzer gefiltert), inkl. Helfer-/Kommentarzahl |
| | `POST /new_project` | Projekt anlegen (gibt neue `_id` zurück, broadcastet `project_added`) |
| | `POST /project_page` | Einzelnes Projekt laden |
| | `POST /update_project` | Projekt aktualisieren (`proj_id` + `_rev`, broadcastet `project_updated`) |
| | `POST /delete_project` | Projekt löschen (broadcastet `project_deleted`) |
| Helfer | `POST /helper_list` | Helferliste eines Projekts |
| | `POST /join_project` | Als Helfer beitreten (`helper`) |
| | `POST /leave_project` | Helfer entfernen (`helper`) |
| Kommentare | `POST /comment_list` | Kommentare eines Projekts (Erstabruf) |

WebSocket (Port 8080) – die Echtzeit-Schicht. Clients abonnieren entweder eine einzelne Projektseite (`subscribe`) oder die Projektliste (`subscribe_projects`):

| Nachrichtentyp | Richtung | Zweck |
| --- | --- | --- |
| `subscribe` | Client → Server | Projekt-„Room" abonnieren (`{ proj_id }`) |
| `subscribe_projects` | Client → Server | Projektlisten-„Room" abonnieren |
| `new_comment` / `delete_comment` | Client → Server | Kommentar anlegen/löschen + broadcasten |
| `join_project` / `leave_project` | Client → Server | Helfer hinzufügen/entfernen + broadcasten |
| `delete_project` | Client → Server | Projekt löschen + broadcasten |
| `comment_added` / `comment_deleted` | Server → Clients | Kommentar live hinzugefügt/entfernt (Projekt-Room) |
| `helper_added` / `helper_removed` | Server → Clients | Helfer live hinzugefügt/entfernt (Projekt-Room) |
| `project_added` / `project_updated` / `project_deleted` | Server → Clients | Projekt live in der Liste (Listen-Room); `project_deleted` geht auch an die offene Detailseite |
| `counts_updated` | Server → Clients | Aktualisierte Helfer-/Kommentarzahl einer Karte (Listen-Room) |
