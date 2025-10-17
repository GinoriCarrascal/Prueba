
import { BotContext } from "@builderbot/bot/dist/types";

interface Message {
    text: string;
    timestamp: number;
}

interface QueueConfig {
    gapMilliseconds: number;
}

interface UserQueue {
    messages: Message[];
    timer: NodeJS.Timeout | null;
    callback: ((body: string, from: string) => void) | null;
}

interface QueueState {
    queues: Map<string, UserQueue>;
}

function createInitialState(): QueueState {
    return { queues: new Map() };
}

function resetTimer(userQueue: UserQueue): void {
    if (userQueue.timer) clearTimeout(userQueue.timer);
    userQueue.timer = null;
}

function processQueue(messages: Message[]): string {
    return messages.map(msg => msg.text).join(" ");
}

async function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function createMessageQueue(config: QueueConfig) {
    const state: QueueState = createInitialState();

    return async function enqueueMessage(ctx: BotContext, callback: (body: string, from: string) => void): Promise<string> {
        const { from, body: messageBody } = ctx;

        if (!from || !messageBody) {
            console.error("Invalid message context:", ctx);
            return "";
        }

        let userQueue = state.queues.get(from);
        if (!userQueue) {
            userQueue = { messages: [], timer: null, callback: null };
            state.queues.set(from, userQueue);
        }

        resetTimer(userQueue);
        userQueue.messages.push({ text: messageBody, timestamp: Date.now() });
        userQueue.callback = callback;

        return new Promise((resolve) => {
            userQueue!.timer = setTimeout(async () => {
                const currentQueue = state.queues.get(from);
                if (currentQueue && currentQueue.messages.length > 0) {
                    const result = processQueue(currentQueue.messages);
                    await delay(1000);

                    if (currentQueue.callback) {
                        currentQueue.callback(result, from);
                    }

                    state.queues.set(from, { messages: [], timer: null, callback: null });
                    resolve(result);
                } else {
                    resolve("");
                }
            }, config.gapMilliseconds);
        });
    };
}

// CAMBIA LA HORA AQUI
const enqueueMessage = createMessageQueue({ gapMilliseconds: 5000 });

export { enqueueMessage };

