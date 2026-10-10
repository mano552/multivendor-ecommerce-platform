const { Sequelize } = require("sequelize");
require("dotenv").config();

// Hosted Postgres (Render, Neon, Supabase, etc.) usually requires SSL for external
// connections. Set DB_SSL=true in that environment's .env to enable it; leave unset
// for a local Postgres install, which normally doesn't use SSL.
const useSSL = process.env.DB_SSL === "true";

let sequelize;

if (process.env.DATABASE_URL) {
  // IMPORTANT: we parse DATABASE_URL ourselves with Node's built-in URL class and pass
  // discrete values to Sequelize, rather than handing it the raw connection string.
  // Sequelize's own connection-string parser has a known bug with some hosted Postgres
  // providers (Neon in particular) using SCRAM/SASL auth, where the password ends up
  // undefined and the connection fails with:
  //   "SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string"
  // Parsing it ourselves and always passing an explicit String(password) avoids that bug.
  const parsed = new URL(process.env.DATABASE_URL);
  const sslRequired = useSSL || parsed.searchParams.get("sslmode") === "require";

  sequelize = new Sequelize(
    decodeURIComponent(parsed.pathname.replace(/^\//, "")), // database name
    decodeURIComponent(parsed.username),                    // user
    String(decodeURIComponent(parsed.password)),            // password — force to string
    {
      host: parsed.hostname,
      port: parsed.port || 5432,
      dialect: "postgres",
      logging: false,
      dialectOptions: sslRequired
        ? { ssl: { require: true, rejectUnauthorized: false } }
        : {},
    }
  );
} else {
  // Separate fields, used when DATABASE_URL isn't set (e.g. local Postgres, or Render's
  // render.yaml blueprint which injects these individually from its managed database).
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    String(process.env.DB_PASSWORD),
    {
      host: process.env.DB_HOST || "127.0.0.1",
      port: process.env.DB_PORT || 5432,
      dialect: "postgres",
      logging: false,
      dialectOptions: useSSL
        ? { ssl: { require: true, rejectUnauthorized: false } }
        : {},
    }
  );
}

module.exports = sequelize;