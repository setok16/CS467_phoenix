delimiter $$


/* Use the following MySQL command to call the stored procedure:
    CALL addNormalUser(email_str, pwd_hashed_str, fname_str, lname_str, sig_base64);
*/
DROP PROCEDURE IF EXISTS addNormalUser$$
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



DROP PROCEDURE IF EXISTS addAdminUser$$
CREATE PROCEDURE addAdminUser (
    IN input_email varchar(63),
    IN input_pwd_hashed varchar(63)
    )
BEGIN
    INSERT INTO User (`u_type`, `email`, `pwd_hashed`)
        VALUES ('admin', input_email, input_pwd_hashed);
END$$



DROP PROCEDURE IF EXISTS selectUserByEmail$$
CREATE PROCEDURE selectUserByEmail (IN input_email varchar(63))
BEGIN
    /* Note: Returned creation timestamp is displayed in US-Pacific time */
    SET time_zone = 'US/Pacific';
    SELECT * FROM `User` WHERE `email` = input_email;
    SET time_zone = @@global.time_zone;
END$$



DROP PROCEDURE IF EXISTS selectUserByID$$
CREATE PROCEDURE selectUserByID (IN input_id int)
BEGIN
    /* Note: Returned creation timestamp is displayed in US-Pacific time */
    SET time_zone = 'US/Pacific';
    SELECT * FROM `User` WHERE `u_id` = input_id;
    SET time_zone = @@global.time_zone;
END$$



DROP PROCEDURE IF EXISTS selectUserByUserType$$
CREATE PROCEDURE selectUserByUserType (IN input_u_type enum('normal', 'admin'))
/* input_u_type: Use 1 for 'normal' and 2 for 'admin' */
BEGIN
    /* Note: Returned creation timestamp is displayed in US-Pacific time */
    SET time_zone = 'US/Pacific';
    SELECT * FROM `User` WHERE `u_type` = input_u_type;
    SET time_zone = @@global.time_zone;
END$$



DROP PROCEDURE IF EXISTS deleteUserByEmail$$
CREATE PROCEDURE deleteUserByEmail (IN input_email varchar(63))
BEGIN
    DELETE FROM `User` WHERE `email` = input_email;
END$$



DROP PROCEDURE IF EXISTS deleteUserByID$$
CREATE PROCEDURE deleteUserByID (IN input_id int)
BEGIN
    DELETE FROM `User` WHERE `u_id` = input_id;
END$$



DROP PROCEDURE IF EXISTS changeUserNameByEmail$$
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



DROP PROCEDURE IF EXISTS changeUserNameByID$$
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



DROP PROCEDURE IF EXISTS changeSignatureByID$$
CREATE PROCEDURE changeSignatureByID (
    IN input_id int,
    IN input_signature MEDIUMBLOB
    )
BEGIN
    UPDATE `User`
    SET `signature` = input_signature
    WHERE `u_id` = input_id;
END$$



DROP PROCEDURE IF EXISTS setRecoveryCodeByID$$
CREATE PROCEDURE setRecoveryCodeByID (
    IN input_id int,
    IN input_recovery_code varchar(63) /* NULL is allowed */
    )
BEGIN
    UPDATE `User`
    SET `recovery_code` = input_recovery_code
    WHERE `u_id` = input_id;
END$$



/* Trigger: prevents adding normal user with NULL fname or lname */
DROP TRIGGER IF EXISTS normal_user_add_validate$$
CREATE TRIGGER normal_user_add_validate before insert on User
for each row
BEGIN
    IF (new.u_type = 'normal' AND
    (new.fname IS NULL OR new.fname = '' OR new.lname IS NULL OR new.lname = '')
    )
    THEN
        signal sqlstate '45000' set message_text = 'Normal User must have fname and lname';
    END IF;
END$$



/* Trigger: prevents updating normal user to have NULL fname or lname */
DROP TRIGGER IF EXISTS normal_user_update_validate$$
CREATE TRIGGER normal_user_update_validate before update on User
for each row
BEGIN
    IF (new.u_type = 'normal' AND
    (new.fname IS NULL OR new.fname = '' OR new.lname IS NULL OR new.lname = '')
    )
    THEN
        signal sqlstate '45000' set message_text = 'Normal User must have fname and lname';
    END IF;
END$$


delimiter ;

/* Useful MySQL Commands:

1. Show stored procedures:
    SHOW PROCEDURE STATUS LIKE '%User%';
    SHOW PROCEDURE STATUS WHERE name LIKE '%User%' OR name LIKE '%Award%';

2. Show the definition of a stored procedure (e.g. sp_name):
    SHOW CREATE PROCEDURE sp_name;

3. Remove a stored procedure:
    DROP PROCEDURE IF EXISTS sp_name;

4. Call a stored procedure:
    CALL sp_name(para1, para2);
*/