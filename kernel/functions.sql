-- Internal function

drop function if exists internal_try_read_ticket_id;
drop function if exists internal_try_read_user_id;
drop function if exists internal_try_read_region_id;
drop function if exists internal_try_read_status_id;
drop function if exists internal_try_read_category_id;
drop function if exists internal_try_read_type_id;
drop function if exists internal_try_read_level_id;
drop function if exists internal_try_read_role_id;
drop function if exists internal_try_read_resource_id;
drop function if exists internal_try_read_link_id;
drop function if exists __throw_error__;

delimiter //

create function __throw_error__
(message varchar(255))
returns int
not deterministic
begin
    signal sqlstate "45000" set message_text = message;
    return -1;
end; //

create function internal_try_read_link_id
(link_id int)
returns int
not deterministic
begin
    declare __link_id__ int;

    select lk_id into __link_id__
    from link
    where lk_id = link_id;
    
    if (__link_id__ is null) then
        select __throw_error__ (concat_ws("", "unknown link for id=", link_id)) into __link_id__;
    end if;

    return __link_id__;
end; //

create function internal_try_read_resource_id
(resource_id int)
returns int
not deterministic
begin
    declare __resource_id__ int;

    select re_id into __resource_id__
    from resource
    where re_id = resource_id;
    
    if (__resource_id__ is null) then
        select __throw_error__ (concat_ws("", "unknown resource for id=", resource_id)) into __resource_id__;
    end if;

    return __resource_id__;
end; //

create function internal_try_read_role_id
(role_id int)
returns int
not deterministic
begin
    declare __role_id__ int;

    select re_id into __role_id__
    from role
    where re_id = role_id;
    
    if (__role_id__ is null) then
        select __throw_error__ (concat_ws("", "unknown role for id=", role_id)) into __role_id__;
    end if;

    return __role_id__;
end; //

create function internal_try_read_level_id
(level_id int)
returns int
not deterministic
begin
    declare __level_id__ int;

    select lvl_id into __level_id__
    from level
    where lvl_id = level_id;

    if (__level_id__ is null) then
        select __throw_error__ (concat_ws("", "unknown level for id=", level_id)) into __level_id__;
    end if;

    return __level_id__;
end; //

create function internal_try_read_type_id
(type_id int)
returns int
not deterministic
begin
    declare __type_id__ int;

    select tp_id into __type_id__
    from type
    where tp_id = type_id;

    if (__type_id__ is null) then
        select __throw_error__ (concat_ws("", "unknown type for id=", type_id)) into __type_id__;
    end if;

    return __type_id__;
end; //

create function internal_try_read_category_id
(category_id int)
returns int
not deterministic
begin
    declare __category_id__ int;

    select ca_id into __category_id__
    from category
    where ca_id = category_id;

    if (__category_id__ is null) then
        select __throw_error__ (concat_ws("", "unknown category for id=", category_id)) into __category_id__;
    end if;

    return __category_id__;
end; //

create function internal_try_read_status_id
(status_id int,
 category_id int)
returns int
not deterministic
begin
    declare __status_id__ int;

    if (category_id is null) then
        select st_id into __status_id__
        from status
        where st_id = status_id;
    else
        select st_id into __status_id__
        from status
        where st_id = status_id
            and st_category = category_id;
    end if;

    if (__status_id__ is null) then
        if (category_id is null) then
            select __throw_error__ (concat_ws("", "unknown status for id=", status_id)) into __status_id__;
        else
            select __throw_error__ (concat_ws("", "unknown status for id=", status_id, ", category=", category_id)) into __status_id__;
        end if;
    end if;

    return __status_id__;
end; //

create function internal_try_read_region_id
(region_id int)
returns int
not deterministic
begin
    declare __region_id__ int;

    select rg_id into __region_id__
    from region
    where rg_id = region_id;

    if (__region_id__ is null) then
        select __throw_error__ (concat_ws("", "unknown region for id=", id)) into __region_id__;
    end if;

    return __region_id__;
end; //

create function internal_try_read_user_id
(user_id int)
returns int
not deterministic
begin
    declare __user_id__ int;

    select usr_id into __user_id__
    from user
    where usr_id = user_id;

    if (__user_id__ is null) then
        select __throw_error__ (concat_ws("", "unknown user for id=", user_id)) into __user_id__;
    end if;

    return __user_id__;
end; //

create function internal_try_read_ticket_id
(ticket_id int)
returns int
not deterministic
begin
    declare __ticket_id__ int;

    select tk_id into __ticket_id__
    from ticket
    where tk_id = ticket_id;

    if (__ticket_id__ is null) then
        select __throw_error__ (concat_ws("", "unknown ticket for id=", ticket_id)) into __ticket_id__;
    end if;

    return __ticket_id__;
end; //

delimiter ;
