-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 09, 2022 at 05:16 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `divein`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_notifications` (IN `id_user` INT, IN `id_post` INT)  BEGIN
  DECLARE a INT;
 	DECLARE done INT DEFAULT FALSE;
  DECLARE cur1 CURSOR FOR SELECT follower_id FROM follows WHERE followed_id = id_user;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
  OPEN cur1;
  read_loop: LOOP
    FETCH cur1 INTO a;
    IF done THEN
      LEAVE read_loop;
    END IF;
    INSERT INTO notifications_posts VALUES( a,id_post );
  END LOOP;
  CLOSE cur1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_recomandations` (IN `id_user` INT)  SELECT  users.id, users.email, users.phone_number, users.firstname, users.lastname, users.image FROM users,posts WHERE users.id = posts.id_user 
AND (posts.id_user NOT IN ( SELECT followed_id FROM follows WHERE follower_id = id_user) )
AND posts.type_post IN
(SELECT * FROM
(SELECT type_post FROM posts WHERE posts.id IN (
SELECT * FROM 
(SELECT posts.id FROM likes,posts WHERE likes.post = posts.id AND likes.id_user = id_user ORDER BY likes.date LIMIT 30) AS sq )
 GROUP BY type_post ORDER BY count(type_post) LIMIT 2) AS sq2 ) GROUP BY users.id ORDER BY posts.date LIMIT 3$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `blocked_users`
--

CREATE TABLE `blocked_users` (
  `id_user` int(11) NOT NULL COMMENT 'id de l''utilisateur qui bloque',
  `id_blocked` int(11) NOT NULL COMMENT 'id de l''utilisateur bloqué'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `blocked_users`
--

INSERT INTO `blocked_users` (`id_user`, `id_blocked`) VALUES
(11, 12);

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_post` int(11) NOT NULL,
  `content` varchar(300) COLLATE utf8_unicode_ci NOT NULL,
  `id_comment` int(11) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `seen` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='pour eviter le probleme de recurcivité on utilise un id aleatoire pour le commentaire \net on utilise une clé etrangere vers la meme table de manniere optionelle';

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` int(11) NOT NULL,
  `object` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `message` varchar(300) COLLATE utf8_unicode_ci NOT NULL,
  `id_user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `follows`
--

CREATE TABLE `follows` (
  `follower_id` int(11) NOT NULL,
  `followed_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `follows`
--

INSERT INTO `follows` (`follower_id`, `followed_id`) VALUES
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(2, 1),
(2, 5),
(3, 1),
(3, 4),
(3, 5),
(4, 1),
(4, 3),
(5, 1),
(5, 2),
(5, 4),
(11, 3),
(11, 12),
(11, 14),
(12, 11),
(14, 4),
(14, 11),
(28, 4),
(28, 11),
(28, 12),
(28, 14);

-- --------------------------------------------------------

--
-- Table structure for table `groupmessages`
--

CREATE TABLE `groupmessages` (
  `id_user` int(11) NOT NULL,
  `group` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `message` varchar(300) COLLATE utf8_unicode_ci NOT NULL,
  `image` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `groupmessages`
--

INSERT INTO `groupmessages` (`id_user`, `group`, `date`, `message`, `image`, `id`) VALUES
(11, 15, '2022-01-30 03:09:14', 'rien', NULL, 75),
(14, 15, '2022-01-30 03:11:11', 'message de groupe', NULL, 76),
(28, 15, '2022-01-30 03:11:16', 'je suis un membre', NULL, 77),
(14, 15, '2022-02-06 17:22:29', 'message 2', NULL, 79),
(14, 15, '2022-02-06 17:22:45', 'yella un probleme waqil', NULL, 80),
(14, 15, '2022-02-06 17:23:13', 'groupe B', NULL, 81);

-- --------------------------------------------------------

--
-- Table structure for table `groupmessagesreact`
--

CREATE TABLE `groupmessagesreact` (
  `id_groupmessage` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `reaction` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `groupmessagesreact`
--

INSERT INTO `groupmessagesreact` (`id_groupmessage`, `id_user`, `reaction`) VALUES
(75, 11, 2),
(75, 14, 1),
(75, 28, 1),
(76, 11, 1);

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`id`, `id_user`, `name`) VALUES
(14, 11, 'group A'),
(15, 28, 'GROUP B');

-- --------------------------------------------------------

--
-- Table structure for table `groupusers`
--

CREATE TABLE `groupusers` (
  `group` int(11) NOT NULL,
  `id_user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `groupusers`
--

INSERT INTO `groupusers` (`group`, `id_user`) VALUES
(14, 3),
(14, 12),
(14, 14),
(15, 11),
(15, 14),
(15, 28);

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `id_user` int(11) NOT NULL,
  `id_post` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `seen` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` (`id_user`, `id_post`, `date`, `seen`) VALUES
(11, 91, '2022-02-09 15:58:04', 0),
(11, 93, '2022-02-09 16:02:24', 0),
(11, 94, '2022-02-09 16:03:42', 0);

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `id_sender` int(11) NOT NULL,
  `id_reciever` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `message` varchar(300) COLLATE utf8_unicode_ci DEFAULT NULL,
  `state` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'default : false\ntrue : lu\nfalse: non lu',
  `react_sender` int(11) DEFAULT NULL,
  `react_reciever` int(11) DEFAULT NULL,
  `image` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='faire en sorte que les deux champ message et image ne soit  pas utilisé en meme temp';

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `id_sender`, `id_reciever`, `date`, `message`, `state`, `react_sender`, `react_reciever`, `image`) VALUES
(238, 28, 11, '2022-01-30 03:32:42', 'qsd', 1, NULL, NULL, NULL),
(239, 11, 14, '2022-01-30 03:32:52', 'qsdqsd', 1, NULL, NULL, NULL),
(240, 28, 11, '2022-01-30 03:32:55', 'qsd', 1, NULL, NULL, NULL),
(241, 28, 14, '2022-01-30 03:33:05', 'sdqsd', 1, NULL, NULL, NULL),
(242, 28, 14, '2022-01-30 03:33:14', 'qsd', 1, NULL, NULL, NULL),
(243, 11, 14, '2022-01-30 03:33:57', 'aze', 1, NULL, NULL, NULL),
(244, 28, 14, '2022-01-30 03:34:03', 'qs', 1, NULL, NULL, NULL),
(245, 28, 11, '2022-01-30 03:34:11', 'qsdqsd', 1, NULL, NULL, NULL),
(246, 11, 14, '2022-01-30 03:34:21', 'qsdqsd', 1, NULL, NULL, NULL),
(247, 14, 11, '2022-01-30 03:34:27', 'qsdqsd', 1, NULL, NULL, NULL),
(248, 28, 14, '2022-01-30 03:34:36', 'qsdqsd', 1, NULL, NULL, NULL),
(249, 11, 14, '2022-01-30 17:12:39', 'qsdqsd', 1, NULL, NULL, NULL),
(250, 11, 14, '2022-02-06 13:52:49', 'azeaze', 1, NULL, NULL, NULL),
(251, 14, 11, '2022-02-06 13:52:59', 'azeaze', 1, NULL, NULL, NULL),
(252, 14, 11, '2022-02-06 13:53:19', 'azeaze', 1, NULL, NULL, NULL),
(253, 11, 14, '2022-02-06 13:54:16', 'azeaze', 1, NULL, NULL, NULL),
(254, 14, 11, '2022-02-06 13:54:20', 'qsdqsd', 1, NULL, NULL, NULL),
(255, 11, 14, '2022-02-06 13:54:24', 'sqdqsd', 1, NULL, NULL, NULL),
(256, 14, 11, '2022-02-06 14:07:44', 'aaaaaaaaaaaaaaaaaaaaaaaaa', 1, NULL, NULL, NULL),
(257, 11, 14, '2022-02-06 14:10:02', 'qsdqsd', 1, NULL, NULL, NULL),
(258, 14, 11, '2022-02-06 14:10:21', 'qsdsqdsqd', 1, NULL, NULL, NULL),
(259, 14, 11, '2022-02-06 14:10:27', 'qsdqsd', 1, NULL, NULL, NULL),
(260, 14, 11, '2022-02-06 14:11:59', 'azeaze', 1, NULL, NULL, NULL),
(261, 11, 14, '2022-02-06 14:12:05', 'azeaze', 1, NULL, NULL, NULL),
(262, 14, 11, '2022-02-06 14:12:19', 'azeaze', 1, NULL, NULL, NULL),
(263, 14, 11, '2022-02-06 14:12:20', 'azeaze', 1, NULL, NULL, NULL),
(264, 11, 14, '2022-02-06 14:12:24', 'azeaze', 1, NULL, NULL, NULL),
(265, 11, 14, '2022-02-06 14:12:26', 'aze', 1, NULL, NULL, NULL),
(266, 14, 11, '2022-02-06 14:12:37', 'azeaze', 1, NULL, NULL, NULL),
(267, 14, 11, '2022-02-06 14:12:42', 'azeaze', 1, NULL, NULL, NULL),
(268, 14, 11, '2022-02-06 14:28:20', 'azeaze', 1, NULL, NULL, NULL),
(269, 14, 11, '2022-02-06 14:28:25', 'aaaaaaaaaaaaaaaaaa', 1, NULL, NULL, NULL),
(270, 11, 14, '2022-02-09 16:07:28', 'qsdsqd', 0, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `multimedia`
--

CREATE TABLE `multimedia` (
  `id_post` int(11) NOT NULL,
  `url` varchar(200) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications_posts`
--

CREATE TABLE `notifications_posts` (
  `id_user` int(11) NOT NULL,
  `id_post` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `postreports`
--

CREATE TABLE `postreports` (
  `id_post` int(11) NOT NULL,
  `id_user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `content` varchar(300) COLLATE utf8_unicode_ci NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_post` int(11) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `type_post` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `content`, `id_user`, `id_post`, `date`, `type_post`) VALUES
(91, 'qsdqsdqsdqsdqsdq', 11, NULL, '2022-02-09 15:58:03', NULL),
(92, 'qdsqdqsd', 11, NULL, '2022-02-09 16:00:36', NULL),
(93, 'sqdqsdqsd', 11, NULL, '2022-02-09 16:02:23', NULL),
(94, 'sqdqsd', 11, NULL, '2022-02-09 16:03:41', NULL),
(95, 'qsdqsd', 11, NULL, '2022-02-09 16:11:06', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `posttype`
--

CREATE TABLE `posttype` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `posttype`
--

INSERT INTO `posttype` (`id`, `name`) VALUES
(1, 'Sport'),
(2, 'Divertissement'),
(3, 'Politique'),
(4, 'Créativité'),
(5, 'Affaire'),
(6, 'Citations');

-- --------------------------------------------------------

--
-- Table structure for table `reactions`
--

CREATE TABLE `reactions` (
  `id` int(11) NOT NULL,
  `image` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'chemin de l''image de reaction sur le disque'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `reactions`
--

INSERT INTO `reactions` (`id`, `image`) VALUES
(1, 'url'),
(2, 'url2');

-- --------------------------------------------------------

--
-- Table structure for table `records`
--

CREATE TABLE `records` (
  `id_user` int(11) NOT NULL,
  `id_post` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstname` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `lastname` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `birthday` date NOT NULL,
  `gender` tinyint(1) NOT NULL COMMENT 'true : male\nfalse : female',
  `password` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'date d''inscription',
  `image` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'photo de profil url',
  `email` varchar(256) COLLATE utf8_unicode_ci DEFAULT NULL,
  `phone_number` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `biographie` varchar(300) COLLATE utf8_unicode_ci DEFAULT NULL,
  `token` varchar(30) COLLATE utf8_unicode_ci NOT NULL COMMENT 'token de verification du compte si null alors le compte est verifié',
  `token_password` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'token de reinitialisation du mot de passe',
  `password_date` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'date de derniere modification du mot de passe',
  `image_couverture` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'photo de couverture de l''utilisateur'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `birthday`, `gender`, `password`, `date`, `image`, `email`, `phone_number`, `biographie`, `token`, `token_password`, `password_date`, `image_couverture`) VALUES
(1, 'Mehdi', 'Meghira', '1999-12-27', 1, 'mehdi', '2021-12-23 09:39:07', NULL, 'meghiramehdi@gmail.com', NULL, 'Just let me alone with my Laptop !', '', NULL, '2022-01-03 20:54:08', NULL),
(2, 'Hocine', 'Fedani', '1999-01-01', 1, 'hocine', '2021-12-23 09:45:26', NULL, 'fedanihocine@gmail.com', NULL, 'Programmer, gammer, sport', '', NULL, '2022-01-03 20:54:08', NULL),
(3, 'Atek', 'Amine', '1995-01-05', 1, 'amine', '2021-12-23 09:45:26', NULL, 'atekamine@gmail.com', NULL, 'et oui y a pas mieux que la famille!', '', NULL, '2022-01-03 20:54:08', NULL),
(4, 'Kheloui', 'Amghis', '2000-02-05', 1, 'amghis', '2021-12-23 09:45:26', NULL, 'khelouiamghis@gmail.com', NULL, 'Pas de temps a perdre just learn !', '', NULL, '2022-01-03 20:54:08', NULL),
(5, 'Zedek ', 'Nassim', '1999-08-10', 1, 'nassim', '2021-12-23 09:45:26', NULL, 'zeddeknassim@gmail.com', NULL, 'Profite de la vie le temps passe vite !', '', NULL, '2022-01-03 20:54:08', NULL),
(9, 'ici', 'je suis ', '2021-12-14', 1, '$2b$10$sT.mntsvykFYRKCGGEVkU.hXU7GMJSQl1QkkzaBXx/oLSio7igLni', '2021-12-24 22:24:27', NULL, 'ici@gmail.com', NULL, NULL, '', NULL, '2022-01-03 20:54:08', NULL),
(11, 'amghis', 'kheloui', '2001-05-18', 0, '$2b$10$6V4jY1T6GhhcS4Bwjcas.e5O7pF6zUkJkQ6JsLchaUr4qPx9dQ3DO', '2019-12-31 23:00:00', 'http://localhost:5000/images/Capture_d’écran_2022-01-25_140220.png1643818936078.png', 'ka@gmail.com', NULL, 'bio', '', NULL, '2022-01-07 17:26:11', 'http://localhost:5000/images/Capture_d’écran_2022-01-25_140220.png1643818812542.png'),
(12, 'a2', 'kheloui', '0000-00-00', 0, '$2b$10$vUcG7ghSOBATpcyDY3Mxuen2mp86F4QQawbENw5vpO4cinsK2sjQ.', '0000-00-00 00:00:00', NULL, 'ak@gmail.com', NULL, NULL, '', NULL, '2022-01-08 16:24:43', NULL),
(14, 'kheloui', 'amghis', '2009-11-30', 1, '$2b$10$GOmIpXP35.QBh8BnXgbvBOFT4Yunu0rJLHibHt61GgQPjHJ69DBVy', '2022-01-24 23:00:00', NULL, 'kaa@gmail.com', NULL, NULL, '', NULL, '2022-01-25 18:07:32', NULL),
(28, 'nom', 'prenom', '0000-00-00', 0, '$2b$10$lM0Kv/i8LtCYF0qQIpLzDeXiWFWKAE7.O.KB78aMCpHg.mZSrHRhu', '0000-00-00 00:00:00', NULL, 'kaaa@gmail.com', NULL, NULL, '', NULL, '2022-01-30 03:02:05', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `userstypes`
--

CREATE TABLE `userstypes` (
  `id_user` int(11) NOT NULL,
  `id_type` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='type de posts que l''utilisateur aime a utiliser dans les recomendations (2eme proposition)';

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blocked_users`
--
ALTER TABLE `blocked_users`
  ADD PRIMARY KEY (`id_user`,`id_blocked`),
  ADD KEY `fk_blocked_users_users_blocked` (`id_blocked`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_comments_comments` (`id_comment`),
  ADD KEY `fk_comments_posts_comment` (`id_post`),
  ADD KEY `fk_comments_users` (`id_user`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_contacts_users` (`id_user`);

--
-- Indexes for table `follows`
--
ALTER TABLE `follows`
  ADD PRIMARY KEY (`follower_id`,`followed_id`),
  ADD KEY `fk_follows_users_followed` (`followed_id`);

--
-- Indexes for table `groupmessages`
--
ALTER TABLE `groupmessages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_groupmessages_groupss` (`group`);

--
-- Indexes for table `groupmessagesreact`
--
ALTER TABLE `groupmessagesreact`
  ADD PRIMARY KEY (`id_groupmessage`,`id_user`),
  ADD KEY `fk_groupmessagesreact_users` (`id_user`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_groupss_users` (`id_user`);

--
-- Indexes for table `groupusers`
--
ALTER TABLE `groupusers`
  ADD PRIMARY KEY (`group`,`id_user`),
  ADD KEY `idx_groupusers` (`group`),
  ADD KEY `idx_groupusers_0` (`id_user`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id_post`,`id_user`),
  ADD KEY `fk_likes_users_email` (`id_user`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_messages_reactions_reciever` (`react_reciever`),
  ADD KEY `fk_messages_users_reciever` (`id_reciever`),
  ADD KEY `fk_messages_reactions_sender` (`react_sender`),
  ADD KEY `fk_messages_users` (`id_sender`);

--
-- Indexes for table `multimedia`
--
ALTER TABLE `multimedia`
  ADD PRIMARY KEY (`id_post`,`url`);

--
-- Indexes for table `notifications_posts`
--
ALTER TABLE `notifications_posts`
  ADD PRIMARY KEY (`id_user`,`id_post`),
  ADD KEY `fk_notifications_posts_users_post` (`id_post`);

--
-- Indexes for table `postreports`
--
ALTER TABLE `postreports`
  ADD PRIMARY KEY (`id_post`,`id_user`),
  ADD KEY `fk_postreports_users` (`id_user`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_posts_posttype` (`type_post`),
  ADD KEY `posts_fk_delete_id_post` (`id_post`),
  ADD KEY `fk_posts_users_id_user` (`id_user`);

--
-- Indexes for table `posttype`
--
ALTER TABLE `posttype`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reactions`
--
ALTER TABLE `reactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `records`
--
ALTER TABLE `records`
  ADD PRIMARY KEY (`id_user`,`id_post`),
  ADD KEY `fk_records_posts` (`id_post`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_users` (`email`);

--
-- Indexes for table `userstypes`
--
ALTER TABLE `userstypes`
  ADD PRIMARY KEY (`id_user`,`id_type`),
  ADD KEY `fk_userstypes_posttype` (`id_type`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `groupmessages`
--
ALTER TABLE `groupmessages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=271;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT for table `posttype`
--
ALTER TABLE `posttype`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `blocked_users`
--
ALTER TABLE `blocked_users`
  ADD CONSTRAINT `fk_blocked_users_users` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_blocked_users_users_blocked` FOREIGN KEY (`id_blocked`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_fk_delete_id_post` FOREIGN KEY (`id_post`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_fk_update_id_post` FOREIGN KEY (`id_post`) REFERENCES `posts` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_comments_comments` FOREIGN KEY (`id_comment`) REFERENCES `comments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_comments_posts` FOREIGN KEY (`id_post`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_comments_users` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `contacts`
--
ALTER TABLE `contacts`
  ADD CONSTRAINT `fk_contacts_users` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `follows`
--
ALTER TABLE `follows`
  ADD CONSTRAINT `fk_follows_users_followed` FOREIGN KEY (`followed_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_follows_users_follower` FOREIGN KEY (`follower_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `groupmessages`
--
ALTER TABLE `groupmessages`
  ADD CONSTRAINT `fk_groupmessages_groups` FOREIGN KEY (`group`) REFERENCES `groups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_groupmessages_users` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `groupmessagesreact`
--
ALTER TABLE `groupmessagesreact`
  ADD CONSTRAINT `fk_groupmessagesreact` FOREIGN KEY (`id_groupmessage`) REFERENCES `groupmessages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_groupmessagesreact_users` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `groups`
--
ALTER TABLE `groups`
  ADD CONSTRAINT `fk_groups_users` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `groupusers`
--
ALTER TABLE `groupusers`
  ADD CONSTRAINT `fk_groupusers_groups` FOREIGN KEY (`group`) REFERENCES `groups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_groupusers_users` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `fk_likes_comments` FOREIGN KEY (`id_post`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_likes_users` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `fk_messages_users` FOREIGN KEY (`id_sender`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_messages_users_reciever` FOREIGN KEY (`id_reciever`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_messages_users_sender` FOREIGN KEY (`id_sender`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `multimedia`
--
ALTER TABLE `multimedia`
  ADD CONSTRAINT `fk_multimedia_posts` FOREIGN KEY (`id_post`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `multimedia_fk_delete_id_post` FOREIGN KEY (`id_post`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `multimedia_fk_update_id_post` FOREIGN KEY (`id_post`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `notifications_posts`
--
ALTER TABLE `notifications_posts`
  ADD CONSTRAINT `fk_notifications_posts_posts` FOREIGN KEY (`id_post`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_notifications_posts_users` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_posts_fk_delete_id_post` FOREIGN KEY (`id_post`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notifications_posts_fk_update_id_post` FOREIGN KEY (`id_post`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `postreports`
--
ALTER TABLE `postreports`
  ADD CONSTRAINT `fk_postreports_posts` FOREIGN KEY (`id_post`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_postreports_users` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `fk_posts_posts` FOREIGN KEY (`id_post`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_posts_posttype` FOREIGN KEY (`type_post`) REFERENCES `posttype` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_posts_users_id_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `posts_fk_delete_id_post` FOREIGN KEY (`id_post`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `posts_fk_update_id_post` FOREIGN KEY (`id_post`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `records`
--
ALTER TABLE `records`
  ADD CONSTRAINT `fk_records_posts` FOREIGN KEY (`id_post`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_records_users` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `userstypes`
--
ALTER TABLE `userstypes`
  ADD CONSTRAINT `fk_userstypes_posttype` FOREIGN KEY (`id_type`) REFERENCES `posttype` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_userstypes_users` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;