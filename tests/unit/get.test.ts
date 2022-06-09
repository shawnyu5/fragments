import request from "supertest";
// import { enviroment } from "../../enviroments/enviroment";
import app from "../../src/app";
import { Fragment } from "../../src/model/fragments";

describe("GET /v1/fragments", () => {
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

   // Using a valid username/password pair should give a success result with a .fragments array
   test("authenticated users get a fragments array", async () => {
      const res = await request(app)
         .get("/v1/fragments")
         .auth("user1@email.com", "password1");

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe("ok");
      expect(Array.isArray(res.body.fragments)).toBe(true);
   });

   test("authenticated users get a fragments array with their fragments", async () => {
      const fragment = new Fragment({
         ownerId: "user1@email.com",
         type: "text/plain",
      });
      await fragment.save();

      const res = await request(app)
         .get("/v1/fragments")
         .auth("user1@email.com", "password1");

      const body = res.body;
      expect(body.fragments.length).toBe(1);
      expect(body.fragments).toContainEqual(fragment);
   });
});

describe("GET /v1/fragments/:id", () => {
   test("unauthenticated requests are denied", () => {
      request(app).get("/v1/fragments").expect(401);
   });

   test("authenicated users get their fragments", async () => {
      // create a new fragment and save it
      const ownerId = "user1@email.com";
      const fragment = new Fragment({
         ownerId: ownerId,
         type: "text/plain",
      });
      await fragment.save();
      const id = fragment.id;
      const res = await request(app)
         .get(`/v1/fragments/${id}`)
         .auth("user1@email.com", "password1");

      const body = JSON.parse(res.text);
      // check we got a fragment back
      expect(body).toBeTruthy();
      // check the fragment is the one we created
      expect(body.fragments.id).toBe(id);
   });
});
