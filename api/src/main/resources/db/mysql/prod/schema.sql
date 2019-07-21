create database if not exists heroku_118d1507b05d9b2;

alter database heroku_118d1507b05d9b2
  default character set utf8
  default collate utf8_general_ci;

-- grant all privileges on heroku_118d1507b05d9b2.* to pc@eu-cdbr-west-02.cleardb.net identified by 'pc';

use heroku_118d1507b05d9b2;

create table if not exists resource (
    re_id int unsigned primary key auto_increment,
    re_folder varchar(255) not null,
    re_filename varchar(255) not null,
    re_created datetime default current_timestamp,
    re_updated datetime on update current_timestamp,
    unique (re_folder, re_filename)
)
engine=InnoDB
default charset="utf8" collate="utf8_general_ci"
row_format=compressed;

create table if not exists role (
    ro_id int unsigned primary key auto_increment,
    ro_shortname varchar(25) not null,
    unique (ro_shortname)
)
engine=InnoDB
default charset="utf8" collate="utf8_general_ci"
row_format=compressed;

create table if not exists entity (
    en_id int unsigned primary key auto_increment,
    en_label varchar(255) not null,
    unique (en_label)
)
engine=InnoDB
default charset="utf8" collate="utf8_general_ci"
row_format=compressed;

create table if not exists permission (
    pm_id int unsigned primary key auto_increment,
    pm_create boolean not null default false,
    pm_read boolean not null default false,
    pm_update boolean not null default false,
    pm_delete boolean not null default false,
    pm_role int unsigned not null,
    pm_entity int unsigned not null,
    -- unique (pm_role, pm_permission),
    constraint permission_role_key
        foreign key (pm_role)
        references role(ro_id),
    constraint permission_entity_key
        foreign key (pm_entity)
        references entity(en_id)
)
engine=InnoDB
default charset="utf8" collate="utf8_general_ci"
row_format=compressed;

create table if not exists user (
    usr_id int unsigned primary key auto_increment,
    usr_pseudo varchar(100) not null,
    usr_nfeid char(18) not null,
    usr_password char(128), -- sha512 or null for no password
    usr_salt char(32), -- 128 bits @random
    usr_iterations int not null, -- for hmac
    usr_avatar int unsigned,
    usr_role int unsigned not null,
    usr_deleted boolean not null default false,
    usr_created datetime default current_timestamp,
    usr_updated datetime on update current_timestamp,
    unique (usr_pseudo, usr_nfeid),
    constraint user_avatar_key
        foreign key (usr_avatar)
        references resource(re_id),
    constraint user_role_key
        foreign key (usr_role)
        references role(ro_id)
)
engine=InnoDB
default charset="utf8" collate="utf8_general_ci"
row_format=compressed;

create table if not exists region (
    rg_id int unsigned primary key auto_increment,
    rg_postal char(2) not null,
    rg_capital char(5) not null,
    rg_name varchar(255) not null,
    unique (rg_postal),
    unique (rg_name)
)
engine=InnoDB
default charset="utf8" collate="utf8_general_ci"
row_format=compressed;

create table if not exists tracker (
    tr_id int unsigned primary key auto_increment,
    tr_name varchar(100) not null,
    tr_shortname varchar(25) not null,
    tr_description text,
    unique (tr_shortname)
)
engine=InnoDB
default charset="utf8" collate="utf8_general_ci"
row_format=compressed;

create table if not exists priority (
    pr_id int unsigned primary key auto_increment,
    pr_name varchar(100) not null,
    pr_shortname varchar(25) not null,
    pr_description text,
    unique (pr_shortname)
)
engine=InnoDB
default charset="utf8" collate="utf8_general_ci"
row_format=compressed;

create table if not exists category (
    ca_id int unsigned primary key auto_increment,
    ca_name varchar(100) not null,
    ca_shortname varchar(25) not null,
    unique (ca_shortname)
)
engine=InnoDB
default charset="utf8" collate="utf8_general_ci"
row_format=compressed;

create table if not exists status (
    st_id int unsigned primary key auto_increment,
    st_name varchar(100) not null,
    st_shortname varchar(25) not null,
    st_description text,
    st_category int unsigned not null,
    unique (st_shortname, st_category),
    constraint status_category_key
        foreign key (st_category)
        references category(ca_id)
)
engine=InnoDB
default charset="utf8" collate="utf8_general_ci"
row_format=compressed;

create table if not exists ticket (
    tk_id int unsigned primary key auto_increment,
    tk_region int unsigned not null,
    tk_summary varchar(255) not null,
    tk_description blob,
    tk_tracker int unsigned not null,
    tk_priority int unsigned not null,
    tk_status int unsigned not null,
    tk_reporter int unsigned not null,
    tk_deleted boolean not null default false,
    tk_archived boolean not null default false,
    tk_created datetime default current_timestamp,
    tk_updated datetime on update current_timestamp,
    constraint ticket_region_key
        foreign key (tk_region)
        references region(rg_id),
    constraint ticket_tracker_key
        foreign key (tk_tracker)
        references tracker(tr_id),
    constraint ticket_priority_key
        foreign key (tk_priority)
        references priority(pr_id),
    constraint ticket_status_key
        foreign key (tk_status)
        references status(st_id),
    constraint ticket_reporter_key
        foreign key (tk_reporter)
        references user(usr_id)
)
engine=InnoDB
default charset="utf8" collate="utf8_general_ci"
row_format=compressed;

create table if not exists assignee (
    ag_id int unsigned primary key auto_increment,
    ag_user int unsigned not null,
    ag_ticket int unsigned not null,
    constraint assignee_user_key
        foreign key (ag_user)
        references user(usr_id),
    constraint assignee_ticket_key
        foreign key (ag_ticket)
        references ticket(tk_id)
)
engine=InnoDB
default charset="utf8" collate="utf8_general_ci"
row_format=compressed;

-- Issue linking

create table if not exists link (
    lk_id int unsigned primary key auto_increment,
    lk_referent_description varchar(255) not null,
    lk_reference_description varchar(255) not null
)
engine=InnoDB
default charset="utf8" collate="utf8_general_ci"
row_format=compressed;

create table if not exists link_ticket (
    lk_tk_id int unsigned primary key auto_increment,
    lk_tk_link int unsigned not null,
    lk_tk_referent_ticket int unsigned not null,
    lk_tk_reference_ticket int unsigned not null,
    unique (lk_tk_link, lk_tk_referent_ticket, lk_tk_reference_ticket),
    constraint link_ticket_link_key
        foreign key (lk_tk_link)
        references link(lk_id),
    constraint link_ticket_referent_ticket_key
        foreign key (lk_tk_referent_ticket)
        references ticket(tk_id),
    constraint link_ticket_reference_ticket_key
        foreign key (lk_tk_reference_ticket)
        references ticket(tk_id)
)
engine=InnoDB
default charset="utf8" collate="utf8_general_ci"
row_format=compressed;

-- Item and Universal

create table if not exists universal (
    ul_id int unsigned primary key auto_increment,
    ul_category varchar(255) not null,
    ul_label varchar(255),
    ul_default_value varchar(255),
    unique (ul_label)
)
engine=InnoDB
default charset="utf8" collate="utf8_general_ci"
row_format=compressed;

create table if not exists item (
    it_id int unsigned primary key auto_increment,
    it_label varchar(255) not null,
    it_readonly boolean not null,
    it_required boolean not null,
    it_sort int not null,
    it_tracker int unsigned not null,
    it_universal int unsigned not null,
    unique (it_label, it_tracker),
    constraint item_tracker_key
        foreign key (it_tracker)
        references tracker(tr_id),
    constraint item_universal_key
        foreign key (it_universal)
        references universal(ul_id)
)
engine=InnoDB
default charset="utf8" collate="utf8_general_ci"
row_format=compressed;

create table if not exists item_option (
    it_op_id int unsigned primary key auto_increment,
    it_op_label varchar(255) not null,
    it_op_value varchar(255),
    it_op_item int unsigned not null,
    unique (it_op_label, it_op_item),
    constraint item_option_item_key
        foreign key (it_op_item)
        references item(it_id)
)
engine=InnoDB
default charset="utf8" collate="utf8_general_ci"
row_format=compressed;

create table if not exists item_data (
    it_dt_id int unsigned primary key auto_increment,
    it_dt_value varchar(255),
    it_dt_iteration int not null default 1,
    it_dt_item int unsigned not null,
    it_dt_ticket int unsigned not null,
    unique (it_dt_id, it_dt_item, it_dt_ticket),
    constraint item_data_item_key
        foreign key (it_dt_item)
        references item(it_id),
    constraint item_data_ticket_key
        foreign key (it_dt_ticket)
        references ticket(tk_id)
)
engine=InnoDB
default charset="utf8" collate="utf8_general_ci"
row_format=compressed;

-- History

create table if not exists history (
    ht_id int unsigned primary key auto_increment,
    ht_category varchar(255) default null,
    ht_label varchar(255) not null,
    ht_previous_value varchar(255),
    ht_next_value varchar(255),
    ht_user int unsigned,
    ht_ticket int unsigned,
    ht_created datetime default current_timestamp,
    constraint history_user_key
        foreign key (ht_user)
        references user(usr_id),
    constraint history_ticket_key
        foreign key (ht_ticket)
        references ticket(tk_id)
)
engine=InnoDB
default charset="utf8" collate="utf8_general_ci"
row_format=compressed;
