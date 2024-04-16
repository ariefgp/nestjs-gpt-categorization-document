import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { ChatGptService } from './openai/openai.service';
import { OpenAIModule } from './openai/openai.module';

@Module({
  imports: [CommonModule, UserModule, FileUploadModule, OpenAIModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
