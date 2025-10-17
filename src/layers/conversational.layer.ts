import { BotContext, BotMethods } from "@builderbot/bot/dist/types";
import { enqueueMessage } from "../utils/others/multiUserMessageQueue";
import { handleHistory, getHistoryParse } from "../utils/handleHistory";
import { flowSaludo } from "../flows/saludo.flow";
import { flowPedido } from "../flows/pedidos.flow";
import promptMain from "../utils/promts/promptMain";
import AIClass from "../services/ai/index";
import "dotenv/config";

export default async (ctx: BotContext, { state, gotoFlow }: BotMethods) => {
  try {
    if (!ctx.body || typeof ctx.body !== "string") {
      console.warn("ctx.body inválido:", ctx.body);
      return;
    }

    console.log("Mensaje recibido:", ctx.body);

    enqueueMessage(ctx, async (combinedBody) => {
      try {
        if (!combinedBody || combinedBody.trim().length === 0) {
          console.log("combinedBody vacío, no se procesa.");
          return;
        }

        // Guardar interacción
        await handleHistory({ content: combinedBody, role: "user" }, state);

        // Obtener historial
        const history = getHistoryParse(state);
        console.log("Historial obtenido:", history);

        if (!process.env.OPENAI_API_KEY) {
          console.error("❌ OPENAI_API_KEY no definida.");
          return;
        }

        const ai = new AIClass(process.env.OPENAI_API_KEY, "gpt-4o-mini");

        const prompt = promptMain.replace("{HISTORY}", history || "");
        console.log("Prompt enviado a OpenAI:", prompt);

        const text = await ai.createChat(
          [{ role: "system", content: prompt }],
          "gpt-4o-mini",
          0
        );

        console.log("Respuesta AI:", text);

        // Decidir flujo
        if (typeof text !== "string") {
          console.warn("Respuesta AI inesperada:", text);
          return;
        }

        if (text.includes("INICIO")) {
          console.log("INICIO detectado, yendo a flowSaludo");
          return gotoFlow(flowSaludo);
        }
        if (text.includes("PEDIDO")) {
          console.log("PEDIDO detectado, yendo a flowPedido");
          return gotoFlow(flowPedido);
        }
        if (text.includes("CARTA")) {
          console.log("CARTA detectado, yendo a flowSaludo");
          return gotoFlow(flowSaludo);
        }

        console.log("No se encontró acción para la respuesta AI");
      } catch (innerError) {
        console.error("Error dentro de enqueueMessage callback:", innerError);
      }
    });
  } catch (error) {
    console.error("Error en el handler de mensajes:", error);
  }
};