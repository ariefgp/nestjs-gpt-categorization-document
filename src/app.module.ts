import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { FileUploadModule } from './file-upload/file-upload.module';

@Module({
  imports: [CommonModule, UserModule, FileUploadModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
