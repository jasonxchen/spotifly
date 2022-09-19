const fs = require("fs");
require("dotenv").config();

module.exports = {
    development: {
        "database": "spotifly_development",
        "host": "127.0.0.1",
        "dialect": "postgres"
    },
    production: {
        use_env_variable: "DATABASE_URI"
    }
}
