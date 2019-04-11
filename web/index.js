const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'https://d547fae43622419b9dc6a012c385b410@sentry.io/1432720' });
app.use(Sentry.Handlers.requestHandler());

app.use(Sentry.Handlers.errorHandler());

app.use(function onError(err, req, res, next) {
    res.statusCode = 500;
    res.end(res.sentry + '\n');
});

app.listen(80, 'nfe.fr', () => {
    console.log('Started on port 80');
});

app.use(bodyParser.json());

app.use('/', express.static('./public'));

app.use('/declaration_incidents', express.static('./public/html/declaration_incidents.html'));
app.use('/connexion_back_office', express.static('./public/html/connexion_back_office.html'));
app.use('/backoffice', express.static('./public/html/backoffice'));

app.post('/login', (req, res) => {
    if (req.body.email_nfe == 'francois@mail.fr' && req.body.nfeid == "FBAS" && req.body.password == "axios") {
        res.json({
            success: true
        });
    } else {
        res.json({
            success: false
        });
    }
});