import type { Message } from "$lib/types/Message";
import { format } from "date-fns";
import type { EndpointMessage } from "../../endpoints/endpoints";
import { generateFromDefaultEndpoint } from "../../generateFromDefaultEndpoint";

export async function generateQuery(messages: Message[]) {
	const currentDate = format(new Date(), "MMMM d, yyyy");
	const userMessages = messages.filter(({ from }) => from === "user");
	const previousUserMessages = userMessages.slice(0, -1);

	const lastMessage = userMessages.slice(-1)[0];

	const convQuery: Array<EndpointMessage> = [
		{
			from: "user",
			content: `Previous Questions:
- Who is the president of France?

Current Question: What about Mexico?
`,
		},
		{
			from: "assistant",
			content: "President of Mexico",
		},
		{
			from: "user",
			content: `Previous questions: 
- ¿Cuándo es el próximo partido de la liga española?

Current Question: ¿Dónde se jugará?`,
		},
		{
			from: "assistant",
			content: "ubicación del próximo partido de la liga española",
		},
		{
			from: "user",
			content: "Current Question: What type of printhead does the Epson F2270 DTG printer use?",
		},
		{
			from: "assistant",
			content: "Epson F2270 DTG printer printhead",
		},
		{
			from: "user",
			content: `Previous questions:
- Quels sont les films sortis récemment?

Current Question: Où puis-je les regarder?`,
		},
		{
			from: "assistant",
			content: "cinémas où les films récents sont projetés",
		},
		{ from: "user", content: "What were the news yesterday?" },
		{
			from: "assistant",
			content: `news ${format(new Date(Date.now() - 864e5), "MMMM d, yyyy")}`,
		},
		{ from: "user", content: "What is the current weather in Paris?" },
		{ from: "assistant", content: `weather in Paris ${currentDate}` },
		{
			from: "user",
			content: "Current Question: Quines són les notícies més recents d'avui?",
		},
		{
			from: "assistant",
			content: `Notícies d'avui, ${currentDate}`,
		},
		{
			from: "user",
			content: (
				(previousUserMessages.length > 0
					? `Previous questions: \n${previousUserMessages
							.map(({ content }) => `- ${content}`)
							.join("\n")}`
					: "") +
				"\n\nCurrent Question: " +
				lastMessage.content
			).trim(),
		},
	];

	const webQuery = await generateFromDefaultEndpoint({
		messages: convQuery,
		preprompt: `You are tasked with generating web search queries. Give me an appropriate query to answer my question for google search. Answer with only the query, maintaining the same language as the most recent question. Today is ${currentDate}`,
		generateSettings: {
			max_new_tokens: 30,
		},
	});

	return webQuery.trim();
}
