import { Transform } from "node:stream";

declare module "mic" {
    export default function mic(options: mic.Options): Mic;

    export interface Mic {
        start(): void;
        stop(): void;
        pause(): void;
        resume(): void;
        getAudioStream(): Transform;
    }

    export interface Options {
        endian?: "big" | "little";
        bitwidth?: number | string;
        encoding?: "signed-integer" | "unsigned-integer";
        rate?: number | string;
        channels?: number | string;
        device?: string;
        exitOnSilence?: number | string;
        debug?: boolean | string;
        fileType?: string;
    }
}
