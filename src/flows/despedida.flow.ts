import { addKeyword } from '@builderbot/bot'
import { handleHistory } from "../utils/handleHistory";
/*
import { aleatorio } from "../utils/others/aleatorioM";
import arrayDespedida from "../utils/converflow/ArrayRFlow";

const flowDespedida = addKeyword(["adios", "bye", "chau"])
    .addAction(async (ctx, { state, flowDynamic }) => {
        try {
            const sal = aleatorio(arrayDespedida)
            await flowDynamic(sal)

            await handleHistory({ content: sal, role: 'assistant' }, state)

        } catch (error) {
            console.log(`[ERROR]:`, error)
            return error
        }

    })


export { flowDespedida }
*/