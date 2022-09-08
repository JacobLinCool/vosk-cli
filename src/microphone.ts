import EventEmitter from "node:events";
import mic from "mic";
import vosk, { Model } from "vosk-lib";
import ora, { Ora } from "ora";

export class Microphone extends EventEmitter {
    private model: Model;
    private mic?: mic;
    private spinner?: Ora;

    constructor(model_root: string) {
        super();
        vosk.setLogLevel(-1);
        this.model = new vosk.Model(model_root);
    }

    start(): void {
        this.spinner = ora("Initializing").start();
        const spinner = this.spinner || ora();

        this.mic = mic();
        const stream = this.mic.getAudioStream();

        const rec = new vosk.Recognizer({ model: this.model, sampleRate: 16000 });
        rec.setMaxAlternatives(1);
        rec.setWords(true);
        rec.setPartialWords(true);

        spinner.text = "Listening";

        stream.on("data", (data: Buffer) => {
            if (rec.acceptWaveform(data)) {
                const result = rec.result();
                const sentence = result.alternatives[0].text;
                if (sentence) {
                    spinner.info(sentence).start("Listening");
                    this.emit("sentence", sentence);
                }
            } else {
                const result = rec.partialResult();
                const sentence = result.partial;
                if (sentence) {
                    spinner.text = sentence;
                }
            }
        });

        stream.on("audioProcessExitComplete", () => {
            const result = rec.finalResult();
            const sentence = result.alternatives[0].text;
            if (sentence) {
                spinner.info(sentence).succeed("Done");
                this.emit("sentence", sentence);
            }
            rec.free();
        });

        this.mic.start();
    }

    stop(): void {
        this.spinner?.stop();
        this.mic?.stop();
    }
}
