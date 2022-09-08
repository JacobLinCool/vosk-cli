#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { OptionValues, program } from "commander";
import chalk from "chalk";
import ora from "ora";
import { PACKAGE_JSON, MODELS, MODEL_DIR } from "./constants";
import { ModelDownloader } from "./downloader";
import { resolve_model } from "./resolve";
import { recognize } from "./recognize";
import { convert } from "./convert";
import { Microphone } from "./microphone";
import { semantic_size } from "./utils";

program
    .version(`${PACKAGE_JSON.name} ${PACKAGE_JSON.version}`)
    .description(PACKAGE_JSON.description);

program
    .command("list")
    .alias("ls")
    .description("List all the models available")
    .action(() => {
        Object.entries(MODELS).forEach(([key, models]) => {
            console.log(chalk.bold(key));
            for (const model of models) {
                console.group();
                const exists = fs.existsSync(path.join(MODEL_DIR, model.name, "DONE"));
                const size = chalk.yellow(`(${semantic_size(model.size)})`);
                const info = `${model.name} ${size} ${chalk.magenta(model.license)}`;
                if (exists) {
                    console.log(chalk.green(info));
                } else {
                    console.log(info);
                }
                console.groupEnd();
            }
        });
    });

program
    .command("install <model>")
    .alias("i")
    .description("Install a model")
    .option("-f, --from <archive>", "Install from archive (zip)")
    .action(async (model: string, opts: OptionValues) => {
        const name = opts.from ? model : resolve_model(model);
        const target = Object.values(MODELS)
            .flat()
            .find((m) => m.name === name);

        if (!target) {
            console.error(chalk.red(`Model ${name} not found`));
            process.exit(1);
        }

        const installed = fs.existsSync(path.join(MODEL_DIR, name, "DONE"));
        if (installed) {
            console.log(chalk.green(`Model ${name} already installed`));
            process.exit(0);
        }

        const spinner = ora(`Downloading ${name} ...`).start();
        const downloader = opts.from
            ? new ModelDownloader("", name)
            : new ModelDownloader(target.url, name);
        downloader.on("log", (...args: unknown[]) => {
            spinner.text = args.join(" ");
        });
        downloader.on("error", (...args: unknown[]) => {
            spinner.fail(args.join(" "));
        });
        await downloader.install(opts.from);
        spinner.succeed(`Successfully installed ${name}`);
    });

program
    .command("remove <model>")
    .alias("rm")
    .description("Remove a model")
    .action((model: string) => {
        const name = resolve_model(model);
        const zip = path.join(MODEL_DIR, `${name}.zip`);
        const dir = path.join(MODEL_DIR, name);
        if (fs.existsSync(zip)) {
            fs.rmSync(zip);
        }
        if (fs.existsSync(dir)) {
            fs.rmSync(dir, { recursive: true });
        }
        console.log(chalk.green(`Successfully removed ${name}`));
    });

program
    .command("recognize <model> <audio>")
    .alias("rec")
    .description("Recognize text from an audio file")
    .option("-c, --convert", "Convert source audio to 16000 Hz mono WAV file first")
    .option("-s, --silent", "Print the result only")
    .option("-t, --text", "Print the result as text only")
    .action(async (model: string, audio: string, opts: OptionValues) => {
        const name = resolve_model(model);
        const installed = fs.existsSync(path.join(MODEL_DIR, name, "DONE"));

        if (!installed) {
            console.error(chalk.red(`Model ${name} not installed`));
            console.error(chalk.red(`Run "vosk install ${name}" to install it`));
            process.exit(1);
        }

        if (!fs.existsSync(audio)) {
            console.error(chalk.red(`Audio file ${audio} not found`));
            process.exit(1);
        }

        if (opts.convert) {
            const spinner = opts.silent ? undefined : ora(`Converting ${audio} ...`).start();
            audio = convert(audio);
            spinner?.succeed(`Successfully converted ${audio}`);
        }

        const spinner = opts.silent ? undefined : ora(`Recognizing ${audio} ...`).start();
        const results = await recognize(path.join(MODEL_DIR, name), audio, spinner);
        spinner?.succeed(`Recognized ${audio}`);

        if (opts.text) {
            console.log(results.map((r) => r.sentence).join("\n"));
        } else {
            console.log(JSON.stringify(results, null, 2));
        }
    });

program
    .command("microphone <model>")
    .alias("mic")
    .description("Recognize text from microphone")
    .option("-o, --output <file>", "Save the transcription to a file")
    .option("-f, --force", "Force overwrite the output file if it exists")
    .option("-t, --time", "Print the time before each sentence in file")
    .action(async (model: string, opts: OptionValues) => {
        const name = resolve_model(model);
        const installed = fs.existsSync(path.join(MODEL_DIR, name, "DONE"));

        if (!installed) {
            console.error(chalk.red(`Model ${name} not installed`));
            console.error(chalk.red(`Run "vosk install ${name}" to install it`));
            process.exit(1);
        }

        if (opts.output && !opts.force && fs.existsSync(opts.output)) {
            console.error(chalk.red(`Output file ${opts.output} already exists`));
            console.error(chalk.red(`Use -f or --force to forcely overwrite it`));
            process.exit(1);
        }

        const start_t = Date.now();
        const mic = new Microphone(path.join(MODEL_DIR, name));
        if (opts.output) {
            mic.on("sentence", (sentence) => {
                const time = ((Date.now() - start_t) / 1000).toFixed(1).padStart(6);
                const line = opts.time ? `[${time}] ${sentence}` : sentence;
                fs.appendFileSync(opts.output, line + "\n");
            });
        }
        mic.start();

        process.on("SIGINT", () => {
            mic.stop();
        });
    });

program.parse(process.argv);
