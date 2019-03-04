source kernel/functions.sql

drop trigger if exists ticket_update_trigger;
drop trigger if exists ticket_insert_trigger;

delimiter //

-- ticket
create trigger ticket_insert_trigger
before insert on ticket
for each row
begin
    declare __shortid__ int;

    select ifnull(max(tk_shortid), 0) + 1 into __shortid__
    from ticket
    where tk_region = new.tk_region;

    set new.tk_shortid = __shortid__;
end; //

create trigger ticket_update_trigger
before update on ticket
for each row
begin
    declare __shortid__ int;

    if ((new.tk_reporter is null) or (old.tk_reporter <> new.tk_reporter)) then
        select __throw_error__ ("forbidden action: attempt to modify the reporter") into __shortid__;
    end if;
end; //

delimiter ;
