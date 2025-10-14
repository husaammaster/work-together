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
- Helfer-Datenbank (vollständig funktional)
- Kommentar-Datenbank (Schema erstellt, noch nicht genutzt)
- Webserver (Express.js auf Port 80)
- WebSocket-Server (auf Port 8080)
- Frontend mit Username-Input im Header
- Projekt-Übersicht (Home Page mit allen Projekten)
- Projekt erstellen (Add Project Page)
- Projekte nach Nutzer filtern (My Projects Page)
- Projekt-Detailseite mit URL-Parametern (project_page.html)
- Projekt löschen (Delete mit _id und _rev)
- Eigene Projekte visuell hervorheben (lightblue Name)
- Delete-Button nur für eigene Projekte
- Helfer-System Backend (join_project, leave_project, helper_list)
- Helfer-System Frontend (Beitreten-Button, Verlassen-Button, Helferliste)
- Helfer-Anzahl mit Farbcodierung (rot/orange/grün)
- Klickbare Projekt-Titel führen zur Detailseite
- Basis-Styling mit CSS
- CRUD-Operationen für Projekte (Create, Read, Delete)
- CRUD-Operationen für Helfer (Create, Read, Delete)

### Teilweise implementiert, aber pausiert:
- WebSocket-Handlers (Infrastruktur vorhanden, aber nicht genutzt)
- Fehlerbehandlung und Validierung

## Feature Roadmap - Verbleibende 2 Tage

| Priorität | Feature | Beschreibung | Geschätzte Zeit | Tag |
|-----------|---------|--------------|-----------------|-----|
| **HOCH** | **Kommentar-System (Backend)** | API-Endpoints für Kommentare (Create, Read) | **1-2h** | **5** |
| **HOCH** | **Kommentar-System (Frontend)** | Kommentar-Formular + Kommentar-Liste in Projekt-Details | **2-3h** | **5** |
| **MITTEL** | **Projekt bearbeiten** | Edit Funktionalität für eigene Projekte | **1-2h** | **5** |
| **NIEDRIG** | **Styling verbessern** | bessere UX, responsive Design | **1-2h** | **6** |
| **NIEDRIG** | **Fehlerbehandlung** | Bessere Error Messages und Validierung | **1-2h** | **6** |
| **OPTIONAL** | **React.js Migration** | Frontend auf React umstellen | **8-12h** | - |

### Empfohlener Zeitplan (2 Tage verbleibend)

#### Tag 4 - ABGESCHLOSSEN (ca. 6-7h investiert)
- Projekt-Detailseite (2-3h) - FERTIG
- Helfer-System Backend (1-2h) - FERTIG
- Helfer-System Frontend (2-3h) - FERTIG
- Farbcodierung Helfer-Anzahl - FERTIG
- Testing & Bugfixes (1h) - FERTIG

**Geschätzte verbleibende Zeit: ~16h (2 Tage)**

#### Tag 5 - 8h
- Kommentar-System Backend (1-2h)
- Kommentar-System Frontend (2-3h)
- Projekt bearbeiten (1-2h)
- Testing & Integration (2-3h)

**Geschätzte verbleibende Zeit nach Tag 5: ~8h (1 Tag)**

#### Tag 6 (letzter Tag) - 8h
- Styling & UX-Verbesserungen (1-2h)
- React Umstellung (8-12h)
- Word Dokument anfertigen und hochladen
- Finale Tests & Dokumentation (1-2h)

### Kritischer Pfad (Minimum Viable Product)
Wenn die Zeit knapp wird, konzentriere dich auf diese Features:
1. **Kommentar-System** (letzte Kernfunktionalität)
2. **Fehlerbehandlung** (Stabilität)
3. **Testing** (Qualitätssicherung)

## Datenbank-Schema

### Datenbanken:
- `a_projects` - Projekt-Eigenschaften
- `a_users` - User-Eigenschaften
- `a_comments` - Kommentar-Eigenschaften
- `b_proj_owner_user_rel` - Projekt-Besitzer Beziehung
- `b_comment_owner_user_rel` - Kommentar-Besitzer Beziehung
- `b_proj_comment_rel` - Projekt-Kommentar Beziehung
- `b_proj_helper_user_rel` - Projekt-Helfer Beziehung (IN VERWENDUNG)

## API Endpoints

### Projekte
- `POST /projects` - Alle Projekte oder gefiltert nach Nutzer
- `POST /new_project` - Neues Projekt erstellen
- `POST /delete_project` - Projekt löschen
- `POST /project_page` - Einzelnes Projekt abrufen
- `POST /processProjectForm` - Formular-Daten verarbeiten

### Helfer
- `POST /helper_list` - Helferliste eines Projekts abrufen
- `POST /join_project` - Als Helfer beitreten
- `POST /leave_project` - Als Helfer verlassen

### Noch zu implementieren
- `POST /comments` - Kommentare abrufen
- `POST /new_comment` - Kommentar hinzufügen
- `POST /delete_comment` - Kommentar löschen

- `POST /edit_project` - Projekt bearbeiten

## Installation & Start

```bash
# Dependencies installieren
npm install

# CouchDB muss laufen (Standard: localhost:5984)
# Credentials in server/datenbanken/credentials.json anpassen

# Server starten
npm run start