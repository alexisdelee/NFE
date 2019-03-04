-- Internal function

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

delimiter ;
