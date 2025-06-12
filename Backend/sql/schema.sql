CREATE TABLE IF NOT EXISTS attendees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  profile_image TEXT,
  passwordResetToken VARCHAR(255),
  passwordResetTokenExpiration BIGINT
);

CREATE TABLE IF NOT EXISTS admin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS managers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    resume_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    passwordResetToken VARCHAR(255),
    passwordResetTokenExpiration BIGINT;
);


CREATE TABLE IF NOT EXISTS events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_name VARCHAR(255) NOT NULL,
    image VARCHAR(500),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(100) NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    manager_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_manager FOREIGN KEY (manager_id)
        REFERENCES managers(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS event_attendees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  attendee_id INT NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  CONSTRAINT fk_attendee FOREIGN KEY (attendee_id) REFERENCES attendees(id) ON DELETE CASCADE,
  UNIQUE (event_id, attendee_id) -- to prevent duplicate joins
);

CREATE TABLE IF NOT EXISTS feedback (
  id INT PRIMARY KEY AUTO_INCREMENT,
  rating INT NOT NULL,
  text TEXT,
  event_id INT NOT NULL,
  attendee_id INT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id),
  CONSTRAINT fk_feedback_attendee FOREIGN KEY (attendee_id) REFERENCES attendees(id)
);
