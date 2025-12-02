-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  role VARCHAR(100) NOT NULL,
  phone VARCHAR(50),
  location VARCHAR(255),
  bio TEXT,
  login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP,
  date_joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add demo users with different departments and roles if they don't exist
INSERT INTO users (email, password_hash, first_name, last_name, department, role)
VALUES 
-- Finance Department User
-- Password: Finance123
('finance@example.com', '$2a$10$Xt9Qs.pQoLQDMTQOdMF5/.wCq.LRy.Dy.EWnHoiNltWPZANXrGIXO', 'John', 'Financial', 'Finance Department', 'Finance Manager'),

-- Lands Department User
-- Password: Lands123
('lands@example.com', '$2a$10$Xt9Qs.pQoLQDMTQOdMF5/.wCq.LRy.Dy.EWnHoiNltWPZANXrGIXO', 'Mary', 'Surveyor', 'Lands Department', 'Lands Commissioner'),

-- Admin Department User
-- Password: Admin123
('admin@example.com', '$2a$10$Xt9Qs.pQoLQDMTQOdMF5/.wCq.LRy.Dy.EWnHoiNltWPZANXrGIXO', 'David', 'Administrator', 'IT Department', 'System Administrator'),

-- Health Department User
-- Password: Health123
('health@example.com', '$2a$10$Xt9Qs.pQoLQDMTQOdMF5/.wCq.LRy.Dy.EWnHoiNltWPZANXrGIXO', 'Sarah', 'Medical', 'Health Department', 'Health Director')

ON CONFLICT (email) DO UPDATE 
SET 
password_hash = EXCLUDED.password_hash,
first_name = EXCLUDED.first_name,
last_name = EXCLUDED.last_name,
department = EXCLUDED.department,
role = EXCLUDED.role;
