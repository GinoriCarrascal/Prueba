import { addKeyword, EVENTS } from "@builderbot/bot"
import { handlerAI } from "../services/ai/whisper"
import { handleHistory } from "../utils/handleHistory"

import welcomeFlow from "./welcome.flow"

/**
 * Flow para manejar notas de voz
 */
const flowVoice = addKeyword(EVENTS.VOICE_NOTE).addAction(
  async (ctx, { state, flowDynamic, gotoFlow }) => {
    // Aviso inmediato al usuario
    await flowDynamic("🔊 Dame un momento para escucharte...")

    try {
      // Procesar el audio con la IA
      const text = await handlerAI(ctx)
      console.log("Texto detectado:", text)

      // Guardar en historial
      await handleHistory({ content: text, role: "user" }, state)

      // Redirigir al flow de bienvenida (IMPORTANTE: return)
      return gotoFlow(welcomeFlow)
    } catch (err) {
      console.error("Error procesando nota de voz:", err)

      // Respuesta de fallback al usuario
      await flowDynamic(
        "❌ Hubo un problema al procesar tu nota de voz. Intenta de nuevo."
      )

      // O puedes redirigir a un flow de error si lo tienes definido
      return
    }
  }
)

export { flowVoice }
