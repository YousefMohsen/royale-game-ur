import { describe, expect, it } from "vitest";
import { appConfig, pageTitle } from "./config";

describe("pageTitle", () => {
  it("returns the app name without a section", () => {
    expect(pageTitle()).toBe(appConfig.name);
  });

  it("prefixes the section", () => {
    expect(pageTitle("Settings")).toBe(`Settings · ${appConfig.name}`);
  });
});
