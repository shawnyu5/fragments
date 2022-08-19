import request from "supertest";
import app from "../../src/app";
import { Fragment, hash } from "../../src/model/fragments";

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

   test("authenticated users get a non expanded fragments array with their fragment id", async () => {
      const ownerId = "user1@email.com";
      const fragment = new Fragment({
         ownerId: hash(ownerId),
         type: "text/plain",
      });

      await fragment.save();

      const res = await request(app)
         .get("/v1/fragments")
         .auth(ownerId, "password1");

      const body = res.body;
      // console.log("(anon)#(anon) body: %s", JSON.stringify(res)); // __AUTO_GENERATED_PRINT_VAR__
      expect(body.fragments.length).toBe(1);
      expect(body.fragments).toContainEqual(fragment.id);
   });

   test("authenticated users get a expanded fragments array with their entire fragment", async () => {
      const fragment = new Fragment({
         ownerId: "user1@email.com",
         type: "text/plain",
      });
      await fragment.save();

      const res = await request(app)
         .get("/v1/fragments/?expand=1")
         .auth("user1@email.com", "password1");

      const body = res.body;
      // expect(body.fragments.length).toBe(1);
      // expect(body.fragments).toContainEqual(fragment);
   });
});

describe("GET /v1/fragments/:id", () => {
   test("unauthenticated requests are denied", async () => {
      await request(app).get("/v1/fragments").expect(401);
   });

   test("authenicated users get their fragment data", async () => {
      // create a new fragment and save it
      const ownerId = "user1@email.com";
      const data = Buffer.from("hello world", "utf-8");
      const fragment = new Fragment({
         ownerId: ownerId,
         type: "text/plain",
      });
      await fragment.setData(data);
      await fragment.save();
      const id = fragment.id;
      const res = await request(app)
         .get(`/v1/fragments/${id}`)
         .auth("user1@email.com", "password1");

      const body = JSON.parse(res.text);
      // check we got a fragment back
      // expect(body.fragments).toBeTruthy();
      // check the data we got back is correct
      // expect(Buffer.from(body.fragments.data)).toEqual(data);
   });
});

describe("GET /v1/fragments/:id/info", () => {
   test("unauthenticated requests are denied", async () => {
      await request(app).get("/v1/fragments/info").expect(401);
   }, 10000);

   test("authenicated users get their fragment metadata", async () => {
      const ownerId = "user1@email.com";
      const fragment = new Fragment({
         ownerId: hash(ownerId),
         type: "text/plain",
      });
      await fragment.save();

      const id = fragment.id;
      const res = await request(app)
         .get(`/v1/fragments/${id}/info`)
         .auth(ownerId, "password1");

      const body = res.body;
      expect(body.fragment).toBeTruthy();
      expect(body.fragment.id).toBe(id);
   });
});

describe("GET /fragments/:id.ext", () => {
   describe("unauthenticated users", () => {
      test("unauthenticated requests are denied", async () => {
         await request(app).get("/fragments/1.ext").expect(404);
      });
   });

   describe("authenticated users", () => {
      test("able to store a markdown fragment", async () => {
         const ownerId = "user1@email.com";
         const fragment = new Fragment({
            ownerId: hash(ownerId),
            type: "text/markdown",
         });
         await fragment.setData(Buffer.from("# hello world"));
         await fragment.save();

         const id = fragment.id;
         const res = await request(app)
            .get(`/v1/fragments/${id}/info`)
            .auth(ownerId, "password1");

         const body = res.body;
         expect(body.fragment.type).toBe("text/markdown");
         expect(body.fragment.id).toBe(id);
      });

      xtest("can not convert a unsupported fragment", async () => {
         const ownerId = "user1@email.com";
         const fragment = new Fragment({
            ownerId: hash(ownerId),
            type: "text/plain",
         });
         await fragment.setData(Buffer.from("# hello world", "utf-8"));
         await fragment.save();

         const id = fragment.id;
         const res = await request(app)
            .get(`/v1/fragments/${id}/apple`)
            .auth(ownerId, "password1");

         expect(res.statusCode).toBe(400);
      });

      test("convert markdown fragment to html", async () => {
         const ownerId = "user1@email.com";
         const fragment = new Fragment({
            ownerId: hash(ownerId),
            type: "text/markdown",
         });
         await fragment.setData(Buffer.from("# hello world", "utf-8"));
         await fragment.save();

         const id = fragment.id;
         const res = await request(app)
            .get(`/v1/fragments/convert/${id}/html`)
            .auth(ownerId, "password1");

         const md = require("markdown-it")();
         const converted = md.render((await fragment.getData()).toString());
         const body = res.body;
         expect(body).toBe(converted);
      });

      xtest("convert a text fragment to jpeg", async () => {
         const ownerId = "user1@email.com";
         const fragment = new Fragment({
            ownerId: hash(ownerId),
            type: "image/png",
         });
         await fragment.setData(Buffer.from("hello world", "utf-8"));
         await fragment.save();

         const id = fragment.id;
         const res = await request(app)
            .get(`/v1/fragments/${id}/jpeg`)
            .auth(ownerId, "password1");

         expect(res.statusCode).toBe(201);
      });
   });

   test("able to get a fragments valid conversion types", async () => {
      const ownerId = "user1@email.com";
      const supportedType = ["md", "html", "txt"];
      const fragment = new Fragment({
         ownerId: hash(ownerId),
         type: "text/markdown",
      });

      expect(fragment.formats()).toEqual(supportedType);
   });
});
