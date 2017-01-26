var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var morgan = require('morgan');

const token = 'Lancelot';

app.use(bodyParser.json());
app.use(morgan());

app.get('/success', function (req, res) {
    res.status(200).send('OK')
})

app.get('/fail', function (req, res) {
    res.status(400).send('Fail')
})

app.post('/signup', function (req, res) {
    res.status(200).send({ token });
})

app.post('/win', function (req, res) {
    if (!req || !req.body || !req.body.token)  {
        return res.status(400).send('No token provided');
    }
    if (req.body.token !== token) {
        return res.status(400).send('Wrong token');
    }
    res.status(200).send('Success');
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});
