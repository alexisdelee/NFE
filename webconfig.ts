export default {
    application: {
        port: process.env["nfe_application_port"] || 3001
    },
    database: {
        host: process.env["nfe_database_host"] || "localhost",
        user: process.env["nfe_database_user"] || "root",
        password: process.env["nfe_database_password"] || "",
        name: process.env["nfe_database_name"] || "nfe"
    }
}
