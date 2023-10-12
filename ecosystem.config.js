module.exports = {
  apps : [{
    name: "CrowsKonnect",
    script: "./server.js",
    instances: "max",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}