import EventEmitter from "node:events";
import fs from "node:fs";
import path from "node:path";
import { get } from "node:https";
import yauzl from "yauzl";
import { MODEL_DIR } from "./constants";

export class ModelDownloader extends EventEmitter {
    constructor(private url: string, private name: string) {
        super();
    }

    private log(...args: unknown[]) {
        this.emit("log", ...args);
    }

    private error(...args: unknown[]) {
        this.emit("error", ...args);
    }

    private async download(to: string): Promise<void> {
        const file = fs.createWriteStream(to);
        this.log(`Downloading ${this.name} ...`);

        return new Promise((resolve, reject) => {
            get(this.url, (res) => {
                const redirection = res.headers.location;
                if (res.statusCode && Math.floor(res.statusCode / 100) === 3 && redirection) {
                    file.close(() => {
                        this.url = redirection;
                        this.download(to).then(resolve, reject);
                    });
                } else {
                    res.pipe(file);

                    res.on("data", () => {
                        this.log(
                            `Downloading... ${(file.bytesWritten / 1024 / 1024).toFixed(1)} MB`,
                        );
                    });

                    file.on("finish", () => {
                        file.close();
                        resolve();
                    });
                }
            }).on("error", (error) => {
                fs.unlinkSync(to);
                reject(error);
            });
        });
    }

    private unzip(zip: string, dest: string): Promise<void> {
        const dir = path.basename(zip, ".zip");
        return new Promise((resolve, reject) => {
            yauzl.open(zip, { lazyEntries: true }, (err, zipfile) => {
                if (err) {
                    reject(err);
                }
                zipfile.readEntry();
                zipfile
                    .on("entry", (entry) => {
                        if (/\/$/.test(entry.fileName)) {
                            zipfile.readEntry();
                        } else {
                            zipfile.openReadStream(entry, (err, stream) => {
                                if (err) {
                                    reject(err);
                                }
                                const file = path.resolve(
                                    dest,
                                    entry.fileName.replace(`${dir}/`, ""),
                                );
                                if (!fs.existsSync(path.dirname(file))) {
                                    fs.mkdirSync(path.dirname(file), { recursive: true });
                                    this.log("Created", path.dirname(file));
                                }
                                stream.pipe(fs.createWriteStream(file));
                                stream
                                    .on("end", () => {
                                        this.log("Extracted", file);
                                        zipfile.readEntry();
                                    })
                                    .on("error", (err) => {
                                        reject(err);
                                    });
                            });
                        }
                    })
                    .on("error", (err) => {
                        reject(err);
                    })
                    .on("end", () => {
                        this.log("Extracted all files");
                        fs.writeFileSync(path.resolve(dest, "DONE"), new Date().toString());
                    })
                    .on("close", () => {
                        resolve();
                    });
            });
        });
    }

    public async install(from?: string): Promise<void> {
        const zip = from || path.join(MODEL_DIR, this.name + ".zip");
        const dir = path.join(MODEL_DIR, this.name);

        if (!from) {
            try {
                await this.download(zip);
                this.log(`Downloaded ${this.name}`);
            } catch (err) {
                this.error(`Failed to download ${this.name}`);
                this.error(err);
                return;
            }
        }

        try {
            await this.unzip(zip, dir);
            this.log(`Unzipped ${this.name}`);
            if (!from) {
                fs.unlinkSync(zip);
            }
        } catch (err) {
            this.error(`Failed to unzip ${this.name}`);
            this.error(err);
            return;
        }
    }
}
