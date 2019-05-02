### Routes pour les tickets

| Accès    | Méthode | Route                                       | Explication                                              |
|----------|---------|---------------------------------------------|----------------------------------------------------------|
| Agent    | GET     | /tickets/:ticketId([0-9]{1,20})             | Obtenir un ticket                                        |
| Operator | GET     | /tickets/:resource                          | Obtenir tous les tickets liés à une ressource            |
| Operator | GET     | /tickets/:resource/:resourceId([0-9]{1,20}) | Obtenir tous les tickets liés à une ressource spécifique |
| Operator | DELETE  | /tickets/:ticketId([0-9]{1,20})             | Supprimer un ticket                                      |

Toutes les ressources possibles : __region, color, tracker, priority, status, reporter, assignee__  
