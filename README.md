# RAPPEL COMMANDES GIT POUR LA MISE EN PLACE DE MON PROJET

echo "# front-ecoride" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/Jery2022/front-ecoride.git
git push -u origin main

# INITIALISATION DU PROJET FRONTEND ECORIDE

1. Installer Node.js
Avant tout, assurez-vous d'avoir installé Node.js sur votre machine. Vous pouvez le télécharger sur nodejs.org. Une fois installé, vous aurez également accès à npm (Node Package Manager), qui est utile pour gérer les dépendances.

2. Initialiser votre projet
Créez un nouveau dossier pour votre projet. Ensuite, ouvrez un terminal dans ce dossier et exécutez la commande suivante pour initialiser un projet Node.js : npm init -y

3. Installer Express.js
Express.js est un framework web basé sur Node.js. Installez-le avec la commande suivante : npm install express

4. Créer un fichier serveur
Créez un fichier principal (index.js) dans votre dossier de projet.  

5. Exécuter le serveur
Pour démarrer votre serveur, exécutez la commande suivante dans votre terminal : node server.js

6. Ajouter des fonctionnalités
A présent ajoutons des routes pour gérer des requêtes GET et POST et, intégrons nos bases de données. 


# COMMENT REINSTALLER MON APPLICATION SUR VOTRE MACHINE
1. Récupere le projet en clonant mon dépot GIT :
Depuis votre terminal ou bash éxécuter la commande : git clone https://github.com/Jery2022/frontend-ecoride.git

2. Vérifier la présence du fichier package.json
Le fichier package.json contient la liste des dépendances de mon projet, il inclu une section "dependencies" et "devDependencies".

3. Installer toutes les dépendances
Vous pouvez installer toutes les dépendances listées en une seule commande : npm install
Cela installera toutes les dépendances dans le dossier node_modules.

4. Installer une nouvelle dépendance
Si vous voulez ajouter une dépendance spécifique, utilisez cette commande : npm install nom_du_paquet

5. Vérifier et mettre à jour les dépendances
Vous pouvez afficher la liste des dépendances installées avec : npm list
Et pour mettre à jour toutes les dépendances : npm update

6. Supprimer une dépendance
Si vous devez supprimer une dépendance inutilisée, utilisez : npm uninstall nom_du_paquet


# COMMENT RECUPERER MES CONTENEURS SUR DOCKER HUB

Aller sur votre navigateur préféré et taper la ligne :

https://hub.docker.com/repositories/jery241


# COMMENT ACCEDER A MON FRONTEND EN LIGNE

Aller sur votre navigateur préféré et taper la ligne :

https://frontend-ecoride.fly.dev/ 


Merci.
