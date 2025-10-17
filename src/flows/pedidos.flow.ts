import { addKeyword, utils } from "@builderbot/bot";
import { MemoryDB as Database } from "@builderbot/bot";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";

import AIClass from "../services/ai";
import { getHistoryParse, handleHistory } from "../utils/handleHistory";
import { generateTimer } from "../utils/generateTimer";
import { flowMetPago } from "./metPago.flow";
import { sticker } from "../utils/converflow/sticker";
import { sendSticker } from "../utils/others/allSticker";

// Producto
import { getProductos } from "../../src/services/api/producto";
import { ClienteService } from "../utils/others/getpricedel";

import promt_pedidos from "src/utils/promts/promtPedidos";
import system from "src/utils/promts/systemPedidos";

// 🔑 Tipo de respuesta de la IA
type AIResponse =
  | string
  | {
      type: "function_call";
      name: string;
      arguments: any;
    };

const generatePromptPedido = (history: string, bd_ham: string) => {
  return promt_pedidos
    .replace("{HISTORIAL_CONVERSACION}", history)
    .replace("{BD_HAMBURGUESAS}", bd_ham);
};

const flowPedido = addKeyword<Provider, Database>(
  utils.setEvent("PEDIDO_FLOW")
).addAction(async (ctx, { provider, state, flowDynamic, gotoFlow }) => {
  try {
    console.log("📌 Flow PEDIDO iniciado");

    // Validar API Key antes de instanciar AI
    const openAIKey = process.env.OPENAI_API_KEY;
    if (!openAIKey) {
      console.error(
        "❌ OPENAI_KEY no está definida. Agrega tu clave en .env o en el entorno."
      );
      return;
    }

    const ai = new AIClass(openAIKey, "gpt-5-mini");
    console.log("✅ Instancia AI creada");

    // Obtener historial de la conversación
    const historialact = getHistoryParse(state);

    // Obtener productos
    const menus = await getProductos();
   // console.log("Menús obtenidos:", menus);

    // Formatear lista de productos
    const listMenu =
      menus.length > 0
        ? menus
            .map(
              (menu) =>
                `articulo: ${menu.nombre}, descripcion: ${menu.descripcion}, precio: ${menu.precio}`
            )
            .join(";\n")
        : "ninguna";

    // Generar prompt para la IA
    const promptSchedule = generatePromptPedido(historialact, listMenu);
   // console.log("Prompt a enviar a la IA:", promptSchedule);

    // Validar que el mensaje del usuario exista
    if (!ctx.body || ctx.body.trim().length === 0) {
      console.error("❌ Mensaje del usuario vacío, no se enviará a la IA");
      return;
    }

    // Llamar a la IA
    const text: AIResponse = await ai.chatWithAI(
      [
        { role: "system", content: system },
        { role: "user", content: promptSchedule },
        { role: "user", content: ctx.body },
      ],
      "gpt-4o-mini",
      0.6
    );

    if (typeof text === "string") {
      console.log("💬 Respuesta de la IA:", text);

      let vartext = "";
      const strText = text;

      // Buscar stickers
      for (const key in sticker) {
        if (strText.includes(key)) {
          sendSticker(ctx, provider, sticker[key]);
          vartext = strText.replace(`[${key}]`, " ");
        }
      }

      if (!vartext) vartext = strText;

      // Guardar historial
      await handleHistory({ content: vartext, role: "assistant" }, state);

      // Enviar chunks al usuario
      const chunks = vartext.split(/(?<!\d)\.\s+/g);
      for (const chunk of chunks) {
        if (chunk.trim()) {
          await flowDynamic([
            { body: chunk.trim(), delay: generateTimer(150, 250) },
          ]);
        }
      }
    } else if (text.type === "function_call") {
      console.log("⚙️ Llamada a función:", text.name, text.arguments);

      const cliente = new ClienteService();
      const urlobtenido = await cliente.verificarDireccionCliente(
        text.arguments,
        ctx
      );

      await flowDynamic([
        { body: "Aqui tienes tu orden ", media: `${urlobtenido}` },
      ]);

          await sendSticker(ctx, provider, sticker.confirmacion);
          
    }
  } catch (error) {
    console.log(error) }})

    export {flowPedido}