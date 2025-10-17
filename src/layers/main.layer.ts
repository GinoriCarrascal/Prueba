import { BotContext, BotMethods } from  '@builderbot/bot/dist/types';
import { getHistoryParse } from "../utils/handleHistory";

//import { flowPedido } from "../flows/pedidos.flow";
import { flowSaludo } from "../flows/saludo.flow";
//import { flowHorario } from "../flows/horario.flow"; 
import promt from "../utils/promts/promptMain";

import AIClass from "../services/ai/index";

/**
 * Determina que flujo va a iniciarse basado en el historial que previo entre el bot y el humano
 */

export default async (  _: BotContext,{ state, gotoFlow, extensions, }: BotMethods) => {
  // Obtener la hora actual al inicio
  const currentHour = new Date().getHours(); // Hora actual en formato 24 horas (0-23)

  // Verificar si la hora está entre las 5 PM (17) y 12 AM (23)
  if (currentHour <= 17 && currentHour > 24) {
    // Si está en ese rango, terminamos la conversación llamando a 'gotoFlow' con 'terminar'
    console.log(
      "Dentro del horario restringido (5 PM - 12 AM), terminando la conversación."
    );
    //return gotoFlow(flowHorario);
  } else {
    // Si no está en el rango restringido, continuamos con el procesamiento normal
    console.log("Empezamos aca")

    const history = getHistoryParse(state);
console.log('Historial obtenido:', history);
    const ai = extensions.ai as AIClass;
    const promptMain = promt.replace("{HISTORY}", history);

    const text = await ai.createChat(
      [
        {
          role: "system",
          content: promptMain,
        },
      ],
      "gpt-4o-mini",
      0
    );

    console.log("respuesa"+text);

    try {
      switch (true) {
        case text.includes("INICIO"):
          console.log("INICIO");
          return gotoFlow(flowSaludo);
          
        case text.includes("PEDIDO"):
          console.log("Pedido");
          
          break;
          //return gotoFlow(flowPedido);
    
        case text.includes("CARTA"):
          console.log("Carta");
          return gotoFlow(flowSaludo);
                 
    
        default:
          console.log("No matching action found");
          
          break;
          //return gotoFlow(flowPedido);
      }
    } catch (error) {
      console.error("Error in switch statement:", error);
      return error;
    }
    
  }
};
