import { S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import config from "./index";

const s3Client = new S3Client({
  region: config.aws.bucketRegion,
  credentials: {
    accessKeyId: config.aws.accessKeyId ?? "",
    secretAccessKey: config.aws.secretAccessKey ?? "",
  },
} as S3ClientConfig);

export { s3Client };
