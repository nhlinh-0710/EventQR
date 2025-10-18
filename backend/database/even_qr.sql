-- --------------------------------------------------------
-- Database: even_qr (Optimized)
-- --------------------------------------------------------
CREATE DATABASE IF NOT EXISTS `even_qr` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `even_qr`;

-- --------------------------------------------------------
-- Bảng: account
-- --------------------------------------------------------
CREATE TABLE `account` (
    `user_id` INT(11) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20) DEFAULT NULL,
    `role` ENUM('user','organizer') DEFAULT 'user',
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Bảng: chat_logs
-- --------------------------------------------------------
CREATE TABLE `chat_logs` (
    `chat_id` INT(11) NOT NULL AUTO_INCREMENT,
    `user_id` INT(11) NOT NULL,
    `message` TEXT NOT NULL,
    `sender` ENUM('user','bot') NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    PRIMARY KEY (`chat_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_created_at` (`created_at`),
    CONSTRAINT `chat_logs_fk_user` FOREIGN KEY (`user_id`) REFERENCES `account` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Bảng: events
-- --------------------------------------------------------
CREATE TABLE `events` (
    `event_id` INT(11) NOT NULL AUTO_INCREMENT,
    `organizer_id` INT(11) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT DEFAULT NULL,
    `location` VARCHAR(255) DEFAULT NULL,
    `start_time` DATETIME NOT NULL,
    `end_time` DATETIME NOT NULL,
    `category` VARCHAR(100) DEFAULT NULL,
    `max_participants` INT(11) DEFAULT NULL CHECK (`max_participants` >= 0),
    `status` ENUM('draft','published','cancelled') DEFAULT 'draft',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    PRIMARY KEY (`event_id`),
    KEY `idx_organizer_id` (`organizer_id`),
    KEY `idx_status` (`status`),
    KEY `idx_start_time` (`start_time`),
    CONSTRAINT `events_fk_organizer` FOREIGN KEY (`organizer_id`) REFERENCES `account` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Bảng: registrations
-- --------------------------------------------------------
CREATE TABLE `registrations` (
    `registration_id` INT(11) NOT NULL AUTO_INCREMENT,
    `event_id` INT(11) NOT NULL,
    `user_id` INT(11) NOT NULL,
    `status` ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    PRIMARY KEY (`registration_id`),
    UNIQUE KEY `uniq_event_user` (`event_id`,`user_id`),
    KEY `idx_event_id` (`event_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_status` (`status`),
    CONSTRAINT `registrations_fk_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`) ON DELETE CASCADE,
    CONSTRAINT `registrations_fk_user` FOREIGN KEY (`user_id`) REFERENCES `account` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Bảng: tickets
-- --------------------------------------------------------
CREATE TABLE `tickets` (
    `ticket_id` INT(11) NOT NULL AUTO_INCREMENT,
    `registration_id` INT(11) NOT NULL,
    `qr_code` TEXT NOT NULL,
    `issued_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    PRIMARY KEY (`ticket_id`),
    KEY `idx_registration_id` (`registration_id`),
    CONSTRAINT `tickets_fk_registration` FOREIGN KEY (`registration_id`) REFERENCES `registrations` (`registration_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Bảng: checkins
-- --------------------------------------------------------
CREATE TABLE `checkins` (
    `checkin_id` INT(11) NOT NULL AUTO_INCREMENT,
    `ticket_id` INT(11) NOT NULL,
    `event_id` INT(11) NOT NULL,
    `checkin_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    `device_info` VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (`checkin_id`),
    UNIQUE KEY `uniq_ticket_event` (`ticket_id`,`event_id`),
    KEY `idx_ticket_id` (`ticket_id`),
    KEY `idx_event_id` (`event_id`),
    CONSTRAINT `checkins_fk_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`ticket_id`) ON DELETE CASCADE,
    CONSTRAINT `checkins_fk_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Bảng: feedbacks
-- --------------------------------------------------------
CREATE TABLE `feedbacks` (
    `feedback_id` INT(11) NOT NULL AUTO_INCREMENT,
    `event_id` INT(11) NOT NULL,
    `user_id` INT(11) NOT NULL,
    `rating` TINYINT(4) DEFAULT NULL CHECK (`rating` BETWEEN 1 AND 5),
    `comment` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    PRIMARY KEY (`feedback_id`),
    UNIQUE KEY `uniq_event_user_feedback` (`event_id`,`user_id`),
    KEY `idx_event_id` (`event_id`),
    KEY `idx_user_id` (`user_id`),
    CONSTRAINT `feedbacks_fk_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`) ON DELETE CASCADE,
    CONSTRAINT `feedbacks_fk_user` FOREIGN KEY (`user_id`) REFERENCES `account` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Bảng: notifications
-- --------------------------------------------------------
CREATE TABLE `notifications` (
    `notification_id` INT(11) NOT NULL AUTO_INCREMENT,
    `user_id` INT(11) NOT NULL,
    `event_id` INT(11) DEFAULT NULL,
    `title` VARCHAR(200) DEFAULT NULL,
    `message` TEXT NOT NULL,
    `status` ENUM('unread','read') DEFAULT 'unread',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    PRIMARY KEY (`notification_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_event_id` (`event_id`),
    KEY `idx_status` (`status`),
    CONSTRAINT `notifications_fk_user` FOREIGN KEY (`user_id`) REFERENCES `account` (`user_id`) ON DELETE CASCADE,
    CONSTRAINT `notifications_fk_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
