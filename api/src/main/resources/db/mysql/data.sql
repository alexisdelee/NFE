insert into role (ro_id, ro_shortname) values
(1, 'agent'),
(2, 'operator'),
(3, 'administrator'),
(4, 'system');

insert into entity (en_id, en_label) values
(1, '/categories'),
(2, '/links'),
(3, '/priorities'),
(4, '/regions'),
(5, '/status'),
(6, '/tickets'),
(7, '/trackers'),
(8, '/items'),
(9, '/users'),
(10, '/histories'),
(11, '/statistics');

insert into permission (pm_id, pm_create, pm_read, pm_update, pm_delete, pm_role, pm_entity) values
(1, false, true, false, false, 1, 1),
(2, false, true, false, false, 2, 1),
(3, true, true, true, true, 3, 1),
(4, false, true, false, false, 1, 2),
(5, false, true, false, false, 2, 2),
(6, true, true, true, true, 3, 2),
(7, false, true, false, false, 1, 3),
(8, false, true, false, false, 2, 3),
(9, true, true, true, true, 3, 3),
(10, false, true, false, false, 1, 4),
(11, false, true, false, false, 2, 4),
(12, true, true, true, true, 3, 4),
(13, false, true, false, false, 1, 5),
(14, false, true, false, false, 2, 5),
(15, true, true, true, true, 3, 5),
(16, false, true, true, false, 1, 6),
(17, true, true, true, true, 2, 6),
(18, true, true, true, true, 3, 6),
(19, false, true, false, false, 1, 7),
(20, false, true, false, false, 2, 7),
(21, true, true, true, true, 3, 7),
(22, false, true, false, false, 1, 8),
(23, false, true, false, false, 2, 8),
(24, true, true, true, true, 3, 8),
(25, false, true, false, false, 1, 9),
(26, false, true, false, false, 2, 9),
(27, true, true, true, true, 3, 9),
(28, false, false, false, false, 1, 10),
(29, false, true, false, false, 2, 10),
(30, false, true, false, false, 3, 10),
(31, false, false, false, false, 1, 11),
(32, false, true, false, false, 2, 11),
(33, false, true, false, false, 3, 11);

insert into `user` (usr_id, usr_pseudo, usr_nfeid, usr_password, usr_salt, usr_iterations, usr_avatar, usr_role, usr_deleted, usr_created, usr_updated) values
(1, 'agent', '2D2uipCu4LjsnJcby5', '297ce977e9c8c9817867b08949fab790ad4de6102585972eb863eda3f7e1be303dd914cb91856ad1d32bc688ea2204fad0dd64a6b3a8a7950975f3a1cf9922e5', 'v7JuDezakPDtQR9CYPKh', 988, null, 1, 0, '2019-05-26 18:37:47', null),
(2, 'operator', 'NeomTOobTqomSvBQMc', '68fa83e9562dda42b096fbe54dc2d0d6b1baeedb9043537c392a7bcdfe8bc2047c0936dae80a7e0deb59bdb3bf5767c9bf9dba0bbe21634e3ae6e9c163364393', '88AGTWYpcjbqP93cXK80', 662, null, 2, 0, '2019-05-26 18:37:47', null),
(3, 'administrator', 'wDyREtGfi5FyIsOV2C', '05c14bcb4128ac182b445c4d8a32e00a4f39ff1e5421d2ecb39163bcb2d3dba664bfab04cc2829b7dcdd673d16eed9fca5db9c54163b8c7b0ba5713d9836ebd0', '39AcoGxf0sLORFbCy2tV', 340, null, 3, 0, '2019-05-26 18:37:47', null),
(4, 'test', '000000000000000000', '05c14bcb4128ac182b445c4d8a32e00a4f39ff1e5421d2ecb39163bcb2d3dba664bfab04cc2829b7dcdd673d16eed9fca5db9c54163b8c7b0ba5713d9836ebd0', '39AcoGxf0sLORFbCy2tV', 340, null, 3, 0, '2019-05-26 18:37:47', null),
(5, 'system', '??????????????????', '????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????', '????????????????????????????????', 0, NULL, 4, 0, '2019-07-21 23:01:55', '2019-07-21 23:02:40');

insert into region (rg_id, rg_postal, rg_capital, rg_name) values
(1, '01', '97105', 'Guadeloupe'),
(2, '02', '97209', 'Martinique'),
(3, '03', '97302', 'Guyane'),
(4, '04', '97411', 'La Réunion'),
(5, '06', '97608', 'Mayotte'),
(6, '11', '75056', 'Ile-de-France'),
(7, '24', '45234', 'Centre-Val de Loire'),
(8, '27', '21231', 'Bourgogne-Franche-Compté'),
(9, '28', '76540', 'Normandie'),
(10, '32', '59350', 'Nord-Pas-de-Calais-Picardie'),
(11, '44', '67482', 'Alsace-Champagne-Ardenne-Lorraine'),
(12, '52', '44109', 'Pays de la Loire'),
(13, '53', '35238', 'Bretagne'),
(14, '75', '33063', 'Aquitaine-Limousin-Poitou-Charentes'),
(15, '76', '31555', 'Languedoc-Roussillon-Midi-Pyrénées'),
(16, '84', '69123', 'Auvergne-Rhônes-Alpes'),
(17, '93', '13055', 'Provence-Alpes-Côtes d\'Azur'),
(18, '94', '2A004', 'Corse');

insert into tracker (tr_id, tr_name, tr_shortname, tr_description) values
(1, 'Incident', 'incident', 'Problème altérant ou compromettant les infrastructures'),
(2, 'Analyse', 'defect', 'Tâche pour analyser techniquement un sujet'),
(3, 'Intervention', 'intervention', 'Demande d\'intervention sur le terrain'),
(4, 'Congé maladie', 'sickness_leave', 'Demande de congés maladies'),
(5, 'Congé payé', 'paid_leave', 'Demande de congés payés');

insert into priority (pr_id, pr_name, pr_shortname, pr_description) values
(1, 'Simple', 'trivial', 'Problème d\'ordre cosmétique, comme une faute d\'orthographe ou du texte mal aligné'),
(2, 'Mineur', 'minor', 'Perte de fonctionnalité mineure, ou autre problème pouvant être contourné facilement'),
(3, 'Important', 'major', 'Perte de fonctionnalité importante'),
(4, 'Critique', 'critical', 'Plantage, perte de mémoire ou fuite de mémoire grave'),
(5, 'Blocage', 'blocker', 'Bloque le fonctionnement et/ou le travail de test, de telle sorte que la production n\'a pu s\'exécuter');

insert into category (ca_id, ca_name, ca_shortname) values
(1, 'New', 'new'),
(2, 'In progress', 'wip'),
(3, 'Complete', 'done'),
(4, 'Résolution', 'solution');

insert into `status` (st_id, st_name, st_shortname, st_description, st_category) values
(1, 'Ouvert', 'open', 'La demande est ouverte et prête à être traitée par l\'attribution', 1),
(2, 'Rouvert', 'reopen', 'Cette demande a été traitée, et a été rouverte car elle ne correspondait pas avec les spécifications initiales', 1),
(3, 'A faire', 'do', 'Cette demande va être réalisée prochainement', 1),
(4, 'A détailler', 'detail', 'Ticket créer qui doit être complété pour être parfaitement traité', 1),
(5, 'Attribué', 'assigned', 'Affecté par un responsable, ou bien travail déjà amorcé par la personne', 1),
(6, 'En cours de traitement', 'being', 'Cette demande est actuellement en cours de traitement par la personne attribuée', 2),
(7, 'Selected for intervention', 'selected_for_intervention', null, 2),
(8, 'En attente du client', 'waiting_client', null, 2),
(9, 'En attente du rendez-vous', 'waiting_appointment', 'En attente du rendez-vous pour solutionner le problème', 2),
(10, 'En attente', 'waiting', null, 2),
(11, 'À facturer', 'billing', null, 2),
(12, 'À documenter', 'document', null, 2),
(13, 'À tester', 'test', null, 2),
(14, 'En test', 'in_test', null, 2),
(15, 'En validation', 'in_validation', 'Cette demande est en cours de validation par l\'équipe opérateur', 2),
(16, 'Résolu', 'resolved', 'Un traitement a été effectué et est en attente de vérification par le rapporteur. La demande peut ensuite être marquée comme rouverte ou comme fermée', 3),
(17, 'Fermé', 'closed', 'Cette demande a été résolue, répond aux spécifications initiales, et est considérée comme finie', 3),
(18, 'Fini', 'finish', null, 3),
(19, 'Corrigé', 'corrected', 'L\'arborescence contient une correction cochée qui a été testée', 4),
(20, 'Aucune intervention envisagée', 'no_intervention_planned', 'La demande décrite ne nécessite pas une intervention', 4),
(21, 'Doublon', 'duplicate', 'Le problème est un doublon d\'une demande existente', 4),
(22, 'Incomplet', 'incomplete', 'Le problème n\'est pas décrit correctement', 4),
(23, 'Impossible à reproduire', 'no_reproduce', 'Toutes les tentatives de reproduction de cette demande ont échoué, ou il n\'y a pas suffisamment d\'informations pour reproduire la demande. En lisant le code, aucun indice sur la cause de ce comportement n\'apparaît. Si d\'autres informations apparaissent ultérieurement, veuillez rouvrir la demande', 4),
(24, 'Fini', 'over', null, 4);

insert into link (lk_id, lk_referent_description, lk_reference_description) values
(1, 'lié à', 'lié à'),
(2, 'duplique', 'dupliqué par'),
(3, 'bloque', 'bloqué par'),
(4, 'précède', 'suit'),
(5, 'copier vers', 'copier depuis'),
(6, 'tâche parente', 'sous-tâche');

insert into universal (ul_id, ul_category, ul_label, ul_default_value) values
(1, 'input', 'checkbox', '0'),
(2, 'input', 'time', ''),
(3, 'input', 'date', ''),
(4, 'input', 'week', ''),
(5, 'input', 'month', ''),
(6, 'input', 'email', ''),
(7, 'input', 'file', ''),
(8, 'input', 'number', '0'),
(9, 'input', 'tel', ''),
(10, 'input', 'text', ''),
(11, 'textarea', null, ''),
(12, 'map', null, null);

insert into item (it_id, it_label, it_readonly, it_required, it_sort, it_tracker, it_universal) values
(1, 'Dégradations visibles', 0, 0, 1, 1, 11),
(2, 'Nom du client', 1, 1, 2, 1, 10),
(3, 'Numéro de téléphone', 1, 1, 3, 1, 9),
(4, 'Localisation', 1, 1, 4, 1, 12),
(5, 'Mail de contact', 1, 1, 4, 1, 6),
(6, 'Matériels nécessaires', 0, 0, 3, 3, 11),
(7, 'Pointage arrivée', 0, 0, 1, 3, 12),
(8, 'Pointage départ', 0, 0, 2, 3, 12),
(9, 'Date de départ', 0, 1, 1, 4, 3),
(10, 'Date de retour', 0, 1, 2, 4, 3),
(11, 'Document(s)', 0, 0, 3, 4, 7),
(12, 'Date de départ', 0, 1, 1, 5, 3),
(13, 'Date de retour', 0, 1, 2, 5, 3),
(14, 'Document(s)', 0, 0, 3, 5, 7);

insert into item_option (it_op_id, it_op_label, it_op_value, it_op_item) values
(1, 'pattern', '0[1-6][0-9]{8}', 9);
