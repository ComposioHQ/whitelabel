import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { LangchainToolSet } from "composio-core";
import { pull } from "langchain/hub";

export async function starRepository(entityId) {
    const llm = new ChatOpenAI({ model: "gpt-4o-mini" });
    const composioToolset = new LangchainToolSet({ apiKey: process.env.COMPOSIO_API_KEY, entityId: entityId });
    const prompt = await pull("hwchase17/openai-functions-agent");
    const tools = await composioToolset.getActions({ actions: ["GITHUB_STAR_A_REPOSITORY_FOR_THE_AUTHENTICATED_USER"] });
    
    try {
        const agent = await createOpenAIFunctionsAgent({
            llm,
            tools,
            prompt
        });
        const agentExecutor = new AgentExecutor({ agent, tools });
        const result = await agentExecutor.invoke({
            input: "Star the GitHub repository owned by composiohq with the name composio."
        });
        console.log("result ::", result);
        if (result.output) {
            return { status: 200, message: result.output };
        } else {
            return { status: 204, message: "Repository starred, but no specific output returned" };
        }
    } catch (error) {
        console.error("Error in starRepository:", error);
        return { status: 500, message: "Internal server error", error: error.message };
    }
}
