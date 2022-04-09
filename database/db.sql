CREATE DATABASE dadastudios;

USE dadastudios;

CREATE TABLE users(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(30),
    email VARCHAR(100),
    password VARCHAR(200),
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

DESCRIBE users;

INSERT INTO users(username, email, password) VALUES('test', 'test@test.com', '1');

SELECT * FROM  users;