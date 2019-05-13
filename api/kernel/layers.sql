drop table if exists preference;
drop table if exists item_data;
drop table if exists item;
drop table if exists universal;
drop table if exists link_ticket;
drop table if exists link;
drop table if exists tag;
drop table if exists commentary;
drop table if exists ticket;
drop table if exists status;
drop table if exists category;
drop table if exists priority;
drop table if exists tracker;
drop table if exists region;
drop table if exists user;
drop table if exists role;
drop table if exists resource;

create table resource (
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

create table role (
    ro_id int unsigned primary key auto_increment,
    ro_shortname varchar(25) not null,
    unique (ro_shortname)
)
engine=InnoDB
default charset="utf8" collate="utf8_general_ci"
row_format=compressed;

create table user (
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

create table region (
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

create table tracker (
    tr_id int unsigned primary key auto_increment,
    tr_name varchar(100) not null,
    tr_shortname varchar(25) not null,
    tr_description text,
    tr_icon int unsigned not null,
    unique (tr_shortname),
    constraint tracker_icon_key
        foreign key (tr_icon)
        references resource(re_id)
)
engine=InnoDB
default charset="utf8" collate="utf8_general_ci"
row_format=compressed;

create table priority (
    pr_id int unsigned primary key auto_increment,
    pr_name varchar(100) not null,
    pr_shortname varchar(25) not null,
    pr_description text,
    pr_icon int unsigned not null,
    unique (pr_shortname),
    constraint priority_icon_key
        foreign key (pr_icon)
        references resource(re_id)
)
engine=InnoDB
default charset="utf8" collate="utf8_general_ci"
row_format=compressed;

create table category (
    ca_id int unsigned primary key auto_increment,
    ca_name varchar(100) not null,
    ca_shortname varchar(25) not null,
    unique (ca_shortname)
)
engine=InnoDB
default charset="utf8" collate="utf8_general_ci"
row_format=compressed;

create table status (
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

create table ticket (
    tk_id int unsigned primary key auto_increment,
    tk_region int unsigned not null,
    tk_shortid int unsigned not null,
    tk_summary varchar(255) not null,
    tk_description blob,
    tk_color char(6),
    tk_tracker int unsigned not null,
    tk_priority int unsigned not null,
    tk_status int unsigned not null,
    tk_assignee int unsigned,
    tk_reporter int unsigned not null,
    tk_deleted boolean not null default false,
    tk_created datetime default current_timestamp,
    tk_updated datetime on update current_timestamp,
    tk_resolved datetime,
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
    constraint ticket_assign_key
        foreign key (tk_assignee)
        references user(usr_id),
    constraint ticket_reporter_key
        foreign key (tk_reporter)
        references user(usr_id)
)
engine=InnoDB
default charset="utf8" collate="utf8_general_ci"
row_format=compressed;

create table commentary (
    cm_id int unsigned primary key auto_increment,
    cm_description blob not null,
    cm_ticket int unsigned not null,
    cm_user int unsigned not null,
    cm_deleted boolean not null default false,
    cm_created datetime default current_timestamp,
    cm_updated datetime on update current_timestamp,
    -- unique (description, ticket, user),
    constraint commentary_ticket_key
        foreign key (cm_ticket)
        references ticket(tk_id),
    constraint commentary_user_key
        foreign key (cm_user)
        references user(usr_id)
)
engine=InnoDB
default charset="utf8" collate="utf8_general_ci"
row_format=compressed;

create table tag (
    tg_id int unsigned primary key auto_increment,
    tg_name varchar(255) not null,
    tg_private boolean not null,
    tg_ticket int unsigned not null,
    tg_user int unsigned not null,
    tg_deleted boolean not null default false,
    tg_created datetime default current_timestamp,
    tg_updated datetime on update current_timestamp,
    constraint tag_ticket_key
        foreign key (tg_ticket)
        references ticket(tk_id),
    constraint tag_user_key
        foreign key (tg_user)
        references user(usr_id)
)
engine=InnoDB
default charset="utf8" collate="utf8_general_ci"
row_format=compressed;

-- Issue linking

create table link (
    lk_id int unsigned primary key auto_increment,
    lk_outward_description varchar(255) not null,
    lk_inward_description varchar(255) not null
)
engine=InnoDB
default charset="utf8" collate="utf8_general_ci"
row_format=compressed;

create table link_ticket (
    lk_tk_id int unsigned primary key auto_increment,
    lk_tk_link int unsigned not null,
    lk_tk_outward_ticket int unsigned not null,
    lk_tk_inward_ticket int unsigned not null,
    lk_tk_created datetime default current_timestamp,
    lk_tk_updated datetime on update current_timestamp,
    unique (lk_tk_link, lk_tk_outward_ticket, lk_tk_inward_ticket),
    constraint link_ticket_link_key
        foreign key (lk_tk_link)
        references link(lk_id),
    constraint link_ticket_outward_ticket_key
        foreign key (lk_tk_outward_ticket)
        references ticket(tk_id),
    constraint link_ticket_inward_ticket_key
        foreign key (lk_tk_inward_ticket)
        references ticket(tk_id)
)
engine=InnoDB
default charset="utf8" collate="utf8_general_ci"
row_format=compressed;

-- Item and Universal

create table universal (
    ul_id int unsigned primary key auto_increment,
    ul_parent varchar(255) not null,
    ul_label varchar(255),
    unique (ul_label)
)
engine=InnoDB
default charset="utf8" collate="utf8_general_ci"
row_format=compressed;

create table item (
    it_id int unsigned primary key auto_increment,
    it_label varchar(255) not null,
    it_select_field text not null,
    it_update_field text,
    it_readonly boolean not null,
    it_required boolean not null,
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

create table item_data (
    it_dt_id int unsigned primary key auto_increment,
    it_dt_value_text varchar(255),
    it_dt_value_geo Point,
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

create table preference ( -- for rgpd and other preferences
    pf_id int unsigned primary key auto_increment,
    pf_user int unsigned not null,
    pf_key varchar(255) not null,
    pf_value varchar(255),
    pf_created datetime default current_timestamp,
    pf_updated datetime on update current_timestamp,
    unique(pf_user, pf_key),
    constraint preference_user_key
        foreign key (pf_user)
        references user(usr_id)
)
engine=InnoDB
default charset="utf8" collate="utf8_general_ci"
row_format=compressed;
