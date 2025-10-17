import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat";
import { functions } from "../../utils/converflow/function";

// 🔑 Tipo de respuesta esperado de la IA
export type AIResponse =
  | string
  | {
      type: "function_call";
      name: string;
      arguments: any;
    };

class AIClass {
  private openai: OpenAI;
  private model: string;

  constructor(apiKey: string, _model: string) {
    if (!apiKey || apiKey.length === 0) {
      throw new Error("OPENAI_KEY is missing");
    }
    this.openai = new OpenAI({ apiKey, timeout: 15 * 1000 });
    this.model = _model;
  }

  /**
   * Método simple de chat (solo texto)
   */
  createChat = async (
    messages: ChatCompletionMessageParam[],
    model?: string,
    temperature = 0,
    max_tokens = 400
  ): Promise<string> => {
    try {
      const completion = await this.openai.chat.completions.create({
        model: model ?? this.model,
        messages,
        temperature,
        max_tokens,
        top_p: 0.8,
        frequency_penalty: 0.7,
        presence_penalty: 0.7,
      });

      return completion.choices[0].message?.content?.trim() ?? "ERROR";
    } catch (err) {
      console.error("❌ Error en createChat:", err);
      return "ERROR";
    }
  };

  /**
   * Método de chat con funciones
   */
  chatWithAI = async (
    messages: ChatCompletionMessageParam[],
    model?: string,
    temperature = 0.2,
    max_tokens = 600
  ): Promise<AIResponse> => {
    try {
      const completion = await this.openai.chat.completions.create({
        model: model ?? this.model,
        messages,
        temperature,
        max_tokens,
        top_p: 0.7,
        frequency_penalty: 0.9,
        presence_penalty: 0.6,
        functions,
        function_call: "auto",
      });

      const choice = completion.choices?.[0]?.message;

      if (!choice) {
        console.error("❌ No se recibió respuesta de la IA.");
        return "ERROR";
      }

      // Caso 1: Respuesta normal en texto
      if (choice.content) {
        return choice.content.trim();
      }

      // Caso 2: Llamada a función
      if (choice.function_call) {
        return {
          type: "function_call" as const, // 👈 forzamos literal
          name: choice.function_call.name,
          arguments: (() => {
            try {
              return JSON.parse(choice.function_call.arguments || "{}");
            } catch {
              return choice.function_call.arguments || "{}";
            }
          })(),
        };
      }

      // Si llega vacío
      return "ERROR";
    } catch (err) {
      console.error("❌ Error en chatWithAI:", err);
      return "ERROR";
    }
  };
}

export default AIClass;
