import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class UploadService {
  private S3: AWS.S3;
  private BUCKET: string;

  constructor(private configService: ConfigService) {
    this.S3 = new AWS.S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
    });

    this.BUCKET = this.configService.get<string>('AWS_S3_BUCKET_NAME');
  }

  public async uploadFile(file: Express.Multer.File): Promise<{ url: string }> {
    const { originalname, buffer } = file;
    const options = {
      Bucket: this.BUCKET,
      Key: `${Date.now()}_${originalname}`,
      Body: buffer,
    };

    const { Location } = await this.S3.upload(options).promise();

    return { url: Location };
  }
}
