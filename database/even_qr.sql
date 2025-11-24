SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Cơ sở dữ liệu: `even_qr`
--

-- --------------------------------------------------------
-- Bảng account
-- --------------------------------------------------------
CREATE TABLE `account` (
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('user','organizer','admin') DEFAULT 'user',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



-- --------------------------------------------------------
-- Bảng chat_logs
-- --------------------------------------------------------
CREATE TABLE `chat_logs` (
  `chat_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `sender` enum('user','bot') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Bảng checkin_history
-- --------------------------------------------------------
CREATE TABLE `checkin_history` (
  `id` int(11) NOT NULL,
  `ticket_id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` bigint(20) NOT NULL,
  `checkin_time` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Bảng event
-- --------------------------------------------------------
CREATE TABLE `event` (
  `event_id` bigint(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `start_time` datetime(6) DEFAULT NULL,
  `end_time` datetime(6) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'DRAFT',
  `max_participants` int(11) DEFAULT NULL,
  `organizer_id` int(11) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT current_timestamp(6),
  `updated_at` datetime(6) DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



-- --------------------------------------------------------
-- Bảng event_ticket
-- --------------------------------------------------------
CREATE TABLE `event_ticket` (
  `ticket_id` bigint(20) NOT NULL,
  `event_id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `occupation` varchar(100) DEFAULT NULL,
  `ticket_type` varchar(50) NOT NULL,
  `note` text DEFAULT NULL,
  `registered_at` datetime(6) DEFAULT current_timestamp(6),
  `cancelled` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



-- --------------------------------------------------------
-- Bảng feedbacks
-- --------------------------------------------------------
CREATE TABLE `feedbacks` (
  `feedback_id` int(11) NOT NULL,
  `event_id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` tinyint(4) DEFAULT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 👉 GỘP PHẦN THÊM CỘT MỚI
ALTER TABLE `feedbacks` 
ADD COLUMN `organizer_reply` TEXT DEFAULT NULL AFTER `comment`,
ADD COLUMN `organizer_reply_at` TIMESTAMP NULL DEFAULT NULL AFTER `organizer_reply`;

-- --------------------------------------------------------
-- Bảng notifications
-- --------------------------------------------------------
CREATE TABLE `notifications` (
  `notification_id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` bigint(20) DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `message` text NOT NULL,
  `status` enum('unread','read') DEFAULT 'unread',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- --------------------------------------------------------
-- Bảng user_event_behavior
-- --------------------------------------------------------
CREATE TABLE `user_event_behavior` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` bigint(20) NOT NULL,
  `behavior_type` enum('VIEW','CLICK') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Indexes
-- --------------------------------------------------------

ALTER TABLE `account`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

ALTER TABLE `chat_logs`
  ADD PRIMARY KEY (`chat_id`),
  ADD KEY `user_id` (`user_id`);

ALTER TABLE `checkin_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ticket_id` (`ticket_id`),
  ADD KEY `event_id` (`event_id`),
  ADD KEY `checkin_history_fk_user` (`user_id`);

ALTER TABLE `event`
  ADD PRIMARY KEY (`event_id`),
  ADD KEY `organizer_id` (`organizer_id`);

ALTER TABLE `event_ticket`
  ADD PRIMARY KEY (`ticket_id`),
  ADD KEY `event_id` (`event_id`),
  ADD KEY `user_id` (`user_id`);

ALTER TABLE `feedbacks`
  ADD PRIMARY KEY (`feedback_id`),
  ADD UNIQUE KEY `uniq_event_user_feedback` (`event_id`,`user_id`),
  ADD KEY `event_id` (`event_id`),
  ADD KEY `user_id` (`user_id`);

ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `event_id` (`event_id`);

ALTER TABLE `user_event_behavior`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `event_id` (`event_id`);

-- --------------------------------------------------------
-- AUTO INCREMENT
-- --------------------------------------------------------

ALTER TABLE `account`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `chat_logs`
  MODIFY `chat_id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `checkin_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `event`
  MODIFY `event_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `event_ticket`
  MODIFY `ticket_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `feedbacks`
  MODIFY `feedback_id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `notifications`
  MODIFY `notification_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `user_event_behavior`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- --------------------------------------------------------
-- FOREIGN KEYS
-- --------------------------------------------------------

ALTER TABLE `chat_logs`
  ADD CONSTRAINT `chat_logs_fk_user` FOREIGN KEY (`user_id`) REFERENCES `account` (`user_id`) ON DELETE CASCADE;

ALTER TABLE `checkin_history`
  ADD CONSTRAINT `checkin_history_fk_event` FOREIGN KEY (`event_id`) REFERENCES `event` (`event_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `checkin_history_fk_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `event_ticket` (`ticket_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `checkin_history_fk_user` FOREIGN KEY (`user_id`) REFERENCES `account` (`user_id`) ON DELETE CASCADE;

ALTER TABLE `event`
  ADD CONSTRAINT `event_fk_organizer` FOREIGN KEY (`organizer_id`) REFERENCES `account` (`user_id`) ON DELETE CASCADE;

ALTER TABLE `event_ticket`
  ADD CONSTRAINT `event_ticket_fk_event` FOREIGN KEY (`event_id`) REFERENCES `event` (`event_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `event_ticket_fk_user` FOREIGN KEY (`user_id`) REFERENCES `account` (`user_id`) ON DELETE CASCADE;

ALTER TABLE `feedbacks`
  ADD CONSTRAINT `feedbacks_fk_event` FOREIGN KEY (`event_id`) REFERENCES `event` (`event_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `feedbacks_fk_user` FOREIGN KEY (`user_id`) REFERENCES `account` (`user_id`) ON DELETE CASCADE;

ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_fk_event` FOREIGN KEY (`event_id`) REFERENCES `event` (`event_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `notifications_fk_user` FOREIGN KEY (`user_id`) REFERENCES `account` (`user_id`) ON DELETE CASCADE;

ALTER TABLE `user_event_behavior`
  ADD CONSTRAINT `user_event_behavior_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `account` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_event_behavior_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `event` (`event_id`) ON DELETE CASCADE;

COMMIT;
