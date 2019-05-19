-- Internal stored procedure

drop procedure if exists internal_create_option;
drop procedure if exists internal_create_item;
drop procedure if exists internal_create_universal;
drop procedure if exists internal_create_status;
drop procedure if exists internal_create_category;
drop procedure if exists internal_create_tracker;
drop procedure if exists internal_create_priority;
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

create procedure internal_create_priority
(in name varchar(100),
 in shortname varchar(25),
 in description text,
 in folder varchar(255),
 in filename varchar(255))
begin
    declare __resource_id__ int;

    call internal_create_resource (folder, filename, __resource_id__);
    
    insert into priority (pr_name, pr_shortname, pr_description, pr_icon)
    select name, shortname, description, re_id
    from resource
    where re_id = __resource_id__;
end; //

create procedure internal_create_tracker
(in name varchar(100),
 in shortname varchar(25),
 in description text,
 in folder varchar(255),
 in filename varchar(255))
begin
    declare __resource_id__ int;

    call internal_create_resource (folder, filename, __resource_id__);
    
    insert into tracker (tr_name, tr_shortname, tr_description, tr_icon)
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
(in parent varchar(255),
 in label varchar(255))
begin
    insert into universal (ul_parent, ul_label)
    values (parent, label);
end; //

create procedure internal_create_item
(in label varchar(255),
 in readonly boolean,
 in required boolean,
 in tracker_id int,
 in universal_id int)
begin
    insert into item (it_label, it_readonly, it_required, it_tracker, it_universal)
    values (label, readonly, required, tracker_id, universal_id);
end; //

create procedure internal_create_option
(in label varchar(255),
 in value varchar(255),
 in item_id int)
begin
    insert into item_option (it_op_label, it_op_value, it_op_item)
    values (label, value, item_id);
end; //
-- debug

delimiter ;

-- Stored procedure

drop procedure if exists get_links;
drop procedure if exists get_status;
drop procedure if exists get_priorities;
drop procedure if exists get_trackers;
drop procedure if exists get_regions;
drop procedure if exists get_categories;
drop procedure if exists get_link;
drop procedure if exists get_tag;
drop procedure if exists get_commentary;
drop procedure if exists get_ticket;
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
 in name varchar(255))
begin
    insert into region (rg_postal, rg_capital, rg_name)
    values (postal, capital, name);
end; //

create procedure create_role
(in shortname varchar(25))
begin
    insert into role (ro_shortname)
    values (shortname);
end; //

create procedure create_user
(in pseudo varchar(100),
 in nfeid char(18),
 in password char(128),
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
 in region_id int,
 in tracker_id int,
 in priority_id int,
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

    insert into ticket (tk_region, tk_summary, tk_description, tk_tracker, tk_priority, tk_status, tk_reporter)
    values (region_id, summary, compress (description), tracker_id, priority_id, __status_id__, user_id);
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
    insert into tag (tg_name, tg_private, tg_ticket, tg_user)
    values (name, is_private, ticket_id, user_id);
end; //

create procedure assign_link_to_ticket
(in link_id int,
 in from_ticket_id int,
 in to_ticket_id int)
begin
    insert into link_ticket (lk_tk_link, lk_tk_outward_ticket, lk_tk_inward_ticket)
    values (link_id, from_ticket_id, to_ticket_id);
end; //

create procedure get_ticket
(in ticket_id int)
begin
    select tk_id,
        tk_summary,
        uncompress (tk_description) as "tk_description",
        tk_created,
        tk_updated,
        tk_resolved,
        rg_id,
        rg_postal,
        rg_capital,
        rg_name,
        tr_id as "tracker_tr_id",
        tr_name as "tracker_tr_name",
        tr_shortname as "tracker_tr_shortname",
        tr_description as "tracker_tr_description",
        tracker_resource.re_id as "tracker_re_id",
        tracker_resource.re_folder as "tracker_re_folder",
        tracker_resource.re_filename as "tracker_re_filename",
        pr_id as "priority_pr_id",
        pr_name as "priority_pr_name",
        pr_shortname as "priority_pr_shortname",
        pr_description as "priority_pr_description",
        priority_resource.re_id as "priority_re_id",
        priority_resource.re_folder as "priority_re_folder",
        priority_resource.re_filename as "priority_re_filename",
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
        assignee_resource.re_id as "assignee_re_id",
        assignee_resource.re_folder as "assignee_re_folder",
        assignee_resource.re_filename as "assignee_re_filename",
        assignee_role.ro_id as "assignee_ro_id",
        assignee_role.ro_shortname as "assignee_ro_shortname",
        assignee.usr_rgpd as "assignee_usr_rgpd",
        assignee.usr_created as "assignee_usr_created",
        assignee.usr_updated as "assignee_usr_updated",
        reporter.usr_id as "reporter_usr_id",
        reporter.usr_pseudo as "reporter_usr_pseudo",
        reporter.usr_nfeid as "reporter_usr_nfeid",
        reporter_resource.re_id as "reporter_re_id",
        reporter_resource.re_folder as "reporter_re_folder",
        reporter_resource.re_filename as "reporter_re_filename",
        reporter_role.ro_id as "reporter_ro_id",
        reporter_role.ro_shortname as "reporter_ro_shortname",
        reporter.usr_rgpd as "reporter_usr_rgpd",
        reporter.usr_created as "reporter_usr_created",
        reporter.usr_updated as "reporter_usr_updated"
    from ticket
    join region on rg_id = tk_region
    join tracker on tr_id = tk_tracker
    join resource as tracker_resource on tracker_resource.re_id = tr_icon
    join priority on pr_id = tk_priority
    join resource as priority_resource on priority_resource.re_id = pr_icon
    join status on status.st_id = tk_status
    join category on ca_id = st_category
    left outer join user as assignee on assignee.usr_id = tk_assignee
        and assignee.usr_deleted = false
    left outer join resource as assignee_resource on assignee_resource.re_id = assignee.usr_avatar
    join role as assignee_role on assignee_role.ro_id = assignee.usr_role
    join user as reporter on reporter.usr_id = tk_reporter
    left outer join resource as reporter_resource on reporter_resource.re_id = reporter.usr_avatar
    join role as reporter_role on reporter_role.ro_id = reporter.usr_role
    where tk_deleted = false
        and tk_id = ticket_id;
end; //

create procedure get_commentary
(in ticket_id int)
begin
    select cm_id,
        uncompress (cm_description) as "cm_description",
        cm_ticket,
        cm_user,
        cm_created,
        cm_updated
    from commentary
    where cm_deleted = false
        and cm_ticket = ticket_id;
end; //

create procedure get_tag
(in ticket_id int,
 in user_id int)
begin
    select tg_id,
        tg_name,
        tg_ticket,
        usr_id,
        usr_pseudo,
        usr_nfeid,
        re_folder,
        re_filename
    from tag
    join user on usr_id = tg_user
    left outer join resource on re_id = usr_avatar
    where tg_deleted = false
        and tg_ticket = ticket_id
        and (
            tg_private = false 
            or (
                tg_private = true 
                and tg_user = user_id
            )
        );
end; //

create procedure get_link
(in ticket_id int)
begin
    select lk_tk_id,
        lk_id,
        lk_outward_description,
        lk_tk_inward_ticket
    from link_ticket
    join link on lk_id = lk_tk_link
    -- join ticket on tk_id = lk_tk_inward_ticket -- get_minimal_ticket
    where lk_tk_outward_ticket = ticket_id

    union

    select lk_tk_id,
        lk_id,
        lk_inward_description,
        lk_tk_outward_ticket
    from link_ticket
    join link on lk_id = lk_tk_link
    where lk_tk_inward_ticket = ticket_id;
end; //

create procedure get_categories
(in name varchar(100),
 in shortname varchar(25))
begin
    if (name is not null or shortname is not null) then
        select ca_id,
            ca_name,
            ca_shortname
        from category
        where if (name is null, false, ca_name = name)
            or if (shortname is null, false, ca_shortname = shortname);
    else
        select ca_id,
            ca_name,
            ca_shortname
        from category;
    end if;
end; //

create procedure get_regions
(in postal char(2),
 in capital char(5),
 name varchar(255))
begin
    if (postal is not null or capital is not null or name is not null) then
        select rg_id,
            rg_postal,
            rg_capital,
            rg_name
        from region
        where if (postal is null, false, rg_postal = postal)
            or if (capital is null, false, rg_capital = capital)
            or if (name is null, false, rg_name = name);
    else
        select rg_id,
            rg_postal,
            rg_capital,
            rg_name
        from region;
    end if;
end; //

create procedure get_trackers
(in name varchar(100),
 in shortname varchar(25))
begin
    if (name is not null or shortname is not null) then
        select tr_id,
            tr_name,
            tr_shortname
        from tracker
        where if (name is null, false, tr_name = name)
            or if (shortname is null, false, tr_shortname = shortname);
    else
        select tr_id,
            tr_name,
            tr_shortname
        from tracker;
    end if;
end; //

create procedure get_priorities
(in name varchar(100),
 in shortname varchar(25))
begin
    if (name is not null or shortname is not null) then
        select pr_id,
            pr_name,
            pr_shortname
        from priority
        where if (name is null, false, pr_name = name)
            or if (shortname is null, false, pr_shortname = shortname);
    else
        select pr_id,
            pr_name,
            pr_shortname
        from priority;
    end if;
end; //

create procedure get_status
(in name varchar(100),
 in shortname varchar(25))
begin
    if (name is not null or shortname is not null) then
        select st_id,
            st_name,
            st_shortname
        from status
        where if (name is null, false, st_name = name)
            or if (shortname is null, false, st_shortname = shortname);
    else
        select st_id,
            st_name,
            st_shortname
        from status;
    end if;
end; //

create procedure get_links
(in outward varchar(255),
 in inward varchar(255))
begin
    if (outward is not null or inward is not null) then
        select lk_id,
            lk_outward_description,
            lk_inward_description
        from link
        where if (outward is null, false, lk_outward_description = outward)
            or if (inward is null, false, lk_inward_description = inward);
    else
        select lk_id,
            lk_outward_description,
            lk_inward_description
        from link;
    end if;
end; //

delimiter ;
