#!/usr/bin/env node

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const fs = require('fs');

chai.use(chaiHttp);
const expect = chai.expect;
const agent = chai.request.agent(app);

describe("HTTP requests", () => {
    it("Get invalid url", done => {
        agent
            .get("/a")
            .end((err, res) => {
                expect(err).equals(null);
                expect(res).to.have.status(404);
                done();
            })
    });

    describe("pages", () => {
        it("Get index page", done => {
            agent
                .get("/")
                .end((err, res) => {
                    expect(err).equals(null);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("Get create account page", done => {
            agent
                .get("/createAccount.html")
                .end((err, res) => {
                    expect(err).equals(null);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("Get login page", done => {
            agent
                .get("/login.html")
                .end((err, res) => {
                    expect(err).equals(null);
                    expect(res).to.have.status(404);
                    done();
                });
        });

        it("Get results page", done => {
            agent
                .get("/result.html")
                .end((err, res) => {
                    expect(err).equals(null);
                    expect(res).to.have.status(404);
                    done();
                });
        });

        it("Get events page", done => {
            agent
                .get("/event.html")
                .end((err, res) => {
                    expect(err).equals(null);
                    expect(res).to.have.status(404);
                    done();
                });
        });

        it("Get question page", done => {
            agent
                .get("/question.html")
                .end((err, res) => {
                    expect(err).equals(null);
                    expect(res).to.have.status(404);
                    done();
                });
        });

    });
});
