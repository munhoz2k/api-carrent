import { Connection, createConnection, getConnectionOptions } from "typeorm";

export default async (host): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      database:
        process.env.NODE_ENV === "test"
          ? "carrentdb_test"
          : defaultOptions.database,
    })
  );
};
