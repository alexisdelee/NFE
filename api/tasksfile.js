const fs = require("fs");
const { sh, cli } = require("tasksfile");

function dev_import_db() {
    sh("mysql -u root < nfe.sql");
}

function prod_import_db() {
    // create a copy for mysql < 5.6
    var contents = fs.readFileSync("kernel/layers.sql", "utf8");

    contents = contents.replace(/created datetime default current_timestamp/g, "created timestamp default '0000-00-00 00:00:00'");
    contents = contents.replace(/updated datetime/g, "updated timestamp");

    fs.writeFileSync("tmp/layers.sql", contents);

    sh("mysql -h sql2.freemysqlhosting.net -P 3306 -u\"sql2291748\" -p\"nT7*dE9%\" \"sql2291748\" < tmp/layers.sql");
    fs.unlinkSync("tmp/layers.sql");

    // dump database
    sh("mysqldump --no-create-info --skip-triggers -u root nfe > tmp/data.sql");

    var contents = fs.readFileSync("tmp/data.sql", "utf8");

    contents = contents.replace(/LOCK TABLES `[a-zA-Z_]+` WRITE;/g, "");
    contents = contents.replace(/UNLOCK TABLES;/g, "");

    fs.writeFileSync("tmp/data.sql", contents);
    return;

    sh("mysql -h sql2.freemysqlhosting.net -P 3306 -u\"sql2291748\" -p\"nT7*dE9%\" \"sql2291748\" < tmp/data.sql");
    fs.unlinkSync("tmp/data.sql");
}

cli({
    dev_import_db,
    prod_import_db
});
