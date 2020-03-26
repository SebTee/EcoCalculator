#!/usr/bin/env node

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const pool = require('../database/dbClient');

chai.use(chaiHttp);
const expect = chai.expect;
const agent = chai.request.agent(app);

function deleteAccounts(emails, done) { //recursively deletes accounts based on email list
    if (emails.length === 0) {
        done();
    } else {
        pool.query("SELECT account_id FROM account WHERE account_email = $1", [emails[0]])
            .then(res => {
                if (res.rows.length === 0) {
                    deleteAccounts(emails.slice(1), done);
                } else {
                    pool.query("DELETE FROM account_answer WHERE account_id = $1", [res.rows[0].account_id])
                        .then(() => {
                            pool.query("DELETE FROM account WHERE account_id = $1", [res.rows[0].account_id])
                                .then(() => {
                                    pool.query("DELETE FROM polluting_event WHERE account_id = $1", [res.rows[0].account_id])
                                        .then(() => {
                                            deleteAccounts(emails.slice(1), done);
                                        });
                                });
                        });
                }
            });
    }
}

before(done => { //Delete the test accounts before starting
    deleteAccounts(["test@test.com", "test2@test.com"], done)
});

describe("HTTP requests", () => {

    it("gets invalid url", done => {
        agent
            .get("/a")
            .end((err, res) => {
                expect(err).equals(null);
                expect(res).to.have.status(404);
                done();
            });
    });

    describe("pages", () => {
        it("gets index page", done => {
            agent
                .get("/")
                .end((err, res) => {
                    expect(err).equals(null);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("gets create account page", done => {
            agent
                .get("/createAccount.html")
                .end((err, res) => {
                    expect(err).equals(null);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("gets login page", done => {
            agent
                .get("/signIn.html")
                .end((err, res) => {
                    expect(err).equals(null);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("gets results page", done => {
            agent
                .get("/results.html")
                .end((err, res) => {
                    expect(err).equals(null);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("gets events page", done => {
            agent
                .get("/events.html")
                .end((err, res) => {
                    expect(err).equals(null);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("gets question page", done => {
            agent
                .get("/questionnaire.html")
                .end((err, res) => {
                    expect(err).equals(null);
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe("API calls", () => {
        describe("Create account", () => {
            it("creates account successfully", done => {
                agent
                    .post('/api/v1/account/create')
                    .send({
                        username: 'ecocalculator',
                        password: 'ecocalculator',
                        email: 'test@test.com'
                    })
                    .end((err, res) => {
                        expect(err).equals(null);
                        expect(res).to.have.status(201);
                        expect(agent).to.have.cookie('connect.sid');
                        done();
                    });
            });

            it("fails to create an account with an email that is already used", done => {
                agent
                    .post('/api/v1/account/create')
                    .send({
                        username: 'ecocalculator',
                        password: 'ecocalculator',
                        email: 'test@test.com'
                    })
                    .end((err, res) => {
                        expect(err).equals(null);
                        expect(res).to.have.status(409);
                        done();
                    });
            });

            it("fails to create an account with an invalid email address", done => {
                agent
                    .post('/api/v1/account/create')
                    .send({
                        username: 'ecocalculator',
                        password: 'ecocalculator',
                        email: 'testtest.com'
                    })
                    .end((err, res) => {
                        expect(err).equals(null);
                        expect(res).to.have.status(400);
                        done();
                    });
            });
        });

        describe("Login", () => {
            it("logs in successfully", done => {
                agent
                    .post('/api/v1/account/login')
                    .send({
                        email: 'test@test.com',
                        password: 'ecocalculator'
                    })
                    .end((err, res) => {
                        expect(err).equals(null);
                        expect(res).to.have.status(200);
                        expect(agent).to.have.cookie('connect.sid');
                        done();
                    });
            });

            it("logs in with incorrect password", done => {
                agent
                    .post('/api/v1/account/login')
                    .send({
                        email: 'test@test.com',
                        password: 'qwerty'
                    })
                    .end((err, res) => {
                        expect(err).equals(null);
                        expect(res).to.have.status(401);
                        done();
                    });
            });

            it("logs in with email that is not used for an account", done => {
                agent
                    .post('/api/v1/account/login')
                    .send({
                        email: 'does@not.exist',
                        password: 'ecocalculator'
                    })
                    .end((err, res) => {
                        expect(err).equals(null);
                        expect(res).to.have.status(404);
                        done();
                    });
            });
        });

        describe("Get questions", () => {
            it("gets the questions", done => {
                agent
                    .get('/api/v1/question')
                    .end((err, res) => {
                        expect(err).equals(null);
                        expect(res).to.have.status(200);
                        done();
                    });
            });
        });

        describe("Answer questions", () => {
            it("successfully answers the questions", done => {
                agent
                    .post('/api/v1/question')
                    .send({
                        "answers": [
                            {
                                "questionId": 1,
                                "answerId": 1
                            },
                            {
                                "questionId": 2,
                                "answerId": 8
                            },
                            {
                                "questionId": 3,
                                "answerId": 12
                            },
                            {
                                "questionId": 4,
                                "answerId": 16
                            },
                            {
                                "questionId": 5,
                                "answerId": 20
                            },
                            {
                                "questionId": 6,
                                "answerId": 24
                            },
                            {
                                "questionId": 7,
                                "answerId": 29
                            },
                            {
                                "questionId": 8,
                                "answerId": 35
                            },
                            {
                                "questionId": 9,
                                "answerId": 40
                            },
                            {
                                "questionId": 10,
                                "answerId": 42
                            },
                            {
                                "questionId": 11,
                                "answerId": 44
                            },
                            {
                                "questionId": 12,
                                "answerId": 46
                            }
                        ]
                    })
                    .end((err, res) => {
                        expect(err).equals(null);
                        expect(res).to.have.status(200);
                        done();
                    });
            });

            it("answers too few questions", done => {
                agent
                    .post('/api/v1/question')
                    .send({
                        "answers": [
                            {
                                "questionId": 1,
                                "answerId": 1
                            },
                            {
                                "questionId": 2,
                                "answerId": 8
                            },
                            {
                                "questionId": 3,
                                "answerId": 12
                            },
                            {
                                "questionId": 4,
                                "answerId": 16
                            },
                            {
                                "questionId": 5,
                                "answerId": 20
                            },
                            {
                                "questionId": 6,
                                "answerId": 24
                            },
                            {
                                "questionId": 7,
                                "answerId": 29
                            },
                            {
                                "questionId": 8,
                                "answerId": 35
                            },
                            {
                                "questionId": 9,
                                "answerId": 40
                            },
                            {
                                "questionId": 10,
                                "answerId": 42
                            },
                            {
                                "questionId": 11,
                                "answerId": 44
                            }
                        ]
                    })
                    .end((err, res) => {
                        expect(err).equals(null);
                        expect(res).to.have.status(400);
                        done();
                    });
            });

            it("answers too many questions", done => {
                agent
                    .post('/api/v1/question')
                    .send({
                        "answers": [
                            {
                                "questionId": 1,
                                "answerId": 1
                            },
                            {
                                "questionId": 2,
                                "answerId": 8
                            },
                            {
                                "questionId": 3,
                                "answerId": 12
                            },
                            {
                                "questionId": 4,
                                "answerId": 16
                            },
                            {
                                "questionId": 5,
                                "answerId": 20
                            },
                            {
                                "questionId": 6,
                                "answerId": 24
                            },
                            {
                                "questionId": 7,
                                "answerId": 29
                            },
                            {
                                "questionId": 8,
                                "answerId": 35
                            },
                            {
                                "questionId": 9,
                                "answerId": 40
                            },
                            {
                                "questionId": 10,
                                "answerId": 42
                            },
                            {
                                "questionId": 11,
                                "answerId": 44
                            },
                            {
                                "questionId": 12,
                                "answerId": 46
                            },
                            {
                                "questionId": 13,
                                "answerId": 48
                            }
                        ]
                    })
                    .end((err, res) => {
                        expect(err).equals(null);
                        expect(res).to.have.status(400);
                        done();
                    });
            });

            it("gives an invalid answer", done => {
                agent
                    .post('/api/v1/question')
                    .send({
                        "answers": [
                            {
                                "questionId": 1,
                                "answerId": 100
                            },
                            {
                                "questionId": 2,
                                "answerId": 8
                            },
                            {
                                "questionId": 3,
                                "answerId": 12
                            },
                            {
                                "questionId": 4,
                                "answerId": 16
                            },
                            {
                                "questionId": 5,
                                "answerId": 20
                            },
                            {
                                "questionId": 6,
                                "answerId": 24
                            },
                            {
                                "questionId": 7,
                                "answerId": 29
                            },
                            {
                                "questionId": 8,
                                "answerId": 35
                            },
                            {
                                "questionId": 9,
                                "answerId": 40
                            },
                            {
                                "questionId": 10,
                                "answerId": 42
                            },
                            {
                                "questionId": 11,
                                "answerId": 44
                            },
                            {
                                "questionId": 12,
                                "answerId": 46
                            }
                        ]
                    })
                    .end((err, res) => {
                        expect(err).equals(null);
                        expect(res).to.have.status(400);
                        done();
                    });
            });
        });

        describe("Get saved results", () => {
            it("gets saved results", done => {
                agent
                    .get('/api/v1/result')
                    .end((err, res) => {
                        expect(err).equals(null);
                        expect(res).to.have.status(200);
                        done();
                    });
            });

            it("fails to get save results since they're using an unauthenticated client", done => {
                chai.request(app)
                    .get('/api/v1/result')
                    .end((err, res) => {
                        expect(err).equals(null);
                        expect(res).to.have.status(401);
                        done();
                    });
            });

            it("fails since the new account has not yet answered the questions", done => {
                const newAgent = chai.request.agent(app);
                newAgent
                    .post('/api/v1/account/create')
                    .send({
                        username: 'ecocalculator',
                        password: 'ecocalculator',
                        email: 'test2@test.com'
                    })
                    .end((err, res) => {
                        newAgent
                            .get('/api/v1/result')
                            .end((err, res) => {
                                expect(err).equals(null);
                                expect(res).to.have.status(404);
                                newAgent.close();
                                done();
                            });
                    });
            });
        });

        describe("Add events", () => {
            it("successfully adds an event", done => {
                agent
                    .post("/api/v1/event")
                    .send({
                        "name": "event",
                        "start": "2018-10-10 14:48",
                        "end": "2018-10-10 15:00"
                    })
                    .end((err, res) => {
                        expect(err).equals(null);
                        expect(res).to.have.status(201);
                        done();
                    });
            });

            it("fails to add an event since the dates are in the wrong order", done => {
                agent
                    .post("/api/v1/event")
                    .send({
                        "name": "event",
                        "start": "2018-10-10 15:00",
                        "end": "2018-10-10 14:48"
                    })
                    .end((err, res) => {
                        expect(err).equals(null);
                        expect(res).to.have.status(400);
                        done();
                    });
            });

            it("fails to add an event since a date isn't in a valid format", done => {
                agent
                    .post("/api/v1/event")
                    .send({
                        "name": "event",
                        "start": "qwerty",
                        "end": "2018-10-10 14:48"
                    })
                    .end((err, res) => {
                        expect(err).equals(null);
                        expect(res).to.have.status(400);
                        done();
                    });
            });

            it("fails to add an event since a date isn't in a valid format", done => {
                chai.request(app)
                    .post("/api/v1/event")
                    .send({
                        "name": "event",
                        "start": "2018-10-10 15:00",
                        "end": "2018-10-10 14:48"
                    })
                    .end((err, res) => {
                        expect(err).equals(null);
                        expect(res).to.have.status(401);
                        done();
                    });
            });
        });

        describe("Get events", () => {
            it("successfully gets list of user's events", done => {
                agent
                    .get("/api/v1/event")
                    .end((err, res) => {
                        expect(err).equals(null);
                        expect(res).to.have.status(200);
                        done();
                    });
            });

            it("fails to get events since the agent's not logged in", done => {
                chai.request(app)
                    .get("/api/v1/event")
                    .end((err, res) => {
                        expect(err).equals(null);
                        expect(res).to.have.status(401);
                        done();
                    });
            });
        });

        describe("Delete events", () => {
            it("successfully deletes an event", done => {
                agent
                    .get("/api/v1/event")
                    .end((getErr, getRes) => {
                        agent
                            .del("/api/v1/event?id=" + getRes.body.events[0].id)
                            .end((err, res) => {
                                expect(err).equals(null);
                                expect(res).to.have.status(200);
                                done();
                            });
                    });
            });

            it("fails to delete an event by giving an invalid ID", done => {
                agent
                    .del("/api/v1/event?id=1")
                    .end((err, res) => {
                        expect(err).equals(null);
                        expect(res).to.have.status(404);
                        done();
                    });
            });

            it("fails to delete an event since agent isn't logged in", done => {
                chai.request(app)
                    .del("/api/v1/event?id=1")
                    .end((err, res) => {
                        expect(err).equals(null);
                        expect(res).to.have.status(401);
                        done();
                    });
            });
        });
    });
});

after(done => {
    pool.end();
    agent.close();
    done();
});