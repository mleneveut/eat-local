eat-local
=========

Trouvez les producteurs près de chez vous


## Installation

### MongoDB

La base de donnée utilisée est MongoDB v2.6+
Pour l'installer, [reportez-vous à la documentation](http://docs.mongodb.org/manual/installation/)

### NodeJs

Pour installer l'application NodeJs, commencez par récupérer les dépendences du projet

```
$> cd <path_to_eat_local_folder>
$> npm install
```

Pour lancer l'application, lancez la commande suivante :

```
$> coffee app.coffee -l
```

L'option -l est utilisée pour indiquer à Node d'utiliser la configuration local, c'est à dire essentiellement de se
connecter à la base de donnée locale (127.0.0.1)

La page est alors accessible à l'URL [http://localhost:3000](http://localhost:3000)


## Description

La stack technique utilisée est la suivante :
- NodeJs (v10.28+)
- AngularJS (v1.2+)
- Bootstrap (v3+)

La partie serveur est développée en Coffee Script.

Le serveur NodeJs permet également de servir la partie cliente (Angular)


## APIs

### REST API
- **(GET) /api/types** : Retourne la liste des types existants
- **(GET) /api/categories** : Retourne la liste des catégories existants
- **(GET) /api/days** : Retourne la liste des jours d'ouverture existants
- **(POST) /api/search** : Retourne un tableau de POI (points of interest), filtré par un object JSON passé en paramètre.
L'objet JSON en paramètre peut etre :
 - soit de la forme du modèle (voir _model/poi.coffee_)
 
```
{
    "type": 'Producer', // Search with exact value
    "nom": /partial/i // Search with 'LIKE'-style value
}
```
 
 - soit un objet _geo_ permettant de trouver les POIs proche d'un point géographique

```
{
    geo: {
        lng: <longitude>,
        lat: <latitude>,
        dist: <distance in meters>
    }
}
```

### Misc API
- **(POST) /import/full** : Importe tous les fichiers de donnée du répertoire _data_ dans la base MongoDB. Supprime les anciennes entrées
- **(POST) /import/json** : Importe un fichier JSON dans la base MongoDB. Pour le format attendu, voir _data/*.json_
- **(POST) /import/kml** : Importe un fichier KML dans la base MongoDB. Pour le format attendu, voir _data/*.kml_
- **(POST) /import/gpx** : Importe un fichier GPX dans la base MongoDB. Pour le format attendu, voir _data/*.gpx_