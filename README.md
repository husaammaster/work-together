# Project Work Together

Projekt für ein Zusammenarbeit und gegenseitige Hilfe.

## Idee

Ebay Kleinanzeigen, aber statt Objekte, werden hier Projekte angelgt und abgearbeitet.

Accounts können Projekte erzeugen, Projekte browsen und zu Projekten als Helfer beitreten.
Projekte haben eine Teilnehmerzahl, Teilnehmerlisten und eine Liste an gebrauchten Gegenständen.
Zusätzlich haben Projekte eine Liste an Kommentaren.
Jeder Kommentar hat einen Absender, einen Timestamp und einen Text und ist einem Projekt zugeordnet.

## Tech-Stack
- **chalk** zum leichteren debugging (nicht verwendet)
- **couchDB** zum speichern der verschiedenen Datenbanken (User, Projekte, Kommentare)
- **express.js** als Webserver
- **nano** als couchDB-Client
- **WebSocket (ws)** für Echtzeit-Kommunikation
- **vanilla js** als Frontend, danach React.js falls genug Zeit da ist (Lernfokus ist aber couchDB Datenbanken)

## Projekt-Status/Features

### Backend:
- Projekt-Datenbank (vollständig funktional)
- Projekt-Helfer-Datenbank (vollständig funktional)
- Kommentar-Datenbank (vollständig funktional)
- Webserver (Express.js auf Port 80)
- WebSocket-Server (auf Port 8080)
- WebSocket-Handlers (Infrastruktur vorhanden, aber nicht genutzt)

### Frontend:
- Basis-Styling mit CSS
- Header mit Username-Input im Header

### Projekte
- Projekt-Übersicht (`index.html`)
- Projekt erstellen Seite (`add_project.html`)
- Projekte nach Nutzer filtern Seite (`my_projects.html`)
- Klickbare Projekt-Titel führen zur Detailseite (`project_page.html`)
- Projekt-Detailseite mit URL-Parametern (`project_page.html?id=....`)
- Projekt löschen (Delete mit _id und _rev)
- Eigene Projekte visuell hervorheben (lightblue Name)
- Delete-Button nur für eigene Projekte
- CRUD-Operationen für Projekte (Create, Read, Delete)

### Helfer
- Helfer-System Backend (join_project, leave_project, helper_list)
- Helfer-System Frontend (Beitreten-Button, Verlassen-Button, Helferliste)
- Helfer-Anzahl mit Farbcodierung (rot/orange/grün)
- CRUD-Operationen für Helfer (Create, Read, Delete)

### Kommentare
- Kommentar-System Backend (new_comment, comment_list, delete_comment)
- Kommentar-System Frontend (Kommentar-Formular, Kommentar-Liste, Timestamp, Projektleiter-Badge)
- Kommentar-Anzahl-Badge auf Übersichtsseite
- CRUD-Operationen für Kommentare (Create, Read, Delete)

## Feature Roadmap - Verbleibende 2 Tage

| Priorität | Feature | Beschreibung | Geschätzte Zeit | Tag |
|-----------|---------|--------------|-----------------|-----|
| **MITTEL** | **Projekt bearbeiten** | Edit Funktionalität für eigene Projekte | **1-2h** | **5** |
| **NIEDRIG** | **Styling verbessern** | bessere UX, responsive Design | **1-2h** | **6** |
| **OPTIONAL** | **React.js Migration** | Frontend auf React umstellen | **8-12h** | - |


#### Tag 5 - 8h
- Projekt bearbeiten (1-2h)
- CSS Styling verbessern (1-2h)

#### Tag 6 (letzter Tag) - 8h
- React Umstellung (8-12h)
- Word Dokument anfertigen und hochladen
- Finale Tests & Dokumentation (1-2h)


## Datenbank-Schema

### Datenbanken:

| Name | Beschreibung | Status |
|---|---|---|
| `a_projects` | Projekt-Eigenschaften | IN VERWENDUNG |
| `a_comments` | Kommentar-Eigenschaften | IN VERWENDUNG |
| `b_proj_helper_user_rel` | Projekt-Helfer Beziehung | IN VERWENDUNG |

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

### Kommentare
- `POST /comment_list` - Kommentare eines Projektes abrufen
- `POST /new_comment` - Kommentar hinzufügen
- `POST /delete_comment` - Kommentar löschen

### Noch zu implementieren
- `POST /edit_project` - Projekt bearbeiten

## Installation & Start

```bash
# Dependencies installieren
npm install

# CouchDB muss laufen (Standard: localhost:5984)
# Credentials in server/datenbanken/credentials.json anpassen

# Server starten
npm run start
```