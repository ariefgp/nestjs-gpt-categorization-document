import {
	Body,
	Controller,
	HttpException,
	HttpStatus,
	Post,
    Get,
} from "@nestjs/common";
import { ChatGptService } from "./openai.service";
import { IsNotEmpty, IsString } from 'class-validator';

type ChatRequest = {
	prompt: string;
	messages: Array<{
		text: string;
		ai?: boolean;
	}>;
};

export class FeedbackDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}

@Controller("/api")
export class OpenaiController {
	constructor(private readonly chatGptService: ChatGptService) {}

	@Post('/chat')
	async chat(@Body() chatRequest: ChatRequest): Promise<{ response: string }> {
		try {
			const { prompt, messages } = chatRequest;
			const response = await this.chatGptService.chatGptRequest(
				prompt,
				messages
			);
			return { response };
		} catch (error) {
			throw new HttpException(
				"Failed to process chat request",
				HttpStatus.SERVICE_UNAVAILABLE
			);
		}
	}

    @Post('/categorize')
    async categorize(@Body() feedbackSamples: FeedbackDto[]): Promise<any> {
        try {
            const categories = await this.chatGptService.categorizeFeedback(feedbackSamples);
            return categories;
        } catch (error) {
            throw new HttpException('Failed to categorize feedback', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
