import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";

let connection: Connection;

describe("List Categories Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();

    const adminPassword = await hash("admin", 8);
    const userPassword = await hash("user", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, "isAdmin", driver_license, created_at)
        values('${uuidV4()}', 'admin', 'admin@rentalx.com', '${adminPassword}', true, '123456789', 'now()')`
    );

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, "isAdmin", driver_license, created_at)
        values('${uuidV4()}', 'user', 'user@rentalx.com', '${userPassword}', false, '123456789', 'now()')`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to list all categories", async () => {
    // Arrange
    const adminResponseToken = await request(app).post("/sessions").send({
      email: "admin@rentalx.com",
      password: "admin",
    });

    const { token: adminToken } = adminResponseToken.body;

    const userResponseToken = await request(app).post("/sessions").send({
      email: "user@rentalx.com",
      password: "user",
    });

    const { token: userToken } = userResponseToken.body;

    // Act
    await request(app)
      .post("/categories")
      .send({
        name: "Category Name",
        description: "Category Description",
      })
      .set({
        Authorization: `Bearer ${adminToken}`,
      });

    const response = await request(app)
      .get("/categories")
      .set({
        Authorization: `Bearer ${userToken}`,
      });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.categories.length).toBe(1);
  });
});
