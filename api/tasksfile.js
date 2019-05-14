const fs = require("fs");
const { sh, cli } = require("tasksfile");

function dev_import_db() {
    sh("mysql -u root < nfe.sql");
}

function prod_import_db() {
    var contents = fs.readFileSync("kernel/layers.sql", "utf8");

    contents = contents.replace(/created datetime default current_timestamp/g, "created timestamp default '0000-00-00 00:00:00'");
    contents = contents.replace(/updated datetime/g, "updated timestamp");

    // create a copy for mysql < 5.6
    fs.writeFileSync("kernel/layers_prod.sql", contents);

    var contents = fs.readFileSync("nfe.sql", "utf8");

    contents = contents.split("\n").slice(5).join("\n");

    contents = contents.replace("nfe", "sql2291748");
    contents = contents.replace("kernel/layers.sql", "kernel/layers_prod.sql");
    contents = contents.replace("source kernel/functions.sql;", "-- source kernel/functions.sql;");
    // contents = contents.replace("source kernel/procs.sql;", "-- source kernel/procs.sql;");
    contents = contents.replace("source kernel/triggers.sql;", "-- source kernel/triggers.sql;");

    fs.writeFileSync("nfe_prod.sql", contents);
    
    sh("mysql -h sql2.freemysqlhosting.net -P 3306 -u sql2291748 -p < nfe_prod.sql");

    // fs.unlinkSync("nfe_prod.sql");
    // fs.unlinkSync("kernel/layers_prod.sql");
}

cli({
    dev_import_db,
    prod_import_db
});
