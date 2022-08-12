import request from "supertest";
import app from "../../src/app";
import { createReadStream } from "fs";

describe("POST /v1/fragments", () => {
   test("should be able to add a text/plain fragment", async () => {
      const response = await request(app)
         .post("/v1/fragments")
         .set({ "content-type": "text/plain" })
         .auth("user1@email.com", "password1")
         .send("This is a test");

      expect(response.status).toBe(201);
      expect(response.text).toBeTruthy();
   });

   test("should be able to add a text/markdown fragment", async () => {
      const response = await request(app)
         .post("/v1/fragments")
         .set({ "content-type": "text/markdown" })
         .auth("user1@email.com", "password1")
         .send("## This is a test");

      expect(response.status).toBe(201);
      expect(response.text).toBeTruthy();
   });

   test("should be able to add a application/json fragment", async () => {
      const response = await request(app)
         .post("/v1/fragments")
         .set({ "content-type": "application/json" })
         .auth("user1@email.com", "password1")
         .send('{"test":"This is a test"}');

      expect(response.status).toBe(201);
      expect(response.text).toBeTruthy();
   });

   test("should be able to add a image/jpeg fragment", async () => {
      const req = await request(app)
         .post("/v1/fragments")
         .set({ "content-type": "image/jpeg" })
         .auth("user1@email.com", "password1")
         .attach("file", "./tests/random_image.jpeg");

      expect(req.status).toBe(201);
      expect(req.text).toBeTruthy();
   });
});
