# Stage 1: Build
FROM node:20-alpine AS build

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances en ignorant les conflits de peer dependencies
RUN npm install --legacy-peer-deps

# Copier le reste du code de l'application
COPY . .

# Exécuter la commande d'export Expo pour générer la version web (dossier 'dist')
RUN npx expo export -p web

# Stage 2: Serve
FROM nginx:alpine

# Copier les fichiers statiques générés (du stage de build) vers le dossier public de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exposer le port 80 pour rendre l'application accessible
EXPOSE 80

# La commande de démarrage par défaut de l'image nginx:alpine lance déjà Nginx
