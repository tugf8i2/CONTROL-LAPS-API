import "dotenv/config";

const requiredEnvironmentValue = (name: string): string => {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Falta configurar la variable ${name} en el archivo .env.`);
  }
  return value;
};

const allowedSslModes = new Set([
  "disable",
  "allow",
  "prefer",
  "require",
  "verify-ca",
  "verify-full"
]);

export const createDatabaseUrl = (): string => {
  const host = requiredEnvironmentValue("PGHOST");
  const portValue = requiredEnvironmentValue("PGPORT");
  const database = requiredEnvironmentValue("PGDATABASE");
  const username = requiredEnvironmentValue("PGUSER");
  const password = requiredEnvironmentValue("PGPASSWORD");
  const port = Number(portValue);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PGPORT debe ser un puerto válido entre 1 y 65535.");
  }

  const schema = process.env.PGSCHEMA?.trim() || "public";
  const sslMode = process.env.PGSSLMODE?.trim() || "disable";

  if (!allowedSslModes.has(sslMode)) {
    throw new Error("PGSSLMODE no contiene un modo TLS válido de PostgreSQL.");
  }

  const url = new URL("postgresql://localhost");
  url.hostname = host;
  url.port = String(port);
  url.pathname = `/${database}`;
  url.username = username;
  url.password = password;
  url.searchParams.set("schema", schema);
  if (sslMode !== "disable") {
    url.searchParams.set("sslmode", sslMode);
  }

  return url.toString();
};