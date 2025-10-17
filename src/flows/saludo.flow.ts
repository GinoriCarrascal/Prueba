import { addKeyword, utils } from "@builderbot/bot";
import { MemoryDB as Database } from "@builderbot/bot";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";

import aleatorio from "../utils/others/aleatorioM";
import { arrayMenu } from "../utils/converflow/ArrayRFlow";
import { arraySaludo } from "../utils/converflow/ArrayRFlow";
import { imagen, sticker } from "../utils/converflow/sticker";
import { sendSticker } from "../utils/others/allSticker";

const flowSaludo = addKeyword<Provider, Database>(
  utils.setEvent("ACTION")
).addAction(async (ctx, { state, flowDynamic, provider }) => {
  try {
    // 🔹 Seleccionar saludo aleatorio
    const sal = aleatorio(arraySaludo);
    await flowDynamic(sal);

    await state.update({ lastMessage: sal });

    // 🔹 Enviar menú con imagen
    await flowDynamic([
      {
        body: aleatorio(arrayMenu),
        media: imagen.menu,
      },
    ]);

    // ✅ Usa el provider inyectado por Builderbot, no la clase importada
    await sendSticker(ctx, provider, sticker.menu);
    await state.update({ lastMessage: "MENU ENVIADO" });

    // 🔹 Pedir datos al usuario
    await flowDynamic([
      "🔥 Completa los siguientes datos por favor:\n",
      "Nombre:\nDNI: (en caso desee boleta)\nPedido:\nDirección:\nRecojo o Delivery:\nMétodo de pago:\nGracias por su preferencia 🍔",
    ]);

    await sendSticker(ctx, provider, sticker.contodo);
  } catch (error) {
    console.error(error);
  }
});


    export{flowSaludo}