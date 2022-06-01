import {
   readFragment,
   readFragmentData,
   writeFragment,
   writeFragmentData,
} from "../../src/model/data/memory";

describe("Memory", () => {
   test("readFragment() read a non existant fragment", async () => {
      let result = await readFragment("1", "1");
      expect(result).toBe(undefined);
   });

   test("writeFragment() should write to db", async () => {
      await writeFragment({
         ownerId: "1",
         id: "1",
         value: "test",
      });
      let result = await readFragment("1", "1");
      expect(result).toBe("test");
   });

   test("writeFragmentData() should write to a fragment", async () => {
      await writeFragmentData("1", "1", "test");
      let result = await readFragmentData("1", "1");
      expect(result).toBe("test");
   });

   test("readFragmentData() should read from a fragment", async () => {
      await writeFragmentData("1", "1", "test");
      let result = await readFragmentData("1", "1");
      expect(result).toBe("test");
   });
});
