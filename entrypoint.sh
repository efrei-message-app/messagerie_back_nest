#!/bin/sh
# Attendre que la BDD soit dispo (optionnel, mais recommandé pour Docker Compose)
# npx prisma migrate deploy
# Ou, pour dev :
npx prisma migrate dev --name init

# Démarrer l’app NestJS
node dist/main
