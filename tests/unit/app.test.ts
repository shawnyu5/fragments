import request from "supertest";
import app from "../../src/app";

describe("GET non existant route", () => {
   test("It should return 404", async () => {
      const response = await request(app).get("/not-found");
      expect(response.status).toBe(404);
   });
});
