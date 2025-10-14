# Project Work Together

Projekt für ein Zusammenarbeit und gegenseitige Hilfe.

## Idee

Ebay Kleinanzeigen, aber statt Objekte, werden hier Projekte angelgt und abgearbeitet.

Accounts können Projekte erzeugen, Projekte browsen und zu Projekten als Helfer beitreten.
Projekte haben eine Teilnehmerzahl, Teilnehmerlisten und eine Liste an gebrauchten Gegenständen.
Zusätzlich haben Projekte eine Liste an Kommentaren.
Jeder Kommentar hat einen Absender, einen Timestamp und einen Text und ist einem Projekt zugeordnet.

## Tech-Stack
- **chalk** zum leichteren debugging
- **couchDB** zum speichern der verschiedenen Datenbanken (User, Projekte, Kommentare)
- **express.js** als Webserver
- **nano** als couchDB-Client
- **WebSocket (ws)** für Echtzeit-Kommunikation
- **vanilla js** als Frontend, danach React.js falls genug Zeit da ist (Lernfokus ist aber couchDB Datenbanken)

## Projekt-Status (Tag 4 von 6)

### Bereits implementiert:
- User-Datenbank (Schema erstellt)
- Projekt-Datenbank (vollständig funktional)
- Kommentar-Datenbank (Schema erstellt)
- Webserver (Express.js auf Port 80)
- WebSocket-Server (auf Port 8080)
- Frontend was im Header den Username anzeigt (als Input)
- Frontend zur Darstellung einer Liste von Projekten
- Projekt erstellen (Add Project Page)
- Projekte nach Nutzer filtern (My Projects Page)
- Basis-Styling mit CSS
- DOM-Manipulation Utilities
- CRUD-Operationen für Projekte (Create, Read)

### Teilweise implementiert, aber pausiert:
- WebSocket-Handlers (Infrastruktur vorhanden, aber nicht genutzt)
- Fehlerbehandlung und Validierung

## Feature Roadmap - Verbleibende 3 Tage

| Priorität | Feature | Beschreibung | Geschätzte Zeit | Tag |
|-----------|---------|--------------|-----------------|-----|
| **HOCH** | **Projekt-Detailseite** | Einzelne Projekt-Ansicht mit allen Details | **2-3h** | **4** |
| **HOCH** | **Projekt bearbeiten/löschen** | Edit/Delete Funktionalität für eigene Projekte | **1-2h** | **4** |
| **HOCH** | **Helfer-System (Backend)** | API-Endpoints zum Beitreten/Verlassen von Projekten | **1-2h** | **4** |
| **HOCH** | **Helfer-System (Frontend)** | Button "Als Helfer beitreten" + Helfer-Liste anzeigen | **2-3h** | **4** |
| **HOCH** | **Kommentar-System (Backend)** | API-Endpoints für Kommentare (Create, Read) | **1-2h** | **5** |
| **HOCH** | **Kommentar-System (Frontend)** | Kommentar-Formular + Kommentar-Liste in Projekt-Details | **2-3h** | **5** |
| **NIEDRIG** | **Styling verbessern** | bessere UX | **1-2h** | **6** |
| **OPTIONAL** | **React.js Migration** | Frontend auf React umstellen | **8-12h** | - |

### Empfohlener Zeitplan (3 Tage verbleibend)

#### Tag 4 - 8h
- Projekt-Detailseite (2-3h)
- Eigenes Projekt bearbeiten/löschen (1-2h)
- Helfer-System Backend (1-2h)
- Helfer-System Frontend (2-3h)
- Testing & Bugfixes (1h)

#### Tag 5 - 8h
- Kommentar-System Backend (1-2h)
- Kommentar-System Frontend (2-3h)
- Testing & Integration (1-2h)

#### Tag 6 (letzter Tag) - 8h
- Styling & UX-Verbesserungen (1-2h)
- React Umstellung (8-12h)
- Finale Tests & Dokumentation (1-2h)

### Kritischer Pfad (Minimum Viable Product)
Wenn die Zeit knapp wird, konzentriere dich auf diese Features:
1. **Projekt-Detailseite** (essentiell)
2. **Helfer-System** (Kernfunktionalität)
3. **Kommentar-System** (Kernfunktionalität)

## Datenbank-Schema

### Datenbanken:
- `a_projects` - Projekt-Eigenschaften
- `a_users` - User-Eigenschaften
- `a_comments` - Kommentar-Eigenschaften
- `b_proj_owner_user_rel` - Projekt-Besitzer Beziehung
- `b_comment_owner_user_rel` - Kommentar-Besitzer Beziehung
- `b_proj_comment_rel` - Projekt-Kommentar Beziehung
- `b_proj_helper_user_rel` - Projekt-Helfer Beziehung

## Installation & Start

```bash
# Dependencies installieren
npm install

# CouchDB muss laufen (Standard: localhost:5984)
# Credentials in server/datenbanken/credentials.json anpassen

# Server starten
npm start