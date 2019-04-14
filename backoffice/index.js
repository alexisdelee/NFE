const app = require('express')();

app.listen(81, () => {
    console.log('Back office started on port 81');
});

require('./public/js/sentry')(app);
require('./routes').attach(app);