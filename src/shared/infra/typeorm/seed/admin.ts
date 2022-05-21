import { hash } from "bcrypt";
import { randomUUID } from "crypto";

import createConnection from "..";

async function create() {
  const connection = await createConnection("localhost");

  const id = randomUUID();
  const password = await hash("admin", 8);

  await connection.query(
    `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license, avatar)
    values('${id}', 'admin', 'admin@carent.com', '${password}', true, 'now()', 'XXXXXX', 'a')`
  );
}

create().then(() => console.log("User admin created!"));
