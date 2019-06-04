const express = require("express");
const RouterManager = {};
//const session = require('express-session');

var connected = false;

const bodyParser = require("body-parser");

RouterManager.attach = app => {
    app.use(bodyParser.json());

    app.post("/login", (req, res) => {
        if (req.body.email_nfe == "a" && req.body.nfeid == "a" && req.body.password == "a") {
            connected = true;

            res.json({
                success: true
            });
        } else {
            res.json({
                success: false
            });
        }
    });

    app.get("/logout", (req, res) => {
        connected = false;
        res.status(200).end();
    });

    app.get("/", (req, res, next) => {
        if (!connected) {
            res.redirect("/connection");
        } else {
            next();
        }
    });

    app.use("/", express.static("./public"));
    app.use("/connection", express.static("./public/html/connection.html"));

    app.use("/incidents", require('./incidents'));
    app.use("/interventions", require('./interventions'));
    app.use("/agents", express.static("./public/html/agents"));
    app.use("/holidays", express.static("./public/html/holidays"));
};

module.exports = RouterManager;