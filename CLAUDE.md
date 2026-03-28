# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projekt

Kanban-Board Todo-App (Aufgaben, Personen, Projekte) – reines Node.js ohne externe Dependencies.

## Starten

```bash
node server.js
```

Server läuft auf `localhost:3000`. Alternativ `ToDo.command` per Doppelklick (macOS: startet Server + öffnet Browser).

## Architektur

- **server.js**: HTTP-Server (native `http`-Library), serviert statische Dateien und eine REST-API (`GET/PUT /api/data`). Liest/schreibt den gesamten App-Zustand als einzelnes JSON.
- **index.html**: Frontend mit eingebettetem Vanilla JavaScript – gesamte UI-Logik (Rendering, Drag & Drop, Modals, Filter) ist inline im HTML.
- **style.css**: Styling mit CSS Custom Properties für 5 Themes (default, ocean, forest, sunset, pastel).
- **todo.json**: Flat-File-Datenbank mit Struktur `{ persons[], projects[], tasks[], settings{} }`. Wird bei jedem Save komplett überschrieben.

## Datenfluss

Das Frontend lädt den kompletten Zustand via `GET /api/data`, arbeitet clientseitig darauf und schreibt den gesamten Zustand via `PUT /api/data` zurück. Es gibt keine granularen Endpunkte – immer wird das gesamte JSON gelesen/geschrieben.

## Wichtige Hinweise

- Kein package.json, kein Build-Prozess, kein Linting, keine Tests.
- Port 3000 ist in `server.js` hardcodiert.
- CORS ist für alle Origins aktiviert.
- Path-Traversal-Schutz in `server.js` vorhanden – nur Dateien im Projektverzeichnis werden serviert.
