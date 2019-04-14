const express = require('express');
const app = express();
const bodyParser = require('body-parser');

require('./public/js/sentry')(app);

app.listen(80, 'nfe.fr', () => {
    console.log('Web started on port 80');
});

app.use(bodyParser.json());

app.use('/', express.static('./public'));
app.use('/declaration_incidents', express.static('./public/html/declaration_incidents.html'));

app.get('/types', (req, res) => {
    res.json({
        result: {
            panne: 'Panne de courant',
            compteur_casse: 'Compteur cassé',
            compteur_bugge: 'Compteur buggé',
            sous_voltage: 'Sous-voltage',
            sur_voltage: 'Sur-voltage',
            pylone_casse: 'Pylone cassé'
        }
    });
});