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
answer_display VARCHAR(64) NOT NULL,
question_id INT REFERENCES question(question_id)
);

CREATE TABLE account_answer(
account_id INT REFERENCES account(account_id),
question_id INT REFERENCES question(question_id),
answer_id INT REFERENCES answer(answer_id),
PRIMARY KEY(account_id, question_id)
);

INSERT INTO question (question_id, question) VALUES (1, 'How many people live with you?');
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (1, 'I live by myself', 14);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (1, 'I live with one other person', 12);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (1, 'I live with two other people', 10);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (1, 'I live with three other people', 8);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (1, 'I live with four other people', 6);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (1, 'I live with five other people', 4);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (1, 'I live with more than five other people', 2);

INSERT INTO question (question_id, question) VALUES (2, 'What size house do you live in?');
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (2, 'I live in a large house', 10);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (2, 'I live in a medium house', 7);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (2, 'I live in a small house', 4);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (2, 'I live in a apartment', 2);

INSERT INTO question (question_id, question) VALUES (3, 'What option best describes your eating habbits?');
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (3, 'I eat meat on every day', 10);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (3, 'I eat meat a few times a week', 8);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (3, 'I''m vegatarian', 8);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (3, 'I''m vegatarian', 4);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (3, 'I''m vegan', 2);

INSERT INTO question (question_id, question) VALUES (4, 'How many times do you use your washing machine?');
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (4, 'More than nine times a week', 3);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (4, 'Four to nine times a week', 2);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (4, 'One to three times a week', 1);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (4, 'I don''t have a washing machine', 0);

INSERT INTO question (question_id, question) VALUES (5, 'How many times do you use your dishwasher?');
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (5, 'More than nine times a week', 3);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (5, 'Four to nine times a week', 2);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (5, 'One to three times a week', 1);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (5, 'I don''t have a dishwasher', 0);

INSERT INTO question (question_id, question) VALUES (6, 'What distance do you travel by private car per week?');
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (6, 'More than 285 miles (15,000 miles per year)', 12);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (6, 'Between 190 and 285 miles (10,000 to 15,000 miles per year)', 10);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (6, 'Between 20 and 190 miles (1,000 to 10,000 miles per year)', 8);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (6, 'Between 20 and 190 miles (1,000 to 10,000 miles per year)', 6);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (6, 'Less than 20 miles (Less than 1,000 miles per year)', 4);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (6, 'I do not travel by private car', 0);

INSERT INTO question (question_id, question) VALUES (7, 'What distance do you travel by public transport per week?');
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (7, 'More than 385 miles (20,000 miles per year)', 12);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (7, 'Between 285 and 385 miles (15,000 to 20,000 miles per year)', 10);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (7, 'Between 190 and 285 miles (10,000 to 15,000 miles per year)', 8);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (7, 'Between 20 and 190 miles (1,000 to 10,000 miles per year)', 6);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (7, 'Between 20 and 190 miles (1,000 to 10,000 miles per year)', 4);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (7, 'Less than 20 miles (Less than 1,000 miles per year)', 2);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (7, 'I do not travel by public transport', 0);

INSERT INTO question (question_id, question) VALUES (8, 'How many bags of rubbish do you produce per week?');
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (8, 'More than three', 50);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (8, 'three', 40);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (8, 'two', 30);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (8, 'one', 20);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (8, 'Half a bag or less', 5);

INSERT INTO question (question_id, question) VALUES (9, 'Do you recycle paper?');
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (9, 'No', 4);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (9, 'Yes', 0);

INSERT INTO question (question_id, question) VALUES (10, 'Do you recycle plastic?');
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (10, 'No', 4);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (10, 'Yes', 0);

INSERT INTO question (question_id, question) VALUES (11, 'Do you recycle glass?');
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (11, 'No', 4);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (11, 'Yes', 0);

INSERT INTO question (question_id, question) VALUES (12, 'Do you recycle food waste? (e.g. composte)');
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (12, 'No', 4);
INSERT INTO answer (question_id, answer_display, answer_value) VALUES (12, 'Yes', 0);

END TRANSACTION;