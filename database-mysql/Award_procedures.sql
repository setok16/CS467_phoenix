delimiter $$


/* PROCEDURE addAward
Inputs:
    input_c_type: enum('week', 'month') - Use 1 for 'week', 2 for 'month'
    input_user_id: int - must match the u_id of an existing normal user in the User table
    input_receiver_fname: varchar(63)
    input_receiver_lname: varchar(63)
    input_receiver_email: varchar(63)
    input_granted_datetime_pacific: datetime - Format 'YYYY-MM-DD HH:MM:SS'; Use US/Canada Pacific time
*/
DROP PROCEDURE IF EXISTS addAward$$
CREATE PROCEDURE addAward (
    IN input_c_type enum('week', 'month'),
    IN input_user_id int,
    IN input_receiver_fname varchar(63),
    IN input_receiver_lname varchar(63),
    IN input_receiver_email varchar(63),
    IN input_granted_datetime_pacific DATETIME
    )
BEGIN
    /* Convert the granted datetime to the server's time (UTC) in order to be stored in the database */
    SET @input_granted_datetime_utc = CONVERT_TZ(input_granted_datetime_pacific, 'US/Pacific', @@global.time_zone);
    SET FOREIGN_KEY_CHECKS = 1;

    INSERT INTO Award (`c_type`, `user_id`, `receiver_fname`, `receiver_lname`, `receiver_email`, `granted_datetime`)
        VALUES (input_c_type, input_user_id, input_receiver_fname, input_receiver_lname, input_receiver_email,
        @input_granted_datetime_utc);
END$$



DROP PROCEDURE IF EXISTS selectAwardByAwardID$$
CREATE PROCEDURE selectAwardByAwardID (IN input_c_id int)
BEGIN
    /* Note: Returned granted datetime is displayed in US-Pacific time */
    SET time_zone = 'US/Pacific';
    SELECT * FROM `Award` WHERE `c_id` = input_c_id;
    SET time_zone = @@global.time_zone;
END$$



DROP PROCEDURE IF EXISTS selectAwardByUserID$$
CREATE PROCEDURE selectAwardByUserID (IN input_user_id int)
BEGIN
    /* Note: Returned granted datetime is displayed in US-Pacific time */
    SET time_zone = 'US/Pacific';
    SELECT * FROM `Award` WHERE `user_id` = input_user_id;
    SET time_zone = @@global.time_zone;
END$$




DROP PROCEDURE IF EXISTS selectAwardByAwardType$$
CREATE PROCEDURE selectAwardByAwardType (IN input_c_type enum('week', 'month'))
/* input_c_type: Use 1 for 'week' and 2 for 'month' */
BEGIN
    /* Note: Returned granted datetime is displayed in US-Pacific time */
    SET time_zone = 'US/Pacific';
    SELECT * FROM `Award` WHERE `c_type` = input_c_type;
    SET time_zone = @@global.time_zone;
END$$



DROP PROCEDURE IF EXISTS selectUserByAwardID$$
CREATE PROCEDURE selectUserByAwardID (IN input_c_id int)
BEGIN
    /* Note: Returned user creation datetime is displayed in US-Pacific time */
    SET time_zone = 'US/Pacific';
    SET FOREIGN_KEY_CHECKS = 0;

    SELECT U.* FROM `User` U INNER JOIN `Award` A
        ON A.user_id IS NOT NULL
        AND U.u_id = A.user_id
        AND A.c_id = input_c_id;
    
    SET time_zone = @@global.time_zone;
    SET FOREIGN_KEY_CHECKS = 1;
END$$



DROP PROCEDURE IF EXISTS deleteAwardByAwardID$$
CREATE PROCEDURE deleteAwardByAwardID (IN input_c_id int)
BEGIN
    DELETE FROM `Award` WHERE `c_id` = input_c_id;
END$$



DROP PROCEDURE IF EXISTS deleteAwardByAwardType$$
CREATE PROCEDURE deleteAwardByAwardType (IN input_c_type enum('week', 'month'))
/* input_c_type: Use 1 for 'week' and 2 for 'month' */
BEGIN
    DELETE FROM `Award` WHERE `c_type` = input_c_type;
END$$


delimiter ;