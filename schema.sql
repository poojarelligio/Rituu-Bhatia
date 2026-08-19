-- =====================================================================
-- Rituu Bhatia — Database Schema (MySQL 8+)
-- Run this via phpMyAdmin's SQL tab, or:
--   mysql -u youruser -p yourdatabase < schema.sql
-- =====================================================================

CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(191) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  code VARCHAR(4) NOT NULL DEFAULT '',
  short_description TEXT,
  full_description LONGTEXT,
  image_url VARCHAR(500),
  duration VARCHAR(100),
  price_display VARCHAR(50),
  price_amount INT NOT NULL DEFAULT 0 COMMENT 'paise — server-side source of truth for Razorpay',
  booking_cta_label VARCHAR(100) DEFAULT 'Book a Consultation',
  benefits JSON,
  process_steps JSON,
  stats JSON COMMENT '[{value,label}]',
  audience JSON COMMENT 'array of strings — who this is for',
  meta_title VARCHAR(255),
  meta_description VARCHAR(500),
  status ENUM('draft','published') NOT NULL DEFAULT 'draft',
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(191) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  code VARCHAR(4) NOT NULL DEFAULT '',
  subtitle VARCHAR(500),
  instructor VARCHAR(191) DEFAULT 'Rituu Bhatia',
  duration VARCHAR(100),
  format ENUM('live_online','in_person','self_paced') DEFAULT 'live_online',
  price_display VARCHAR(50),
  price_amount INT NOT NULL DEFAULT 0,
  discount_price_display VARCHAR(50),
  discount_price_amount INT NOT NULL DEFAULT 0,
  schedule VARCHAR(255),
  image_url VARCHAR(500),
  curriculum JSON COMMENT '[{module, lessons: []}]',
  meta_title VARCHAR(255),
  meta_description VARCHAR(500),
  status ENUM('draft','published') NOT NULL DEFAULT 'draft',
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS success_stories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(191) NOT NULL UNIQUE,
  summary VARCHAR(500),
  client_name VARCHAR(191),
  client_name_permitted TINYINT(1) NOT NULL DEFAULT 0,
  challenge TEXT,
  approach TEXT,
  outcome TEXT,
  full_story LONGTEXT,
  testimonial_quote TEXT,
  video_url VARCHAR(500),
  image_url VARCHAR(500),
  related_service_id INT NULL,
  story_date DATE,
  status ENUM('draft','published') NOT NULL DEFAULT 'draft',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_story_service FOREIGN KEY (related_service_id) REFERENCES services(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  quote TEXT NOT NULL,
  rating TINYINT NOT NULL DEFAULT 5,
  featured TINYINT(1) NOT NULL DEFAULT 0,
  video_url VARCHAR(500),
  image_url VARCHAR(500),
  related_service_id INT NULL,
  status ENUM('draft','published') NOT NULL DEFAULT 'published',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_testimonial_service FOREIGN KEY (related_service_id) REFERENCES services(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS faqs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question VARCHAR(500) NOT NULL,
  answer TEXT NOT NULL,
  context ENUM('general','booking') NOT NULL DEFAULT 'general',
  related_service_id INT NULL,
  related_course_id INT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_faq_service FOREIGN KEY (related_service_id) REFERENCES services(id) ON DELETE SET NULL,
  CONSTRAINT fk_faq_course FOREIGN KEY (related_course_id) REFERENCES courses(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(191) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  excerpt VARCHAR(500),
  description LONGTEXT,
  event_date DATE,
  event_time VARCHAR(100),
  location VARCHAR(255),
  speaker VARCHAR(191) DEFAULT 'Rituu Bhatia',
  fee_display VARCHAR(50),
  fee_amount INT NOT NULL DEFAULT 0,
  event_status ENUM('upcoming','past') NOT NULL DEFAULT 'upcoming',
  registration_link VARCHAR(500),
  image_url VARCHAR(500),
  gallery JSON COMMENT 'array of image URLs',
  status ENUM('draft','published') NOT NULL DEFAULT 'draft',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(191) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  excerpt VARCHAR(500),
  resource_type ENUM('ebook','guide','checklist','report','webinar','video') DEFAULT 'ebook',
  file_url VARCHAR(500),
  image_url VARCHAR(500),
  gated TINYINT(1) NOT NULL DEFAULT 1,
  status ENUM('draft','published') NOT NULL DEFAULT 'draft',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS media_features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  publication VARCHAR(191),
  link VARCHAR(500),
  feature_date DATE,
  feature_type ENUM('interview','article','tv','podcast','award') DEFAULT 'article',
  status ENUM('draft','published') NOT NULL DEFAULT 'published',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Blog, with full SEO fields built in (replaces the WP `post` type entirely)
CREATE TABLE IF NOT EXISTS blog_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(191) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  excerpt VARCHAR(500),
  content LONGTEXT,
  featured_image_url VARCHAR(500),
  category VARCHAR(100),
  tags JSON COMMENT 'array of strings',
  author VARCHAR(191) DEFAULT 'Rituu Bhatia',
  meta_title VARCHAR(255),
  meta_description VARCHAR(500),
  og_image_url VARCHAR(500),
  status ENUM('draft','published') NOT NULL DEFAULT 'draft',
  published_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status_published (status, published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_type ENUM('service','free_intro','course') NOT NULL DEFAULT 'service',
  item_id INT NOT NULL,
  booking_date DATE NULL,
  booking_time VARCHAR(10) NULL,
  customer_name VARCHAR(191) NOT NULL,
  customer_email VARCHAR(191) NOT NULL,
  customer_phone VARCHAR(30) NOT NULL,
  notes TEXT,
  amount_paise INT NOT NULL DEFAULT 0,
  status ENUM('PENDING','CONFIRMED','COMPLETED','CANCELLED','REFUNDED') NOT NULL DEFAULT 'PENDING',
  razorpay_order_id VARCHAR(100),
  razorpay_payment_id VARCHAR(100),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_item_date (item_id, booking_date),
  INDEX idx_status (status),
  INDEX idx_order (razorpay_order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  email VARCHAR(191) NOT NULL,
  phone VARCHAR(30),
  service_id INT NULL,
  message TEXT,
  source VARCHAR(100) DEFAULT 'contact_form',
  utm JSON,
  status ENUM('NEW','CONTACTED','INTERESTED','BOOKED','COMPLETED','LOST') NOT NULL DEFAULT 'NEW',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_lead_service FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Single-row settings tables (id is always 1)
CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  whatsapp_community_link VARCHAR(500),
  whatsapp_number VARCHAR(30),
  telegram_link VARCHAR(500),
  phone VARCHAR(30),
  email VARCHAR(191),
  address VARCHAR(500),
  google_maps_embed_url VARCHAR(500),
  newsletter_embed_html TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT IGNORE INTO site_settings (id) VALUES (1);

CREATE TABLE IF NOT EXISTS availability_settings (
  id INT PRIMARY KEY DEFAULT 1,
  working_days JSON COMMENT '[1,2,3,4,5,6] 0=Sun..6=Sat',
  start_time VARCHAR(5) DEFAULT '10:00',
  end_time VARCHAR(5) DEFAULT '19:00',
  slot_minutes INT DEFAULT 30,
  buffer_minutes INT DEFAULT 15,
  blocked_dates JSON,
  blocked_slots JSON
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT IGNORE INTO availability_settings (id, working_days, blocked_dates, blocked_slots)
VALUES (1, '[1,2,3,4,5,6]', '[]', '[]');

CREATE TABLE IF NOT EXISTS assessment_questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question VARCHAR(500) NOT NULL,
  options JSON NOT NULL COMMENT '[{label, points}]',
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS assessment_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  min_score INT NOT NULL,
  max_score INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
