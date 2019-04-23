drop database if exists nfe;
create database nfe
    default character set "utf8"
    default collate "utf8_general_ci";

use nfe;

source kernel/layers.sql;
source kernel/functions.sql;
source kernel/procs.sql;
source kernel/triggers.sql;

-- Data

call create_region ("01", "97105", "Guadeloupe");
call create_region ("02", "97209", "Martinique");
call create_region ("03", "97302", "Guyane");
call create_region ("04", "97411", "La Réunion");
call create_region ("06", "97608", "Mayotte");
call create_region ("11", "75056", "Ile-de-France");
call create_region ("24", "45234", "Centre-Val de Loire");
call create_region ("27", "21231", "Bourgogne-Franche-Compté");
call create_region ("28", "76540", "Normandie");
call create_region ("32", "59350", "Nord-Pas-de-Calais-Picardie");
call create_region ("44", "67482", "Alsace-Champagne-Ardenne-Lorraine");
call create_region ("52", "44109", "Pays de la Loire");
call create_region ("53", "35238", "Bretagne");
call create_region ("75", "33063", "Aquitaine-Limousin-Poitou-Charentes");
call create_region ("76", "31555", "Languedoc-Roussillon-Midi-Pyrénées");
call create_region ("84", "69123", "Auvergne-Rhônes-Alpes");
call create_region ("93", "13055", "Provence-Alpes-Côtes d'Azur");
call create_region ("94", "2A004", "Corse");

call create_role ("anonymous");
call create_role ("agent");
call create_role ("operator");
call create_role ("administrator");
call create_role ("root");

call internal_create_link ("lié à", "lié à");
call internal_create_link ("duplique", "dupliqué par");
call internal_create_link ("bloque", "bloqué par");
call internal_create_link ("précède", "suit");
call internal_create_link ("copier vers", "copier depuis");
call internal_create_link ("tâche parente", "sous-tâche");

call internal_create_priority ("Simple", "trivial", "Problème d'ordre cosmétique, comme une faute d'orthographe ou du texte mal aligné", "/assets/icons/", "trivial.png");
call internal_create_priority ("Mineur", "minor", "Perte de fonctionnalité mineure, ou autre problème pouvant être contourné facilement", "/assets/icons/", "minor.png");
call internal_create_priority ("Important", "major", "Perte de fonctionnalité importante", "/assets/icons/", "major.png");
call internal_create_priority ("Critique", "critical", "Plantage, perte de mémoire ou fuite de mémoire grave", "/assets/icons/", "critical.png");
call internal_create_priority ("Blocage", "blocker", "Bloque le fonctionnement et/ou le travail de test, de telle sorte que la production n'a pu s'exécuter", "/assets/icons/", "blocker.png");

call internal_create_tracker ("Incident", "incident", "Problème altérant ou compromettant les infrastructures", "/assets/icons/", "bug.png");
call internal_create_tracker ("Analyse", "defect", "Tâche pour analyser techniquement un sujet", "/assets/icons/", "defect.png"); -- undefined.png
call internal_create_tracker ("Intervention", "intervention", "Demande d'intervention sur le terrain", "/assets/icons/", "improvement.png");
call internal_create_tracker ("Congé maladie", "sickness_leave", "Demande de congés maladies", "/assets/icons/", "sickness.png"); -- newfeature.png
call internal_create_tracker ("Congé payé", "paid_leave", "Demande de congés payés", "/assets/icons/", "paid.png"); -- story.png

call internal_create_category ("New", "new");
call internal_create_category ("In progress", "wip");
call internal_create_category ("Complete", "done");
call internal_create_category ("Résolution", "solution");

-- new

call internal_create_status ("Ouvert", "open", "La demande est ouverte et prête à être traitée par l'attribution", 1);
call internal_create_status ("Rouvert", "reopen", "Cette demande a été traitée, et a été rouverte car elle ne correspondait pas avec les spécifications initiales", 1);
call internal_create_status ("A faire", "do", "Cette demande va être réalisée prochainement", 1);
call internal_create_status ("A détailler", "detail", "Ticket créer qui doit être complété pour être parfaitement traité", 1);
call internal_create_status ("Attribué", "assigned", "Affecté par un responsable, ou bien travail déjà amorcé par la personne", 1);

-- wip

call internal_create_status ("En cours de traitement", "being", "Cette demande est actuellement en cours de traitement par la personne attribuée", 2);
call internal_create_status ("Selected for intervention", "selected_for_intervention", null, 2);
call internal_create_status ("En attente du client", "waiting_client", null, 2);
call internal_create_status ("En attente du rendez-vous", "waiting_appointment", "En attente du rendez-vous pour solutionner le problème", 2);
call internal_create_status ("En attente", "waiting", null, 2);
call internal_create_status ("À facturer", "billing", null, 2);
call internal_create_status ("À documenter", "document", null, 2);
call internal_create_status ("À tester", "test", null, 2);
call internal_create_status ("En test", "in_test", null, 2);
call internal_create_status ("En validation", "in_validation", "Cette demande est en cours de validation par l'équipe opérateur", 2);

-- done

call internal_create_status ("Résolu", "resolved", "Un traitement a été effectué et est en attente de vérification par le rapporteur. La demande peut ensuite être marquée comme rouverte ou comme fermée", 3);
call internal_create_status ("Fermé", "closed", "Cette demande a été résolue, répond aux spécifications initiales, et est considérée comme finie", 3);
call internal_create_status ("Fini", "finish", null, 3);

-- solution

call internal_create_status ("Corrigé", "corrected", "L'arborescence contient une correction cochée qui a été testée", 4);
call internal_create_status ("Aucune intervention envisagée", "no_intervention_planned", "La demande décrite ne nécessite pas une intervention", 4);
call internal_create_status ("Doublon", "duplicate", "Le problème est un doublon d'une demande existente", 4);
call internal_create_status ("Incomplet", "incomplete", "Le problème n'est pas décrit correctement", 4);
call internal_create_status ("Impossible à reproduire", "no_reproduce", "Toutes les tentatives de reproduction de cette demande ont échoué, ou il n'y a pas suffisamment d'informations pour reproduire la demande. En lisant le code, aucun indice sur la cause de ce comportement n'apparaît. Si d'autres informations apparaissent ultérieurement, veuillez rouvrir la demande", 4);
call internal_create_status ("Fini", "over", null, 4);

call internal_create_universal ("text");
call internal_create_universal ("select");

-- test

call create_user ("root", "Vm6MJXw6hc", "8b631b4d6bed1ce02f89d0afe7d5a1d86b2e7961fa18ba7bd55fe88a521eae02", "m7dPtXzSJsTuma4V24hA", 200, null, null, 5); -- 1secret,

call create_ticket (null, null, "abcdef", 1, 1, 2, null, 1);

call assign_user_to_ticket (1, 1);
call assign_commentary_to_ticket ("Ceci un commentaire", 1, 1);
call assign_tag_to_ticket ("wifi", false, 1, 1);

call create_ticket (null, null, "abcdef", 1, 1, 2, null, 1);

call assign_link_to_ticket (2, 1, 2);

call assign_item_to_category ("Assigné à", "select it_dt_value from item_data where it_dt_ticket = £item_id and it_dt_ticket = £ticket_id", "replace into item_data (it_dt_value, it_dt_item, it_dt_ticket) values (£ticket_id, £item_id, £ticket_id)", 1, 1);
call assign_item_to_category ("Collègues", "select it_dt_value from item_data where it_dt_ticket = £item_id and it_dt_ticket = £ticket_id", "replace into item_data (it_dt_value, it_dt_item, it_dt_ticket) values ('ok', £item_id, £ticket_id), ('nok', £item_id, £ticket_id)", 1, 2);
