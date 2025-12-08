# Schoolsystem2 – Full Stack (Backend & Frontend)

This repo contains the Java backend and a Vite-based frontend. Follow the steps below to set up everything from scratch.

## Prerequisites
- **Java JDK 21** (e.g., Temurin 21). The Gradle build uses a Java 21 toolchain.
- **Node.js + npm** (recommend Node 20+ LTS) for the frontend.
- Git, PowerShell (on Windows), or a POSIX shell.

## Quick Start
1. Clone the repo and open a terminal in `Schoolsystem2/`.
2. **Backend install & verify**
   - `cd backend`
   - Windows: `.\gradlew.bat test`  
     macOS/Linux: `./gradlew test`
3. **Run backend dev server**
   - Windows: `.\gradlew.bat run`  
     macOS/Linux: `./gradlew run`
   - Endpoints: `http://localhost:8080/health`, `http://localhost:8080/api/v1/tags`
4. **Frontend install**
   - `cd ../frontend`
   - `npm install`
5. **Run frontend dev server**
   - `npm run dev` (Vite default port is 5173)

## Useful Commands
- Backend tests: `cd backend && ./gradlew test`
- Backend build: `cd backend && ./gradlew build`
- Frontend build: `cd frontend && npm run build`
- Frontend preview: `cd frontend && npm run preview`
- Start both (Windows helper): run `.\start-dev.ps1` from repo root (starts backend then frontend).

## Notes
- `:backend:run` is not needed; `backend` is already the root Gradle project.
- Ensure port 8080 (backend) and 5173 (frontend dev) are free before starting.
