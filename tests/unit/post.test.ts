import request from "supertest";
import app from "../../src/app";

describe("POST /v1/fragments", () => {
   test("should return a 201 response", async () => {
      const response = await request(app)
         .post("/v1/fragments")
         .set({ "content-type": "text/plain" })
         .auth("user1@email.com", "password1")
         .send("This is a test");

      expect(response.status).toBe(201);
      expect(response.text).toBeTruthy();
   });
});
