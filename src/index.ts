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
import { microphone } from "./microphone";

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
                const exists = fs.existsSync(path.join(MODEL_DIR, model.name, "DONE"));
                const info = `    ${model.name} (${(model.size / 1024 / 1024).toFixed(0)} MB)`;
                if (exists) {
                    console.log(chalk.green(`${info} [Installed]`));
                } else {
                    console.log(info);
                }
            }
        });
    });

program
    .command("install <model>")
    .alias("i")
    .description("Install a model")
    .action(async (model: string) => {
        const name = resolve_model(model);
        const target = Object.values(MODELS)
            .flat()
            .find((m) => m.name === name);

        if (!target) {
            console.error(chalk.red(`Model ${name} not found`));
            process.exit(1);
        }

        const installed = fs.existsSync(path.join(MODEL_DIR, target.name, "DONE"));
        if (installed) {
            console.log(chalk.green(`Model ${target.name} already installed`));
            process.exit(0);
        }

        const spinner = ora(`Downloading ${target.name} ...`).start();
        const downloader = new ModelDownloader(target.url, target.name);
        downloader.on("log", (...args: unknown[]) => {
            spinner.text = args.join(" ");
        });
        downloader.on("error", (...args: unknown[]) => {
            spinner.fail(args.join(" "));
        });
        await downloader.install();
        spinner.succeed(`Successfully installed ${target.name}`);
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
    .description("Recognize audio from microphone")
    .action(async (model: string) => {
        const name = resolve_model(model);
        const installed = fs.existsSync(path.join(MODEL_DIR, name, "DONE"));

        if (!installed) {
            console.error(chalk.red(`Model ${name} not installed`));
            console.error(chalk.red(`Run "vosk install ${name}" to install it`));
            process.exit(1);
        }

        await microphone(path.join(MODEL_DIR, name));
    });

program.parse(process.argv);
