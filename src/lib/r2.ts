/**
 * imports: externals
 */

import Logger from "@sha3/logger";
import * as s3 from "@aws-sdk/client-s3";
import * as fs from "fs";

/**
 * imports: internals
 */

/**
 * module: initializations
 */

const logger = new Logger("cloud:r2");

/**
 * types
 */

export type R2Options = {
  bucketName: string;
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  basePublicUrl?: string;
};

export type R2UploadOptions = {
  targetFilePath: string;
  buffer?: Buffer;
  filePath?: string;
};

export type UploadResult = {
  putObjectCommandOutput: s3.PutObjectCommandOutput;
  relativePath: string;
  publicUrl?: string;
};

/**
 * consts
 */

/**
 * export
 */

export default class R2 {
  /**
   * private: attributes
   */

  /**
   * private: methods
   */

  private client: s3.S3Client;

  /**
   * constructor
   */

  constructor(private options: R2Options) {
    const { accessKeyId, endpoint, secretAccessKey } = options;
    logger.debug(`new R2 client: ${endpoint}`);
    this.client = new s3.S3Client({
      region: "auto",
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  /**
   * public : methods
   */

  public async upload(options: R2UploadOptions) {
    const { bucketName, basePublicUrl } = this.options;
    const { buffer, filePath, targetFilePath } = options;
    logger.debug(`uploading file to ${targetFilePath}`);
    if (!targetFilePath?.[0]) {
      throw new Error(`targetFilePath must start with "/"`);
    }
    if (!buffer && !filePath) {
      throw new Error(`buffer or filePath value is required`);
    }
    const fileBuffer = buffer || fs.readFileSync(filePath);
    const putObjectCommand = new s3.PutObjectCommand({
      Bucket: bucketName,
      Key: targetFilePath,
      Body: fileBuffer,
    });
    const putObjectCommandOutput = await this.client.send(putObjectCommand);
    const result: UploadResult = {
      putObjectCommandOutput,
      relativePath: targetFilePath,
    };
    if (basePublicUrl) {
      const url = new URL(targetFilePath, basePublicUrl);
      result.publicUrl = url.href;
      logger.debug(`uploaded file to ${result.publicUrl}`);
    }
    return result;
  }
}
