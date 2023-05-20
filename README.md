
#  Application de Chat

Cette application de chat est basée sur une architecture client-serveur utilisant React pour le côté client et Express avec Socket.io pour le côté serveur. Elle permet aux utilisateurs de communiquer en temps réel via des salons de discussion.

## Fonctionnalités
- Connexion en temps réel avec plusieurs utilisateurs.
- Envoi et réception de messages instantanés.
- Affichage en temps réel des utilisateurs connectés.

## Structure du projet
Le projet est structuré comme suit :

**server/** : Contient le code du serveur Express avec Socket.io.  
**client/** : Contient le code de l'application React pour le côté client.  
Le code source du serveur est principalement situé dans server/index.js, tandis que le code source du client se trouve dans /src.

## Technologies utilisées
- **React** : une bibliothèque JavaScript pour la construction d'interfaces utilisateur interactives.
- **Tailwind** : framework CSS utilitaire qui permet de concevoir rapidement des interfaces utilisateur
- **Express** : un framework Web pour Node.js.
- **Socket.io** : une bibliothèque JavaScript pour les communications en temps réel basées sur les WebSockets.

## Contributeurs
Corentin Deleuse - Auteur principal  
N'hésitez pas à ouvrir des issues ou à soumettre des pull requests pour améliorer cette application de chat.

## Licence
Ce projet est sous licence GNU 