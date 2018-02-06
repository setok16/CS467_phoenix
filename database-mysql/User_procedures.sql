delimiter $$


/* Use the following MySQL command to call the stored procedure:
    CALL addNormalUser(email_str, pwd_hashed_str, fname_str, lname_str, sig_base64);
*/
CREATE PROCEDURE addNormalUser (
    IN input_email varchar(63),
    IN input_pwd_hashed varchar(63),
    IN input_fname varchar(63),
    IN input_lname varchar(63),
    IN input_signature MEDIUMBLOB
    )
BEGIN
    INSERT INTO User (`email`, `pwd_hashed`, `fname`, `lname`, `signature`)
        VALUES (input_email, input_pwd_hashed, input_fname, input_lname, input_signature);
END$$



CREATE PROCEDURE addAdminUser (
    IN input_email varchar(63),
    IN input_pwd_hashed varchar(63)
    )
BEGIN
    INSERT INTO User (`u_type`, `email`, `pwd_hashed`)
        VALUES ('admin', input_email, input_pwd_hashed);
END$$



CREATE PROCEDURE selectUserByEmail (IN input_email varchar(63))
BEGIN
    SELECT * FROM `User` WHERE `email` = input_email;
END$$



CREATE PROCEDURE selectUserByID (IN input_id int)
BEGIN
    SELECT * FROM `User` WHERE `u_id` = input_id;
END$$



CREATE PROCEDURE deleteUserByEmail (IN input_email varchar(63))
BEGIN
    DELETE FROM `User` WHERE `email` = input_email;
END$$



CREATE PROCEDURE deleteUserByID (IN input_id int)
BEGIN
    DELETE FROM `User` WHERE `u_id` = input_id;
END$$



CREATE PROCEDURE changeUserNameByEmail (
    IN input_email varchar(63),
    IN input_fname varchar(63),
    IN input_lname varchar(63)
    )
BEGIN
    UPDATE `User`
    SET `fname` = input_fname, `lname` = input_lname
    WHERE `email` = input_email;
END$$



CREATE PROCEDURE changeUserNameByID (
    IN input_id int,
    IN input_fname varchar(63),
    IN input_lname varchar(63)
    )
BEGIN
    UPDATE `User`
    SET `fname` = input_fname, `lname` = input_lname
    WHERE `u_id` = input_id;
END$$


delimiter ;

/* Useful MySQL Commands:

1. Show stored procedures created from this file:
    SHOW PROCEDURE STATUS LIKE '%User%';

2. Show the definition of a stored procedure (e.g. sp_name):
    SHOW CREATE PROCEDURE sp_name;

3. Remove a stored procedure:
    DROP PROCEDURE IF EXISTS sp_name;

4. Call a stored procedure:
    CALL sp_name(para1, para2);
*/