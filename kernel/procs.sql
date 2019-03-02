source kernel/functions.sql;

-- Internal stored procedure

drop procedure if exists internal_create_universal;
drop procedure if exists internal_create_status;
drop procedure if exists internal_create_category;
drop procedure if exists internal_create_type;
drop procedure if exists internal_create_level;
drop procedure if exists internal_create_resource;
drop procedure if exists internal_create_link;

delimiter //

create procedure internal_create_link
(in outward_description varchar(255),
 in inward_description varchar(255))
begin
    insert into link (lk_outward_description, lk_inward_description)
    values (outward_description, inward_description);
end; //

create procedure internal_create_resource
(in folder varchar(255),
 in filename varchar(255),
 out resource_id int)
begin
    insert ignore into resource (re_folder, re_filename)
    values (folder, filename);

    select re_id into resource_id
    from resource
    where re_folder = folder
        and re_filename = filename;
end; //

create procedure internal_create_level
(in name varchar(100),
 in shortname varchar(25),
 in description text,
 in folder varchar(255),
 in filename varchar(255))
begin
    declare __resource_id__ int;

    call internal_create_resource (folder, filename, __resource_id__);
    
    insert into level (lvl_name, lvl_shortname, lvl_description, lvl_icon)
    select name, shortname, description, re_id
    from resource
    where re_id = __resource_id__;
end; //

create procedure internal_create_type
(in name varchar(100),
 in shortname varchar(25),
 in description text,
 in folder varchar(255),
 in filename varchar(255))
begin
    declare __resource_id__ int;

    call internal_create_resource (folder, filename, __resource_id__);
    
    insert into type (tp_name, tp_shortname, tp_description, tp_icon)
    select name, shortname, description, re_id
    from resource
    where re_id = __resource_id__;
end; //

create procedure internal_create_category
(in name varchar(100),
 in shortname varchar(25))
begin
    insert into category (ca_name, ca_shortname)
    values (name, shortname);
end; //

create procedure internal_create_status
(in name varchar(100),
 in shortname varchar(25),
 in description text,
 in category_id int)
begin
    insert into status (st_name, st_shortname, st_description, st_category)
    values (name, shortname, description, category_id);
end; //

-- debug
create procedure internal_create_universal
(in label varchar(255))
begin
    insert into universal (ul_label)
    values (label);
end; //
-- debug

delimiter ;

-- Stored procedure

drop procedure if exists get_links;
drop procedure if exists get_tags;
drop procedure if exists get_commentaries;
drop procedure if exists get_ticket;
drop procedure if exists assign_item_to_category;
drop procedure if exists assign_link_to_ticket;
drop procedure if exists assign_tag_to_ticket;
drop procedure if exists assign_commentary_to_ticket;
drop procedure if exists assign_user_to_ticket;
drop procedure if exists create_ticket;
drop procedure if exists create_user;
drop procedure if exists create_role;
drop procedure if exists create_region;

delimiter //

create procedure create_region
(in postal char(2),
 in capital char(5),
 in nccenr varchar(255))
begin
    insert into region (rg_postal, rg_capital, rg_nccenr)
    values (postal, capital, nccenr);
end; //

create procedure create_role
(in shortname varchar(25))
begin
    insert into role (ro_shortname)
    values (shortname);
end; //

create procedure create_user
(in pseudo varchar(100),
 in nfeid char(10),
 in password char(64),
 in salt char(32),
 in iterations int,
 in folder varchar(255),
 in filename varchar(255),
 in role int)
begin
    declare __resource_id__ int;

    if ((folder is not null) and (filename is not null)) then
        call internal_create_resource (folder, filename, __resource_id__);
        
        insert into user (usr_pseudo, usr_nfeid, usr_password, usr_salt, usr_iterations, usr_avatar, usr_role)
        select pseudo, nfeid, password, salt, iterations, re_id, role
        from resource
        where re_id = __resource_id__;
    else
        insert into user (usr_pseudo, usr_nfeid, usr_password, usr_salt, usr_iterations, usr_role)
        values (pseudo, nfeid, password, salt, iterations, role);
    end if;
end; //

create procedure create_ticket
(in summary varchar(255),
 in description text,
 in color char(6),
 in region_id int,
 in type_id int,
 in level_id int,
 in status_id int,
 in user_id int)
begin
    declare __status_id__ int;

    if (status_id is null) then
        select st_id into __status_id__
        from status
        where st_shortname = "do";
    else
        set __status_id__ = status_id;
    end if;

    insert into ticket (tk_region, tk_summary, tk_description, tk_color, tk_type, tk_level, tk_status, tk_reporter)
    values (region_id, summary, compress (description), color, type_id, level_id, __status_id__, user_id);
end; //

create procedure assign_user_to_ticket
(in ticket_id int,
 in user_id int)
begin
    update ticket
    set tk_assignee = user_id
    where tk_deleted = false
        and tk_id = ticket_id;
end; //

create procedure assign_commentary_to_ticket
(in description text,
 in ticket_id int,
 in user_id int)
begin
    insert into commentary (cm_description, cm_ticket, cm_user)
    values (compress (description), ticket_id, user_id);
end; //

create procedure assign_tag_to_ticket
(in name varchar(255),
 in is_private boolean,
 in ticket_id int,
 in user_id int)
begin
    declare __user_id__ int;

    if (is_private is true) then
        select tg_user into __user_id__;
    end if;

    insert into tag (tg_name, tg_user_private, tg_ticket, tg_user)
    values (name, __user_id__, ticket_id, user_id);
end; //

create procedure assign_link_to_ticket
(in link_id int,
 in from_ticket_id int,
 in to_ticket_id int)
begin
    insert into link_ticket (lk_tk_link, lk_tk_outward_ticket, lk_tk_inward_ticket)
    values (link_id, from_ticket_id, to_ticket_id);
end; //

-- debug
create procedure assign_item_to_category
(in label varchar(255),
 in select_field text,
 in update_field text,
 in type_id int,
 in universal_id int)
begin
    insert into item (it_label, it_select_field, it_update_field, it_sorting, it_type, it_universal)
    values (label, select_field, update_field, 1, type_id, universal_id); -- maybe compress select_field and update_field later
end; //
-- debug

create procedure get_ticket
(in ticket_id int)
begin
    select tk_id,
        tk_shortid,
        tk_summary,
        uncompress (tk_description) as "tk_description",
        tk_created,
        tk_updated,
        tk_resolved,
        rg_id,
        rg_postal,
        rg_capital,
        rg_nccenr,
        tp_id,
        tp_name,
        tp_shortname,
        tp_description,
        concat (type_resource.re_folder, type_resource.re_filename) as "tp_resource",
        lvl_id,
        lvl_name,
        lvl_shortname,
        lvl_description,
        concat (level_resource.re_folder, level_resource.re_filename) as "lvl_resource",
        st_id,
        st_name,
        st_shortname,
        st_description,
        ca_id,
        ca_name,
        ca_shortname,
        assignee.usr_id as "assignee_usr_id",
        assignee.usr_pseudo as "assignee_usr_pseudo",
        assignee.usr_nfeid as "assignee_usr_nfeid",
        concat (assignee_resource.re_folder, assignee_resource.re_filename) as "assignee_usr_resource",
        reporter.usr_id as "reporter_usr_id",
        reporter.usr_pseudo as "reporter_usr_pseudo",
        reporter.usr_nfeid as "reporter_usr_nfeid",
        concat (reporter_resource.re_folder, reporter_resource.re_filename) as "reporter_usr_resource"
    from ticket
    join region on rg_id = tk_region
    join type on tp_id = tk_type
    join resource as type_resource on type_resource.re_id = tp_icon
    join level on lvl_id = tk_level
    join resource as level_resource on level_resource.re_id = lvl_icon
    join status on status.st_id = tk_status
    join category on ca_id = st_category
    left outer join user as assignee on assignee.usr_id = tk_assignee
        and assignee.usr_deleted = false
    left outer join resource as assignee_resource on assignee_resource.re_id = assignee.usr_avatar
    join user as reporter on reporter.usr_id = tk_reporter
    left outer join resource as reporter_resource on reporter_resource.re_id = reporter.usr_avatar
    where tk_deleted = false
        and tk_id = ticket_id;
end; //

create procedure get_commentaries
(in ticket_id int)
begin
    select cm_id,
        uncompress (cm_description) as "cm_description",
        cm_created,
        cm_updated,
        cm_ticket,
        usr_id,
        usr_pseudo,
        usr_nfeid,
        concat (re_folder, re_filename) as "usr_resource"
    from commentary
    join user on usr_id = cm_user
    left outer join resource on re_id = usr_avatar
    where cm_deleted = false
        and cm_ticket = ticket_id;
end; //

create procedure get_tags
(in ticket_id int,
 in user_id int)
begin
    select tg_id,
        tg_name,
        tg_ticket,
        usr_id,
        usr_pseudo,
        usr_nfeid,
        concat (re_folder, re_filename) as "usr_resource"
    from tag
    join user on usr_id = tg_user
    left outer join resource on re_id = usr_avatar
    where tg_deleted = false
        and tg_ticket = ticket_id
        and (
            tg_user_private is null 
            or (
                tg_user_private is not null 
                and tg_user_private = user_id
            )
        );
end; //

create procedure get_links
(in ticket_id int)
begin
    select lk_tk_id,
        lk_id,
        lk_outward_description,
        lk_tk_inward_ticket
    from link_ticket
    join link on lk_id = lk_tk_id
    -- join ticket on tk_id = lk_tk_inward_ticket -- get_minimal_ticket
    where lk_tk_outward_ticket = ticket_id

    union

    select lk_tk_id,
        lk_id,
        lk_inward_description,
        lk_tk_outward_ticket
    from link_ticket
    join link on lk_id = lk_tk_id
    where lk_tk_inward_ticket = ticket_id;
end; //

delimiter ;
