import { apply, diff, diffSummary, newEmberApp } from "ember-apply/test-utils";
import { describe, expect, it } from "vitest";

import { default as tailwind4Vite } from "./index.js";

describe("tailwind4-vite", () => {
  it("default export exists", () => {
    expect(typeof tailwind4Vite).toEqual("function");
  });

  describe("applying to an ember app", () => {
    it("works via CLI", async () => {
      let appLocation = await newEmberApp([
        "--blueprint",
        "@embroider/app-blueprint",
      ]);

      await apply(appLocation, tailwind4Vite.path);

      expect(await diffSummary(appLocation)).toMatchSnapshot();
      expect(
        await diff(appLocation, { ignoreVersions: true })
      ).toMatchSnapshot();
    });
  });
});
