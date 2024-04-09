import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileUploadService {
  private s3: S3;

  constructor(private configService: ConfigService) {
    this.s3 = new S3();
  }

  async uploadFileToS3(file: Express.Multer.File) {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    const uploadResult = await this.s3
      .upload({
        Bucket: bucketName,
        Body: file.buffer,
        Key: `${Date.now()}-${file.originalname}`,
      })
      .promise();

    return uploadResult;
  }

}