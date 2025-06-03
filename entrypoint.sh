#!/bin/sh
npx prisma migrate dev --name init
node dist/main
