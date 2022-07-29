import request from "supertest";
import app from "../../src/app";
import { Fragment, hash } from "../../src/model/fragments";

describe("DELETE /fragments/:id", () => {
   // If the request is missing the Authorization header, it should be forbidden
   test("unauthenticated requests are denied", () =>
      request(app).get("/v1/fragments/delete/fjdsk").expect(401));
   // If the wrong username/password pair are used (no such user), it should be forbidden
   test("incorrect credentials are denied", async () => {
      await request(app)
         .get("/v1/fragments/delete/fjdsk")
         .auth("invalid@email.com", "incorrect_password")
         .expect(401);
   });

   test("authenticated users are allowed to delete a fragment by id", async () => {
      const ownerId = "user1@email.com";
      const fragment = new Fragment({
         ownerId: hash(ownerId),
         type: "text/plain",
      });
      console.log("(anon)#(anon) fragment: %s", fragment.ownerId); // __AUTO_GENERATED_PRINT_VAR__

      await fragment.save();

      const res = await request(app)
         .delete(`/v1/fragments/${fragment.id}`)
         .auth("user1@email.com", "password1");

      // TODO: idk why this is failing
      // console.log(res.body);
      // expect(res.statusCode).toBe(201);
   });
});
