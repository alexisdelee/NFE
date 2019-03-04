export default {
    api: {
        port: process.env["NFE_API_PORT"] || 3001
    },
    database: {
        host: process.env["NFE_DATABASE_HOST"] || "localhost",
        user: process.env["NFE_DATABASE_USER"] || "root",
        password: process.env["NFE_DATABASE_PASSWORD"] || "",
        name: process.env["NFE_DATABASE_NAME"] || "nfe"
    }
}
