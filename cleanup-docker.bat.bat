@echo off
echo ==========================
echo Nettoyage complet de Docker
echo ==========================

REM Stop all running containers
echo Arrêt de tous les conteneurs en cours d'exécution...
docker stop $(docker ps -q)

REM Remove all containers
echo Suppression de tous les conteneurs...
docker rm $(docker ps -aq)

REM Remove all images
echo Suppression de toutes les images...
docker rmi $(docker images -q) --force

REM Remove all volumes
echo Suppression de tous les volumes...
docker volume rm $(docker volume ls -q)

REM Remove unused data
echo Suppression des données inutilisées...
docker system prune -a --volumes -f

echo ==========================
echo Nettoyage complet terminé.
echo ==========================
pause
