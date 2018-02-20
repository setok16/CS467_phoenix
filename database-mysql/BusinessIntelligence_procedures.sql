--Sql queries for BI (Examples provided below)
--http://34.208.205.61/phpmyadmin

---All awards in a given time frame grouped by User
DROP PROCEDURE IF EXISTS awardsByUser$$
CREATE PROCEDURE awardsByUser(IN start_date DATETIME, IN stop_date DATETIME)
BEGIN
    /* Note: Returned creation timestamp is displayed in US-Pacific time */
    SET time_zone = 'US/Pacific';
    SELECT a.user_id, count(a.c_type) FROM Award a
	WHERE granted_datetime BETWEEN start_date AND stop_date
	GROUP BY a.user_id
    SET time_zone = @@global.time_zone;
END$$

CALL awardsByUser('1/1/2018', '2/14/2018');
---All awards in a given time frame grouped by Region
---All awards in a given time frame grouped by Award Type
---All awards in a given time frame
