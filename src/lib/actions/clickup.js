import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { LangchainToolSet } from "composio-core";
import { pull } from "langchain/hub";

export async function createClickUpSpace(entityId, workspace_id) {
    const llm = new ChatOpenAI({ model: "gpt-4o-mini" });
    const composioToolset = new LangchainToolSet({ apiKey: process.env.COMPOSIO_API_KEY, entityId: entityId });
    const prompt = await pull("hwchase17/openai-functions-agent");
    const tools = await composioToolset.getActions({ actions: ["CLICKUP_CREATE_SPACE"] });
    
    try {
        const agent = await createOpenAIFunctionsAgent({
            llm,
            tools,
            prompt
        });
        const agentExecutor = new AgentExecutor({ agent, tools });
        const result = await agentExecutor.invoke({
            input: `Create a new space in ClickUp workspace with ID ${workspace_id}. The space name should be 'New_Workspace_Created_by_Composio'. Set multiple Assignees as false.`
        });
        console.log("result ::", result);
        if (result.output) {
            return { status: 200, message: result.output };
        } else {
            return { status: 204, message: "Space created, but no specific output returned" };
        }
    } catch (error) {
        console.error("Error in createClickUpSpace:", error);
        return { status: 500, message: "Internal server error", error: error.message };
    }
}
