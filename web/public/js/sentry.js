function Sentry(app) {
    const Sentry = require('@sentry/node');

    Sentry.init({ dsn: 'https://d547fae43622419b9dc6a012c385b410@sentry.io/1432720' });

    app.use(Sentry.Handlers.requestHandler());

    app.use(Sentry.Handlers.errorHandler());

    app.use(function onError(err, req, res, next) {
        res.statusCode = 500;
        res.end(res.sentry + '\n');
    });
}

module.exports = Sentry;