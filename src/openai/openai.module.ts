import { Global, Module } from "@nestjs/common";
import { ChatGptService } from "./openai.service";
import { OpenaiController } from "./openai.controller";
import OpenAIApi from "openai";

@Global()
@Module({
	providers: [
		{
			provide: "OpenAIApi",
			useFactory: () => {
				return new OpenAIApi({
					apiKey: process.env.OPEN_AI_SECRET_KEY,
				});
			},
		},
		ChatGptService,
	],
	exports: [ChatGptService],
	controllers: [OpenaiController],
})
export class OpenAIModule {}
