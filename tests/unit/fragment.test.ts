import { Fragment, hash } from "../../src/model/fragments";

/**
 * Wait for a certain milliseconds
 * @param ms - milliseconds
 * @returns A promise that resolves after ms milliseconds.
 */
async function wait(ms = 10) {
   return new Promise((resolve) => setTimeout(resolve, ms));
}

const validTypes = [
   `text/plain`,
   /*
   Currently, only text/plain is supported. Others will be added later.

  `text/markdown`,
  `text/html`,
  `application/json`,
  `image/png`,
  `image/jpeg`,
  `image/webp`,
  `image/gif`,
  */
];

describe("Fragment class", () => {
   test("common formats are supported", () => {
      validTypes.forEach((format) =>
         expect(Fragment.isSupportedType(format)).toBe(true)
      );
   });

   describe("Fragment()", () => {
      test("type can be a simple media type", () => {
         const fragment = new Fragment({
            ownerId: "1234",
            type: "text/plain",
            size: 0,
         });
         expect(fragment.type).toEqual("text/plain");
      });

      test("type can include a charset", () => {
         const fragment = new Fragment({
            ownerId: "1234",
            type: "text/plain; charset=utf-8",
            size: 0,
         });
         expect(fragment.type).toEqual("text/plain; charset=utf-8");
      });

      test("size gets set to 0 if missing", () => {
         const fragment = new Fragment({ ownerId: "1234", type: "text/plain" });
         expect(fragment.size).toBe(0);
      });

      test("size can be 0", () => {
         expect(
            () => new Fragment({ ownerId: "1234", type: "text/plain", size: 0 })
         ).not.toThrow();
      });

      test("size cannot be negative", () => {
         expect(
            () =>
               new Fragment({ ownerId: "1234", type: "text/plain", size: -1 })
         ).toThrow();
      });

      test("invalid types throw", () => {
         expect(
            () =>
               new Fragment({
                  ownerId: "1234",
                  type: "application/msword",
                  size: 1,
               })
         ).toThrow();
      });

      test("valid types can be set", () => {
         validTypes.forEach((format) => {
            const fragment = new Fragment({
               ownerId: "1234",
               type: format,
               size: 1,
            });
            expect(fragment.type).toEqual(format);
         });
      });

      test("fragments have an id", () => {
         const fragment = new Fragment({
            ownerId: "1234",
            type: "text/plain",
            size: 1,
         });
         expect(fragment.id).toMatch(/[A-Za-z0-9_-]+/);
      });

      test("fragments use id passed in if present", () => {
         const fragment = new Fragment({
            id: "id",
            ownerId: "1234",
            type: "text/plain",
            size: 1,
         });
         expect(fragment.id).toEqual("id");
      });

      test("fragments get a created datetime string", () => {
         const fragment = new Fragment({
            ownerId: "1234",
            type: "text/plain",
            size: 1,
         });
         expect(Date.parse(fragment.created as string)).not.toBeNaN();
      });

      test("fragments get an updated datetime string", () => {
         const fragment = new Fragment({
            ownerId: "1234",
            type: "text/plain",
            size: 1,
         });
         expect(Date.parse(fragment.updated as string)).not.toBeNaN();
      });
   });

   describe("isSupportedType()", () => {
      test("common text types are supported, with and without charset", () => {
         expect(Fragment.isSupportedType("text/plain")).toBe(true);
         expect(Fragment.isSupportedType("text/plain; charset=utf-8")).toBe(
            true
         );
      });

      test("other types are not supported", () => {
         expect(Fragment.isSupportedType("application/octet-stream")).toBe(
            false
         );
         expect(Fragment.isSupportedType("application/msword")).toBe(false);
         expect(Fragment.isSupportedType("audio/webm")).toBe(false);
         expect(Fragment.isSupportedType("video/ogg")).toBe(false);
      });
   });

   describe("mimeType, isText", () => {
      test("mimeType returns the mime type without charset", () => {
         const fragment = new Fragment({
            ownerId: "1234",
            type: "text/plain; charset=utf-8",
            size: 0,
         });
         expect(fragment.type).toEqual("text/plain; charset=utf-8");
         expect(fragment.mimeType).toEqual("text/plain");
      });

      test("mimeType returns the mime type if charset is missing", () => {
         const fragment = new Fragment({
            ownerId: "1234",
            type: "text/plain",
            size: 0,
         });
         expect(fragment.type).toEqual("text/plain");
         expect(fragment.mimeType).toEqual("text/plain");
      });

      test("isText return expected results", () => {
         // Text fragment
         const fragment = new Fragment({
            ownerId: "1234",
            type: "text/plain; charset=utf-8",
            size: 0,
         });
         expect(fragment.isText).toBe(true);
      });
   });

   describe("formats", () => {
      test("formats returns the expected result for plain text", () => {
         const fragment = new Fragment({
            ownerId: "1234",
            type: "text/plain; charset=utf-8",
            size: 0,
         });
         expect(fragment.formats()).toEqual(["txt"]);
      });

      test("formats returns the expected result for markdown", () => {
         const fragment = new Fragment({
            ownerId: "1234",
            type: "text/markdown",
            size: 0,
         });
         expect(fragment.formats()).toEqual(["md", "html", "txt"]);
      });
   });

   describe("save(), getData(), setData(), byOwnerId(), byUser(), delete()", () => {
      test("byUser() returns an empty array if there are no fragments for this user", async () => {
         expect(await Fragment.byUser("1234")).toEqual([]);
      });

      test("a fragment can be created and save() stores a fragment for the user", async () => {
         const data = Buffer.from("hello");
         const fragment = new Fragment({
            ownerId: "1234",
            type: "text/plain",
            size: 0,
         });
         await fragment.save();
         await fragment.setData(data);

         const fragment2 = (await Fragment.byOwnerId(
            fragment.ownerId,
            fragment.id as string
         )) as Fragment;
         expect(fragment2).toEqual(fragment);
         expect(await fragment2.getData?.()).toEqual(data);
      });

      test("save() updates the updated date/time of a fragment", async () => {
         const ownerId = "7777";
         const fragment = new Fragment({
            ownerId,
            type: "text/plain",
            size: 0,
         });
         const modified1 = fragment.updated;
         await wait();
         await fragment.save();
         const newFragment = (await Fragment.byOwnerId(
            fragment.ownerId,
            fragment.id as string
         )) as Fragment;

         expect(Date.parse(newFragment.updated as string)).toBeGreaterThan(
            Date.parse(modified1 as string)
         );
      });

      test("setData() updates the updated date/time of a fragment", async () => {
         const data = Buffer.from("hello");
         const ownerId = "7777";
         const fragment = new Fragment({
            ownerId,
            type: "text/plain",
            size: 0,
         });
         await fragment.save();
         const modified1 = fragment.updated;
         await wait();
         await fragment.setData(data);
         await wait();
         const fragment2 = await Fragment.byOwnerId(
            fragment.ownerId,
            fragment.id as string
         );
         expect(Date.parse(fragment2.updated)).toBeGreaterThan(
            Date.parse(modified1)
         );
      });

      test("a fragment is added to the list of a user's fragments", async () => {
         const data = Buffer.from("hello");
         const ownerId = "123456";
         const fragment = new Fragment({
            ownerId,
            type: "text/plain",
            size: 0,
         });
         await fragment.save();
         await fragment.setData(data);

         expect(await Fragment.byUser(ownerId)).toEqual([fragment.id]);
      });

      test("full fragments are returned when requested for a user", async () => {
         const data = Buffer.from("hello");
         const ownerId = "6666";
         const fragment = new Fragment({
            ownerId,
            type: "text/plain",
            size: 0,
         });
         await fragment.save();
         await fragment.setData(data);

         expect(await Fragment.byUser(ownerId, true)).toEqual([fragment]);
      });

      test("setData() updates the fragment size", async () => {
         const fragment = new Fragment({
            ownerId: "1234",
            type: "text/plain",
            size: 0,
         });
         await fragment.save();
         await fragment.setData(Buffer.from("a"));
         expect(fragment.size).toBe(1);

         await fragment.setData(Buffer.from("aa"));
         const newFragment = await Fragment.byOwnerId(
            fragment.ownerId,
            fragment.id as string
         );
         expect(newFragment.size).toBe(2);
      });

      test("a fragment can be deleted", async () => {
         const ownerId = "1234";
         const fragment = new Fragment({
            ownerId: ownerId,
            type: "text/plain",
            size: 0,
         });
         await fragment.save();
         await fragment.setData(Buffer.from("a"));

         await Fragment.delete("1234", fragment.id as string);
         // expect(() =>
         // Fragment.byOwnerId("1234", fragment.id as string)
         // ).rejects.toThrow();
      });
   });
});
