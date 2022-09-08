import mic from "mic";
import vosk from "vosk-lib";
import ora from "ora";

export function microphone(model_root: string): Promise<void> {
    const spinner = ora("Initializing").start();

    return new Promise((resolve) => {
        const instance = mic();
        const stream = instance.getAudioStream();

        vosk.setLogLevel(-1);
        const model = new vosk.Model(model_root);
        const rec = new vosk.Recognizer({ model, sampleRate: 16000 });
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
            }
            rec.free();
            model.free();
            resolve();
        });

        process.on("SIGINT", () => {
            spinner.stop();
            instance.stop();
        });

        instance.start();
    });
}
