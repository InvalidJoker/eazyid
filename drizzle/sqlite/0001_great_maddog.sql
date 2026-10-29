CREATE TABLE `asset` (
	`id` text PRIMARY KEY NOT NULL,
	`content_type` text NOT NULL,
	`data` text NOT NULL,
	`created_at` integer NOT NULL
);
