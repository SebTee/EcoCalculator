BEGIN TRANSACTION;

CREATE TABLE account(
account_id SERIAL PRIMARY KEY,
account_name VARCHAR(32) NOT NULL,
account_password VARCHAR(256) NOT NULL,
account_email VARCHAR(345) NOT NULL UNIQUE
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

CREATE TABLE account_answer(
account_id INT REFERENCES account(account_id),
question_id INT REFERENCES question(question_id),
answer_id INT REFERENCES answer(answer_id),
PRIMARY KEY(account_id, question_id)
);

END TRANSACTION;