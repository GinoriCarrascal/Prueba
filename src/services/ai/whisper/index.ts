import OpenAI from "openai";
import * as fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import * as path from "path";
import { Transform } from "stream";

// Convertir Transform a Buffer
const streamToBuffer = async (stream: Transform): Promise<Buffer> => {
    return new Promise<Buffer>((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
    });
};

// Convertir voz a texto usando OpenAI
const voiceToText = async (filePath: string): Promise<string> => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY as string,
    });

    const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(filePath),
        model: "whisper-1",
        response_format: "text",
    });

    return transcription;
};

// Convertir OGG a MP3
const convertOggMp3 = async (inputPath: string, outputPath: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .audioQuality(96)
            .toFormat("mp3")
            .save(outputPath)
            .on("end", () => resolve())
            .on("error", reject);
    });
};

// Handler principal para Builder Bot
const handlerAI = async (ctx: any): Promise<string> => {
    // Builder Bot ya tiene ctx.downloadMedia()
    const buffer: Buffer = await ctx.downloadMedia(); // Esto reemplaza downloadMediaMessage

    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

    const pathTmpOgg = path.join(tmpDir, `voice-note-${Date.now()}.ogg`);
    const pathTmpMp3 = path.join(tmpDir, `voice-note-${Date.now()}.mp3`);

    await fs.promises.writeFile(pathTmpOgg, buffer);
    await convertOggMp3(pathTmpOgg, pathTmpMp3);

    const text = await voiceToText(pathTmpMp3);

    // Limpiar archivos temporales
    await fs.promises.unlink(pathTmpOgg);
    await fs.promises.unlink(pathTmpMp3);

    return text;
};

export { handlerAI };
