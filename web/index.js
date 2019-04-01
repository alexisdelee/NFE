const express = require('express');

const app = express();

app.listen(80, 'nfe.fr', () => {
    console.log('Started on port 80');
});

app.use('/', express.static('./public'));
app.use('/declaration_incidents', express.static('./public/html/declaration_incidents.html'));
app.use('/connexion_back_office', express.static('./public/html/connexion_back_office.html'));