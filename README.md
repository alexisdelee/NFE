### Routes pour les tickets

| Accès    | Méthode | Route                                       | Explication                                              |
|----------|---------|---------------------------------------------|----------------------------------------------------------|
| Agent    | GET     | /tickets/:ticketId([0-9]{1,20})             | Obtenir un ticket                                        |
| Operator | GET     | /tickets/:resource                          | Obtenir tous les tickets liés à une ressource            |
| Operator | GET     | /tickets/:resource/:resourceId([0-9]{1,20}) | Obtenir tous les tickets liés à une ressource spécifique |
| Operator | DELETE  | /tickets/:ticketId([0-9]{1,20})             | Supprimer un ticket                                      |

Toutes les ressources possibles : __region, color, tracker, priority, status, reporter, assignee__  

### Routes pour les régions

| Accès     | Méthode | Route                           | Explication                |
|-----------|---------|---------------------------------|----------------------------|
| Anonymous | GET     | /regions/:regionId([0-9]{1,20}) | Obtenir une région         |
| Anonymous | GET     | /regions                        | Obtenir toutes les régions |

### Routes pour les types de demandes

| Accès     | Méthode | Route                             | Explication                        |
|-----------|---------|-----------------------------------|------------------------------------|
| Anonymous | GET     | /trackers/:trackerId([0-9]{1,20}) | Obtenir une type de demande        |
| Anonymous | GET     | /trackers                         | Obtenir tous les types de demandes |

### Routes pour les priorités

| Accès     | Méthode | Route                                | Explication                  |
|-----------|---------|--------------------------------------|------------------------------|
| Anonymous | GET     | /priorities/:priorityId([0-9]{1,20}) | Obtenir une priorité         |
| Anonymous | GET     | /priorities                          | Obtenir toutes les priorités |

### Routes pour les status

| Accès     | Méthode | Route                          | Explication                |
|-----------|---------|--------------------------------|----------------------------|
| Anonymous | GET     | /status/:statusId([0-9]{1,20}) | Obtenir un statut          |
| Anonymous | GET     | /status                        | Obtenir toutes les statuts |

### Routes pour les catégories

| Accès     | Méthode | Route                                | Explication                   |
|-----------|---------|--------------------------------------|-------------------------------|
| Anonymous | GET     | /categories/:categoryId([0-9]{1,20}) | Obtenir une catégorie         |
| Anonymous | GET     | /categories                          | Obtenir toutes les catégories |

### Routes pour les liens

| Accès     | Méthode | Route                       | Explication                               |
|-----------|---------|-----------------------------|-------------------------------------------|
| Anonymous | GET     | /links/:linkId([0-9]{1,20}) | Obtenir un lien                           |
| Anonymous | GET     | /links                      | Obtenir tous les liens                    |
| Operator  | POST    | /links/:linkId([0-9]{1,20}) | Créer une relation entre deux tickets     |
| Operator  | DELETE  | /links/:linkId([0-9]{1,20}) | Supprimer une relation entre deux tickets |
