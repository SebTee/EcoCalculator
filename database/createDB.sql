BEGIN TRANSACTION;

CREATE TABLE members(
user_id SERIAL PRIMARY KEY,
user_name VARCHAR(32) NOT NULL,
user_password VARCHAR(256) NOT NULL,
user_email VARCHAR(345) NOT NULL UNIQUE
);

CREATE TABLE question(
question_id SERIAL PRIMARY KEY,
question VARCHAR(128) NOT NULL UNIQUE
);

CREATE TABLE answer(
answer_id SERIAL PRIMARY KEY,
answer_value INT NOT NULL,
answer_display VARCHAR(16) NOT NULL,
question_id INT REFERENCES question(question_id)
);

CREATE TABLE member_answer(
user_id INT REFERENCES user(user_id),
question_id INT REFERENCES question(question_id),
answer_id INT REFERENCES answer(answer_id),
PRIMARY KEY(user_id, question_id)
);

END TRANSACTION;