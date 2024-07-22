/**
 * imports: externals
 */

import * as assert from "node:assert";
import { test } from "node:test";
import { R2 } from "../dist";
import * as path from "path";

/**
 * env init
 */

require("dotenv").config({ path: [".env", "../.env"] });

/**
 * consts
 */

const r2 = new R2({
  bucketName: "public",
  endpoint: process.env.R2_S3_ENDPOINT,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  basePublicUrl: "https://public.sha3.cloud",
});

/**
 * tests
 */

test("Test upload file", async () => {
  const data = await r2.upload({
    targetFilePath: "/test/test2.txt",
    filePath: path.join(__dirname, "/files/test.txt"),
  });
  assert.ok(!!data.publicUrl);
});
