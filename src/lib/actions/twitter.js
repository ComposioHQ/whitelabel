import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { LangchainToolSet } from "composio-core";
import { pull } from "langchain/hub";

export async function createNewTweet(entityId) {
    const llm = new ChatOpenAI({ model: "gpt-4o-mini" });
    const composioToolset = new LangchainToolSet({ apiKey: process.env.COMPOSIO_API_KEY, entityId: entityId });
    const prompt = await pull("hwchase17/openai-functions-agent");
    const tools = await composioToolset.getActions({ actions: ["TWITTER_CREATION_OF_A_POST"] });
    
    try {
        const agent = await createOpenAIFunctionsAgent({
            llm,
            tools,
            prompt
        });
        const agentExecutor = new AgentExecutor({ agent, tools });
        const tweetContent = "Hey! I used @composiohqto create this tweet";
        const result = await agentExecutor.invoke({
            input: `Post the following message on Twitter: ${tweetContent}`
        });
        console.log("result ::", result);
        
        if (result.output) {
            return { status: 200, message: result.output };
        } else {
            return { status: 204, message: "Tweet created, but no specific output returned" };
        }
    } catch (error) {
        console.error("Error in createNewTweet:", error);
        return { status: 500, message: "Internal server error", error: error.message };
    }
}
