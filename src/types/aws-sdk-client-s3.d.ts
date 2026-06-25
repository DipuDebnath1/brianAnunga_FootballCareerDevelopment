declare module "@aws-sdk/client-s3" {
  export interface S3ClientConfig {
    region?: string;
    credentials?: {
      accessKeyId?: string;
      secretAccessKey?: string;
    };
  }

  export class S3Client {
    constructor(_config?: S3ClientConfig);
  }
}
