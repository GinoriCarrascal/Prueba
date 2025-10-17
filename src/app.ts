import { createBot, createProvider } from "@builderbot/bot";
import { MemoryDB as Database } from "@builderbot/bot";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";

import flows from "./flows/index";

const PORT = process.env.PORT ?? 3008;

const main = async () => {
  const adapterFlow = flows;

  const adapterProvider =  createProvider(Provider, { usePairingCode: false })
  const adapterDB = new Database();

  const { httpServer } = await createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
    
  }); 
  console.log(httpServer)
  httpServer(+PORT);
};

main()