import { addKeyword, EVENTS } from '@builderbot/bot'
import { handleHistory } from "../utils/handleHistory";

 /*Funcion para decir al cliente que no atendemos en este horario */

const flowMetPago = addKeyword(EVENTS.ACTION)
.addAction(async (ctx, { state, provider,flowDynamic}) => {
    try { await flowDynamic(["💳 *Métodos de pago disponibles*:\n\n1️⃣ *Yape* / *Plin* / *Transferencia*:\n\n📱 Número: 993793724\n👤 Titular: Noemí Judith Sánchez Mantilla\n\n2️⃣ *Cuenta Simple Soles (Interbank)*:\n🏦 Número: 8983172554328\n\n3️⃣ *Cuenta Interbancaria (Interbank)*:\n🏦 Número: 00389801317255432847\n\n4️⃣ *Cuenta Ahorros (BCP)*:\n� Número: 24592036146029"])
        await handleHistory ({content:"Enviamos datos bancarios", role:'assistant'},state)
        
        
    } catch (error) {
        console.log(`[ERROR]:`, error)
        return error
    }

})



export { flowMetPago };