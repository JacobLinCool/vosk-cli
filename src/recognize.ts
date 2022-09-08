import fs from "node:fs";
import { Readable } from "node:stream";
import { Ora } from "ora";
import vosk from "vosk-lib";
import wav from "wav";

export function recognize(
    model_root: string,
    audio_file: string,
    ora?: Ora,
): Promise<{ sentence: string; start: number; end: number }[]> {
    vosk.setLogLevel(-1);
    const model = new vosk.Model(model_root);
    const stream = fs.createReadStream(audio_file, { highWaterMark: 4096 });

    const reader = new wav.Reader();
    const readable = new Readable().wrap(reader);

    return new Promise((resolve) => {
        reader.on("format", ({ audioFormat, sampleRate, channels }) => {
            if (audioFormat != 1 || channels != 1) {
                throw new Error("Audio file must be mono PCM WAV.");
            }

            const rec = new vosk.Recognizer({ model, sampleRate });
            rec.setMaxAlternatives(1);
            rec.setWords(true);
            rec.setPartialWords(true);

            const results: { sentence: string; start: number; end: number }[] = [];

            readable.on("data", (data) => {
                const end_of_sentence = rec.acceptWaveform(data);
                if (end_of_sentence) {
                    const { alternatives } = rec.result();

                    if (alternatives[0].text) {
                        const sentence = alternatives[0].text;
                        const start = alternatives[0].result?.[0].start;
                        const end =
                            alternatives[0].result?.[alternatives[0].result?.length - 1].end;
                        results.push({ sentence, start, end });

                        if (ora) {
                            ora.text = `Recognized ${end.toFixed(1)} seconds: ${sentence}`;
                        }
                    }
                }
            });

            readable.on("end", () => {
                const { alternatives } = rec.finalResult();

                if (alternatives[0].text) {
                    results.push({
                        sentence: alternatives[0].text,
                        start: alternatives[0].result?.[0].start,
                        end: alternatives[0].result?.[alternatives[0].result?.length - 1].end,
                    });
                }

                resolve(results);

                rec.free();
                model.free();
            });
        });

        stream.pipe(reader);
    });
}
