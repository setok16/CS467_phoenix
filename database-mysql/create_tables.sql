CREATE TABLE `User` (
  `u_id` int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `u_type` enum('normal', 'admin') NOT NULL DEFAULT 'normal',
  `email` varchar(63) NOT NULL UNIQUE,
  `pwd_hashed` varchar(63) NOT NULL,
  `fname` varchar(63) NULL,
  `lname` varchar(63) NULL,
  `creation_datetime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `signature` MEDIUMBLOB
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `Award` (
  `c_id` int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `c_type` enum('week', 'month') NOT NULL DEFAULT 'week',
  `user_id` int,
  `receiver_fname` varchar(63) NOT NULL,
  `receiver_lname` varchar(63) NOT NULL,
  `receiver_email` varchar(63) NOT NULL,
  `granted_datetime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `User` (`u_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;