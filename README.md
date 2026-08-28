# piHome

`piHome` est un tableau de bord domestique construit avec **React**, **TypeScript** et **Vite**.  
L'application affiche en un coup d'oeil plusieurs informations utiles pour un usage mural ou sur écran d'accueil :

- l'heure et la date du jour
- la météo actuelle et les prévisions sur plusieurs jours
- les prochains passages de métro / RER à Bagneux
- des mesures simulées de capteurs intérieurs comme l'humidité, le CO2 et la température
- un fond visuel aléatoire basé sur une collection de peintures

Le projet mélange des données en temps réel et des données simulées pour proposer une interface simple, lisible et agréable à afficher en continu.

## Fonctionnalités

- **Horloge locale** avec affichage de la ville et de la date en français
- **Météo en temps réel** via l'API Open-Meteo
- **Horaires de train** via l'API Île-de-France Mobilités
- **Capteurs simulés** pour représenter un environnement intérieur
- **Fond d'écran artistique** tiré aléatoirement d'une galerie intégrée
- **Adaptation visuelle** du texte selon la luminosité du fond

## Prérequis

- Node.js 18 ou plus récent
- npm
- une clé API Île-de-France Mobilités si tu veux afficher les horaires de train

## Installation

1. Clone le dépôt si besoin.
2. Installe les dépendances :

```bash
npm install
```

3. Crée un fichier `.env` à la racine du projet.

Tu peux partir de `.env.example` :

```bash
VITE_IDFM_API_KEY=ta_cle_api_idfm
```

## Lancer le projet

### Mode développement

```bash
npm run dev
```

Puis ouvre l'adresse affichée par Vite, généralement :

```bash
http://localhost:5173
```

### Build de production

```bash
npm run build
```

### Prévisualisation du build

```bash
npm run preview
```

### Vérification du code

```bash
npm run lint
```

## Structure du projet

- `src/App.tsx` : composition principale du dashboard
- `src/components/Clock` : affichage de l'heure et de la date
- `src/components/Weather` : météo actuelle et prévisions
- `src/components/Metro` : prochains trains à Bagneux
- `src/mockSensor.ts` : génération des données de capteurs simulées
- `src/paintings.ts` : liste des fonds d'écran artistiques
- `src/themes.ts` : thèmes de couleurs utilisés pour le texte

## Données et API

- **Météo** : [Open-Meteo](https://open-meteo.com/)
- **Horaires de train** : API Île-de-France Mobilités

## Remarque

Les données de capteurs sont simulées dans l'état actuel du projet.  
L'interface est donc prête à être reliée plus tard à de vrais capteurs ou à une source domotique.

This branch is a small smoke test for automatic pull request review.
