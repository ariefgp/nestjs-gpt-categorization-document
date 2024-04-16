import { Injectable, ServiceUnavailableException, Inject } from "@nestjs/common";
import OpenAIApi from "openai";
import { ChatCompletion, ChatCompletionMessageParam } from "openai/resources";

type Message = {
	text: string;
	ai?: boolean;
};

@Injectable()
export class ChatGptService {
	public openAI: OpenAIApi;

	constructor(@Inject('OpenAIApi') private readonly openai: OpenAIApi) {
		this.openai = new OpenAIApi({
			apiKey: process.env.OPEN_AI_SECRET_KEY,
		});
	}

	async chatGptRequest(prompt: string, messages: Message[]): Promise<string> {
		try {
			const history = messages.map(
				(message): ChatCompletionMessageParam => ({
					role: message.ai ? "assistant" : "user",
					content: message.text,
				})
			);

			const completion: ChatCompletion =
				await this.openai.chat.completions.create({
					model: "gpt-3.5-turbo",
					messages: [
						{
							role: "system",
							content: prompt,
						},
						...history,
					],
					temperature: 0.5,
					max_tokens: 1000,
				});

			const [content] = completion.choices.map(
				(choice) => choice.message.content
			);

			return content;
		} catch (e) {
			console.error(e);
			throw new ServiceUnavailableException("Failed request to ChatGPT");
		}
	}

    async categorizeFeedback(feedbacks: { title: string; description: string }[]): Promise<string[]> {
        try {
            const categoryPromises = feedbacks.map(feedback => {
                const prompt = `Title: "${feedback.title}"\nDescription: "${feedback.description}"\nIs this feedback a feature request, a complaint, or does it indicate support needed?`;
    
                return this.openai.chat.completions.create({
                    model: "gpt-4",
                    messages: [{
                        role: "system",
                        content: prompt,
                    }],
                    temperature: 0.5,
                    max_tokens: 100
                }).then(completion => completion.choices[0]?.message.content.trim());
            });
    
            return Promise.all(categoryPromises);
        } catch (e) {
            console.error(e);
            throw new ServiceUnavailableException("Failed request to ChatGPT");
        }
    }
}
