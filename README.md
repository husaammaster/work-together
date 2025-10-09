# Project Work Together

Projekt für ein Zusammenarbeit und gegenseitige Hilfe.

## Idee

Ebay Kleinanzeigen, aber statt Objekte, werden hier Projekte angelgt und abgearbeitet.

Accounts können Projekte erzeugen, Projekte browsen und zu Projekten als Helfer beitreten.
Projekte haben eine Teilnehmerzahl, Teilnehmerlisten und eine Liste an gebrauchten Gegenständen.
Zusätzlich haben Projekte eine Liste an Kommentaren.
Jeder Kommentar hat einen Absender, einen Timestamp und einen Text und ist einem Projekt zugeordnet.

## Tech-Stack
chalk zum leichteren debugging
couchDB zum speichern der verschiedenen Datenbanken (User, Projekte, Kommentare)
express.js als Webserver
nano als couchDB-Client
erstmal vanilla js als Frontend, danach React.js falls genug Zeit da ist

## To-Do:
- [ ] User-Datenbank
- [ ] Projekt-Datenbank
- [ ] Kommentar-Datenbank
- [ ] Webserver
- [ ] Frontend was im Header den Username anzeigt (als Input)
- [ ] Frontend zur Darstellung eines einzelnen Projektes 
- [ ] Frontend zur Darstellung einer Liste von Projekten
- [ ] Frontend zur Darstellung einer Liste von Kommentaren innerhalb der Projekte
- [ ] Frontend zur Darstellung einer Liste von Helfern innerhalb der Projekte

## Zukunft