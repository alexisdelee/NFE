const fs = require("fs");
const { sh, cli } = require("tasksfile");

const config = require("../webconfig");

const ROOT_SQL = "kernel";
const ROOT_TMP = "tmp";
const DB       = config.database;

function dev_import_db() {
    sh("mysql -u root < nfe.sql");
}

function prod_import_db() {
    // create a copy for mysql < 5.6
    var contents = fs.readFileSync(`${ROOT_SQL}/layers.sql`, "utf8");

    contents = contents.replace(/created datetime default current_timestamp/g, "created timestamp default '0000-00-00 00:00:00'");
    contents = contents.replace(/updated datetime/g, "updated timestamp");

    fs.writeFileSync(`${ROOT_TMP}/layers.sql`, contents);

    sh(`mysql -h ${DB.production.host} -P ${DB.production.port} -u\"${DB.production.user}\" -p\"${DB.production.password}\" \"${DB.production.dbname}\" < tmp/layers.sql`);
    fs.unlinkSync(`${ROOT_TMP}/layers.sql`);

    // dump database
    sh(`mysqldump --no-create-info --skip-triggers -u ${DB.development.user} nfe > ${ROOT_TMP}/data.sql`);

    var contents = fs.readFileSync(`${ROOT_TMP}/data.sql`, "utf8");

    contents = contents.replace(/LOCK TABLES `[a-zA-Z_]+` WRITE;/g, "");
    contents = contents.replace(/UNLOCK TABLES;/g, "");

    fs.writeFileSync(`${ROOT_TMP}/data.sql`, contents);

    sh(`mysql -h ${DB.production.host} -P ${DB.production.port} -u\"${DB.production.user}\" -p\"${DB.production.password}\" \"${DB.production.dbname}\" < ${ROOT_TMP}/data.sql`);
    fs.unlinkSync(`${ROOT_TMP}/data.sql`);
}

cli({
    dev_import_db,
    prod_import_db
});
