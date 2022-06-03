import { hash } from "bcrypt";
import { randomUUID } from "crypto";
import request from "supertest";
import { Connection } from "typeorm";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";

let connection: Connection;
describe("Create Category Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = randomUUID();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license, avatar)
    values('${id}', 'admin', 'admin@carent.com', '${password}', true, 'now()', 'XXXXXX', 'a')`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new category", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "admin@carent.com",
      password: "admin",
    });

    const { refreshToken } = responseToken.body;

    const response = await request(app)
      .post("/categories")
      .send({
        name: "Category Supertest",
        description: "Category Created from Supertest Script",
      })
      .set({
        Authorization: `Bearer ${refreshToken}`,
      });

    expect(response.status).toBe(201);
  });

  it("should not be able to create a new category if name already exists", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "admin@carent.com",
      password: "admin",
    });

    const { refreshToken } = responseToken.body;

    const response = await request(app)
      .post("/categories")
      .send({
        name: "Category Supertest",
        description: "Category Created from Supertest Script",
      })
      .set({
        Authorization: `Bearer ${refreshToken}`,
      });

    expect(response.status).toBe(400);
  });
});
