const test = require('tape');
const request = require('request');
const supertest = require('supertest');

test('GET /success should work ok', function (t) {
    request.get('http://localhost:3000/success', function(err, res){
        if (err) {
            return t.end('Request has failed');
        }
        t.equal(res.statusCode, 200);
        t.end();
    });
});

test('GET /fail should fail', function (t) {
    request.get('http://localhost:3000/fail', function (err, res){
        t.notOk(err, 'Request should succeed');
        if (err) {
            return t.end();
        }
        t.equal(res.statusCode, 400, 'Expecting 401 because api is custom');
        t.equal(res.statusMessage, 'Bad Request');
        t.end();
    });
});

test('POST /signup should get a token', function (t) {
    const server = supertest.agent('http://localhost:3000');

    t.plan(4);

    server
        .post('/signup')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, response) => {
            t.notOk(err);
            t.ok(response, 'Should have valid response');
            t.ok(response.body, 'Should have a body in the response');
            t.ok(response.body.token, 'should have a token in the response');
        });
});

test('POST /win without a token should fail', function (t) {
    const server = supertest.agent('http://localhost:3000');

    server
        .post('/win')
        .expect(400)
        .end((err, response) => {
            t.notOk(err);
            t.equal(response.text, 'No token provided');
            t.end();
        });
});

test('POST /win with a wrong token should fail', function (t) {
    const server = supertest.agent('http://localhost:3000');

    server
        .post('/win')
        .send({ token: 'Blue' })
        .expect(400)
        .end((err, response) => {
            t.notOk(err);
            t.equal(response.text, 'Wrong token');
            t.end();
        });
});

test('POST /win with correct token', function (t) {
    const server = supertest.agent('http://localhost:3000');

    db.insert({ user: gilad, password: '123456' });

    server
        .post('/signup')
        .end((err, response) => {
            const token = response.body.token;
            server
                .post('/win')
                .send({ token: token })
                .expect(200)
                .end((err, response) => {
                    t.notOk(err);
                    t.end();
                });
        });

});
