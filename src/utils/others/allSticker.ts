
const delay = (ms: number): Promise<void> =>
  new Promise((res) => setTimeout(res, ms));

/**
 * Envía un sticker en WhatsApp.
 * @param ctx - Contexto del mensaje entrante (contiene el remoteJid).
 * @param provider - Provider con vendor (ej: baileys).
 * @param stickerWebP - Ruta local o URL del archivo .webp.
 */
export async function sendSticker(
  ctx: any,
  provider: any,
  stickerWebP: string
): Promise<void> {
  console.log("🧩 Tipo de provider:", typeof provider);
console.log("🧩 Claves del provider:", Object.keys(provider || {}));
console.log("🧩 provider.vendor:", provider?.vendor);
console.log("🧩 Claves del vendor:", Object.keys(provider?.vendor || {}));
    try {
    const sendFn =
      provider?.vendor?.sendMessage ||
      provider?.sendMessage; // ✅ intenta ambas rutas

    if (typeof sendFn !== "function") {
      console.error("❌ El provider no tiene un método sendMessage válido.");
      return;
    }

    const id = ctx?.key?.remoteJid;
    if (!id) {
      console.error("❌ No se pudo obtener el remoteJid del contexto.");
      return;
    }

    await sendFn(id, { sticker: { url: stickerWebP } });
    console.log(`✅ Sticker enviado a ${id}`);
  }catch (error: any) {
    console.error("❌ Error enviando sticker:", error.message || error);
  }
}
