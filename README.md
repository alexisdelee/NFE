### Routes pour les tickets

| Accès   | Méthode | Route                           | Explication                                              |
|---------|---------|---------------------------------|----------------------------------------------------------|
| private | GET     | /tickets/:ticketId([0-9]{1,20}) | Obtenir un ticket                                        |
| private | GET     | /tickets/:resource              | Obtenir tous les tickets liés à une ressource            |
| private | GET     | /tickets/:resource/:resourceId  | Obtenir tous les tickets liés à une ressource spécifique |
