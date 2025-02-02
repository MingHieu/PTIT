import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { InjectAwsService } from 'nest-aws-sdk';
import { generateUniqueString } from 'src/common/utils';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class FileService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    @InjectAwsService(S3) private s3: S3,
  ) {}

  private async uploadToS3(file: Express.Multer.File) {
    const result = await this.s3
      .upload({
        Bucket: this.config.get('AWS_PUBLIC_BUCKET_NAME'),
        Body: file.buffer,
        Key: generateUniqueString(),
        ACL: 'public-read',
      })
      .promise();

    return {
      key: result.Key,
      url: result.Location,
    };
  }

  private deleteFromS3(key: string) {
    this.s3
      .deleteObject({
        Bucket: this.config.get('AWS_PUBLIC_BUCKET_NAME'),
        Key: key,
      })
      .promise();
  }

  async upload(uploadFiles: Express.Multer.File[]) {
    const uploadedKeys: string[] = [];
    try {
      const uploadPromises = uploadFiles.map(async (file) => {
        const { key, url } = await this.uploadToS3(file);
        uploadedKeys.push(key);
        return {
          name: decodeURIComponent(escape(file.originalname)),
          type: file.mimetype,
          key,
          url,
        };
      });
      const files = await Promise.all(uploadPromises);
      const uploadedFiles = await this.prisma.file.createManyAndReturn({
        data: files,
      });
      return uploadedFiles;
    } catch (e) {
      console.log('Tải lên thất bại:', e);
      uploadedKeys.map((k) => this.deleteFromS3(k));
      throw new ForbiddenException(
        'Tải lên thất bại: Một hoặc nhiều tập tin không thể được tải lên. Vui lòng kiểm tra định dạng tập tin và thử lại.',
      );
    }
  }

  async delete(ids: number[]) {
    const files = await this.prisma.file.findMany({
      where: { id: { in: ids } },
    });
    await this.prisma.file.deleteMany({
      where: { id: { in: ids } },
    });
    files.map((f) => this.deleteFromS3(f.key));
  }
}
