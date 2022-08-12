import request from "supertest";
import app from "../../src/app";
import { Fragment, hash } from "../../src/model/fragments";

describe("PUT /v1/fragments/:id", () => {
   // If the request is missing the Authorization header, it should be forbidden
   test("unauthenticated requests are denied", () =>
      request(app).get("/v1/fragments").expect(401));
   // If the wrong username/password pair are used (no such user), it should be forbidden
   test("incorrect credentials are denied", async () => {
      await request(app)
         .get("/v1/fragments")
         .auth("invalid@email.com", "incorrect_password")
         .expect(401);
   });

   test("authenticated users can update a fragment with the same content type", async () => {
      const ownerId = "user1@email.com";
      const fragment = new Fragment({
         ownerId: hash(ownerId),
         type: "text/plain",
      });
      await fragment.setData(Buffer.from("This is a test"));
      await fragment.save();
      const res = await request(app)
         .put(`/v1/fragments/${fragment.id}`)
         .auth(ownerId, "password1")
         .set("content-type", "text/plain")
         .send("hello");

      expect(res.statusCode).toBe(200);
      expect(res.body.fragment.id).toBe(fragment.id);
   });

   test("Updating fragment with different content type will throw error", async () => {
      const ownerId = "user1@email.com";
      const fragment = new Fragment({
         ownerId: hash(ownerId),
         type: "text/plain",
      });
      await fragment.setData(Buffer.from("This is a test"));
      await fragment.save();

      const res = await request(app)
         .put(`/v1/fragments/${fragment.id}`)
         .auth(ownerId, "password1")
         .set("content-type", "text/html")
         .send("hello");

      expect(res.statusCode).toBe(404);
   });
});
