module.exports = {
    apps: [
        {
            name: "ciberamy",
            script: "./index.js",
            watch: true,
            env: {
                "PORT": 3000,
                "NODE_ENV": "development"
            },
            env_production: {
                "PORT": 8000,
                "HOST_DB": "localhost",
                "USER_DB": "admin",
                "PASSWORD_DB": "admin",
                "DATABASE_DB": "ciberamy",
                "PORT_DB": 3306,
                "TZ": "America/Lima",
                "NODE_ENV": "production",
            }
        }
    ]
}