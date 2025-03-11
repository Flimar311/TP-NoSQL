@echo off
chcp 437 >nul
Setlocal EnableDelayedExpansion

echo Arrêt de tous les containers en cours...
for /f "tokens=*" %%i in ('docker container ls -q') do docker container stop %%i

echo Suppression de tous les containers...
for /f "tokens=*" %%i in ('docker container ls -aq') do docker container rm %%i

echo Suppression de toutes les images...
for /f "tokens=*" %%i in ('docker image ls -q') do docker image rm -f %%i

echo Nettoyage des volumes non utilisés...
docker volume prune -f

echo Nettoyage des réseaux non utilisés...
docker network prune -f

echo Nettoyage complet de Docker terminé.
pause
