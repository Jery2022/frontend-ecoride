
# Image de base Node.js
FROM node:22.15.0-alpine3.21 AS node 

# Mettre à jour le système et installer les dépendances nécessaires
RUN apk update && apk add --no-cache bash

# Définir le répertoire de travail
WORKDIR /app-front

# Copier uniquement les fichiers nécessaires pour l'installation des dépendances
COPY package*.json  ./

# Donner des autorisations à la node l'utilisateur 
# RUN chown -R node:node node_modules

# Changer l'utilisateur pour éviter d'exécuter l'application en tant que root
# USER node

# Installer les dépendances en mode production
# RUN npm ci --production
RUN npm install --production
# RUN npm install 

# Copier le reste des fichiers de l'application 
COPY . .

# Exposer le port de l'application Node.js
EXPOSE 8000

# Commande par défaut pour démarrer l'application
CMD ["node", "index.js"] 