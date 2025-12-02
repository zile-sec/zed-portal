-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL,
  login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create other necessary tables

-- Create transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  transaction_ref VARCHAR(50) UNIQUE NOT NULL,
  department VARCHAR(100) NOT NULL,
  purpose VARCHAR(255) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  recipient VARCHAR(255) NOT NULL,
  recipient_department VARCHAR(100) NOT NULL,
  payment_method VARCHAR(50),
  bank_name VARCHAR(255),
  account_number VARCHAR(50),
  description TEXT,
  sender_id INTEGER REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create transaction_timeline table if it doesn't exist
CREATE TABLE IF NOT EXISTS transaction_timeline (
  id SERIAL PRIMARY KEY,
  transaction_id INTEGER REFERENCES transactions(id),
  status VARCHAR(50) NOT NULL,
  user_id INTEGER REFERENCES users(id),
  department VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create bank_details table if it doesn't exist
CREATE TABLE IF NOT EXISTS bank_details (
  id SERIAL PRIMARY KEY,
  transaction_id INTEGER REFERENCES transactions(id),
  bank_name VARCHAR(255) NOT NULL,
  account_number VARCHAR(50) NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  swift_code VARCHAR(50),
  routing_number VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create attachments table if it doesn't exist
CREATE TABLE IF NOT EXISTS attachments (
  id SERIAL PRIMARY KEY,
  transaction_id INTEGER REFERENCES transactions(id),
  document_id INTEGER REFERENCES documents(id),
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  file_type VARCHAR(50),
  file_size INTEGER,
  uploaded_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create documents table if it doesn't exist
CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_path VARCHAR(255),
  file_type VARCHAR(50),
  file_size INTEGER,
  author_id INTEGER REFERENCES users(id),
  department VARCHAR(100),
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create document_comments table if it doesn't exist
CREATE TABLE IF NOT EXISTS document_comments (
  id SERIAL PRIMARY KEY,
  document_id INTEGER REFERENCES documents(id),
  user_id INTEGER REFERENCES users(id),
  comment TEXT NOT NULL,
  parent_id INTEGER REFERENCES document_comments(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  details TEXT,
  type VARCHAR(50) NOT NULL,
  related_type VARCHAR(50),
  related_id INTEGER,
  status VARCHAR(50) DEFAULT 'unread',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create activity_log table if it doesn't exist
CREATE TABLE IF NOT EXISTS activity_log (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add demo users if they don't exist
INSERT INTO users (email, password_hash, first_name, last_name, department, role)
SELECT 'finance@example.com', 'Finance123', 'Finance', 'User', 'finance', 'manager'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'finance@example.com');

INSERT INTO users (email, password_hash, first_name, last_name, department, role)
SELECT 'lands@example.com', 'Lands123', 'Lands', 'User', 'lands', 'manager'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'lands@example.com');

INSERT INTO users (email, password_hash, first_name, last_name, department, role)
SELECT 'admin@example.com', 'Admin123', 'Admin', 'User', 'admin', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@example.com');

INSERT INTO users (email, password_hash, first_name, last_name, department, role)
SELECT 'health@example.com', 'Health123', 'Health', 'User', 'health', 'manager'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'health@example.com');
