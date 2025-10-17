import { createFlow } from  '@builderbot/bot'
import welcomeFlow from "./welcome.flow";
import { flowPedido } from "./pedidos.flow";
import { flowSaludo } from "./saludo.flow";
//import { flowDespedida } from "./despedida.flow";
import { flowVoice } from "./voice.flow";
import { flowMetPago } from "./metPago.flow";

/**
 * Declaramos todos los flujos que vamos a utilizar
 */
export default createFlow(
    [  // welcomeFlow,
       // flowSaludo,
       // flowPedido,
        //flowDespedida,
        //flowVoice,
        //flowMetPago,
        ])