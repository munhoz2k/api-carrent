import { hash } from "bcrypt";
import { randomUUID } from "crypto";
import request from "supertest";
import { Connection } from "typeorm";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";

let connection: Connection;
describe("", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = randomUUID();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license, avatar)
    values('${id}', 'admin', 'admin@carrent.com', '${password}', true, 'now()', 'XXXXXX', 'a')`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to list all categories", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "admin@carrent.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    await request(app)
      .post("/categories")
      .send({
        name: "Category Supertest",
        description: "Category Created from Supertest Script",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    await request(app)
      .post("/categories")
      .send({
        name: "Category Supertest 2",
        description: "Category Created from Supertest Script 2",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app).get("/categories");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0].name).toEqual("Category Supertest");
  });
});
