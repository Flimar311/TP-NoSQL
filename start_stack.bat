@echo off
chcp 437 >nul
Setlocal EnableDelayedExpansion

set COMPOSE_FILE=./docker-compose.yml

set BACKEND_PORT=3000
set FRONTEND_PORT=8080
set MONGO_PORT=27000
set MONGO_EXPRESS_PORT=8081
set MONGO_USERNAME=admin
set MONGO_PASSWORD=sg4s09Z3BlHr

echo Stopping any running containers...
docker compose -f %COMPOSE_FILE% down

echo Starting Docker containers...
docker compose -f %COMPOSE_FILE% up -d

cls

echo ---------------------------------------
echo         Mateo BENTOGLIO - NoSQL        
echo ---------------------------------------
echo.
echo - Backend - Express.js : http://localhost:%BACKEND_PORT%
echo - Frontend - Next.js : http://localhost:%FRONTEND_PORT%
echo - MongoDB : localhost:%MONGO_PORT%
echo - Mongo Express : http://localhost:%MONGO_EXPRESS_PORT%
echo.
echo ----------------------------------------
echo  Appuyez sur une touche pour arrêter...
echo ----------------------------------------
pause >nul

docker compose -f %COMPOSE_FILE% down
echo Containers stopped. Goodbye!
pause
