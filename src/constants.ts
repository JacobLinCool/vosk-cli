import os from "node:os";
import fs from "node:fs";
import path from "node:path";

export const PACKAGE_JSON = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8"),
) as {
    name: string;
    version: string;
    description: string;
    [key: string]: unknown;
};

export const MODEL_DIR = process.env.MODEL_DIR || path.join(os.homedir(), "vosk-models");
if (!fs.existsSync(MODEL_DIR)) {
    fs.mkdirSync(MODEL_DIR, { recursive: true });
}

export const MODELS = {
    english: [
        {
            name: "vosk-model-small-en-us-0.15",
            url: "https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip",
            size: 41943040,
            license: "Apache 2.0",
        },
        {
            name: "vosk-model-en-us-0.22-lgraph",
            url: "https://alphacephei.com/vosk/models/vosk-model-en-us-0.22-lgraph.zip",
            size: 134217728,
            license: "Apache 2.0",
        },
        {
            name: "vosk-model-en-us-0.22",
            url: "https://alphacephei.com/vosk/models/vosk-model-en-us-0.22.zip",
            size: 1932735283,
            license: "Apache 2.0",
        },
    ],
    "english-other": [
        {
            name: "vosk-model-small-en-us-zamia-0.5",
            url: "https://alphacephei.com/vosk/models/vosk-model-small-en-us-zamia-0.5.zip",
            size: 51380224,
            license: "LGPL-3.0",
        },
        {
            name: "vosk-model-en-us-daanzu-20200905-lgraph",
            url: "https://alphacephei.com/vosk/models/vosk-model-en-us-daanzu-20200905-lgraph.zip",
            size: 135266304,
            license: "AGPL",
        },
        {
            name: "vosk-model-en-us-librispeech-0.2",
            url: "https://alphacephei.com/vosk/models/vosk-model-en-us-librispeech-0.2.zip",
            size: 886046720,
            license: "Apache 2.0",
        },
        {
            name: "vosk-model-en-us-daanzu-20200905",
            url: "https://alphacephei.com/vosk/models/vosk-model-en-us-daanzu-20200905.zip",
            size: 1073741824,
            license: "AGPL",
        },
        {
            name: "vosk-model-en-us-aspire-0.2",
            url: "https://alphacephei.com/vosk/models/vosk-model-en-us-aspire-0.2.zip",
            size: 1503238553,
            license: "Apache 2.0",
        },
        {
            name: "vosk-model-en-us-0.21",
            url: "https://alphacephei.com/vosk/models/vosk-model-en-us-0.21.zip",
            size: 1717986918,
            license: "Apache 2.0",
        },
    ],
    "indian-english": [
        {
            name: "vosk-model-small-en-in-0.4",
            url: "https://alphacephei.com/vosk/models/vosk-model-small-en-in-0.4.zip",
            size: 37748736,
            license: "Apache 2.0",
        },
        {
            name: "vosk-model-en-in-0.5",
            url: "https://alphacephei.com/vosk/models/vosk-model-en-in-0.5.zip",
            size: 1073741824,
            license: "Apache 2.0",
        },
    ],
    chinese: [
        {
            name: "vosk-model-small-cn-0.22",
            url: "https://alphacephei.com/vosk/models/vosk-model-small-cn-0.22.zip",
            size: 44040192,
            license: "Apache 2.0",
        },
        {
            name: "vosk-model-cn-0.22",
            url: "https://alphacephei.com/vosk/models/vosk-model-cn-0.22.zip",
            size: 1395864371,
            license: "Apache 2.0",
        },
    ],
    "chinese-other": [
        {
            name: "vosk-model-cn-kaldi-multicn-0.15",
            url: "https://alphacephei.com/vosk/models/vosk-model-cn-kaldi-multicn-0.15.zip",
            size: 1610612736,
            license: "Apache 2.0",
        },
    ],
    russian: [
        {
            name: "vosk-model-small-ru-0.22",
            url: "https://alphacephei.com/vosk/models/vosk-model-small-ru-0.22.zip",
            size: 47185920,
            license: "Apache 2.0",
        },
        {
            name: "vosk-model-ru-0.22",
            url: "https://alphacephei.com/vosk/models/vosk-model-ru-0.22.zip",
            size: 1610612736,
            license: "Apache 2.0",
        },
    ],
    "russian-other": [
        {
            name: "vosk-model-ru-0.10",
            url: "https://alphacephei.com/vosk/models/vosk-model-ru-0.10.zip",
            size: 2684354560,
            license: "Apache 2.0",
        },
    ],
    french: [
        {
            name: "vosk-model-small-fr-0.22",
            url: "https://alphacephei.com/vosk/models/vosk-model-small-fr-0.22.zip",
            size: 42991616,
            license: "Apache 2.0",
        },
        {
            name: "vosk-model-fr-0.22",
            url: "https://alphacephei.com/vosk/models/vosk-model-fr-0.22.zip",
            size: 1503238553,
            license: "Apache 2.0",
        },
    ],
    "french-other": [
        {
            name: "vosk-model-small-fr-pguyot-0.3",
            url: "https://alphacephei.com/vosk/models/vosk-model-small-fr-pguyot-0.3.zip",
            size: 40894464,
            license: "CC-BY-NC-SA 4.0",
        },
        {
            name: "vosk-model-fr-0.6-linto-2.2.0",
            url: "https://alphacephei.com/vosk/models/vosk-model-fr-0.6-linto-2.2.0.zip",
            size: 1610612736,
            license: "AGPL",
        },
    ],
    german: [
        {
            name: "vosk-model-small-de-0.15",
            url: "https://alphacephei.com/vosk/models/vosk-model-small-de-0.15.zip",
            size: 47185920,
            license: "Apache 2.0",
        },
        {
            name: "vosk-model-small-de-zamia-0.3",
            url: "https://alphacephei.com/vosk/models/vosk-model-small-de-zamia-0.3.zip",
            size: 51380224,
            license: "LGPL-3.0",
        },
        {
            name: "vosk-model-de-0.21",
            url: "https://alphacephei.com/vosk/models/vosk-model-de-0.21.zip",
            size: 2040109465,
            license: "Apache 2.0",
        },
        {
            name: "vosk-model-de-tuda-0.6-900k",
            url: "https://alphacephei.com/vosk/models/vosk-model-de-tuda-0.6-900k.zip",
            size: 4724464025,
            license: "Apache 2.0",
        },
    ],
    spanish: [
        {
            name: "vosk-model-small-es-0.42",
            url: "https://alphacephei.com/vosk/models/vosk-model-small-es-0.42.zip",
            size: 40894464,
            license: "Apache 2.0",
        },
        {
            name: "vosk-model-es-0.42",
            url: "https://alphacephei.com/vosk/models/vosk-model-es-0.42.zip",
            size: 1503238553,
            license: "Apache 2.0",
        },
    ],
    portuguese: [
        {
            name: "vosk-model-small-pt-0.3",
            url: "https://alphacephei.com/vosk/models/vosk-model-small-pt-0.3.zip",
            size: 32505856,
            license: "Apache 2.0",
        },
        {
            name: "vosk-model-pt-fb-v0.1.1-20220516_2113",
            url: "https://alphacephei.com/vosk/models/vosk-model-pt-fb-v0.1.1-20220516_2113.zip",
            size: 1717986918,
            license: "GPLv3.0",
        },
    ],
    greek: [
        {
            name: "vosk-model-el-gr-0.7",
            url: "https://alphacephei.com/vosk/models/vosk-model-el-gr-0.7.zip",
            size: 1181116006,
            license: "Apache 2.0",
        },
    ],
    turkish: [
        {
            name: "vosk-model-small-tr-0.3",
            url: "https://alphacephei.com/vosk/models/vosk-model-small-tr-0.3.zip",
            size: 36700160,
            license: "Apache 2.0",
        },
    ],
    vietnamese: [
        {
            name: "vosk-model-small-vn-0.3",
            url: "https://alphacephei.com/vosk/models/vosk-model-small-vn-0.3.zip",
            size: 33554432,
            license: "Apache 2.0",
        },
    ],
    italian: [
        {
            name: "vosk-model-small-it-0.22",
            url: "https://alphacephei.com/vosk/models/vosk-model-small-it-0.22.zip",
            size: 50331648,
            license: "Apache 2.0",
        },
        {
            name: "vosk-model-it-0.22",
            url: "https://alphacephei.com/vosk/models/vosk-model-it-0.22.zip",
            size: 1288490188,
            license: "Apache 2.0",
        },
    ],
    dutch: [
        {
            name: "vosk-model-small-nl-0.22",
            url: "https://alphacephei.com/vosk/models/vosk-model-small-nl-0.22.zip",
            size: 40894464,
            license: "Apache 2.0",
        },
    ],
    "dutch-other": [
        {
            name: "vosk-model-nl-spraakherkenning-0.6-lgraph",
            url: "https://alphacephei.com/vosk/models/vosk-model-nl-spraakherkenning-0.6-lgraph.zip",
            size: 104857600,
            license: "CC-BY-NC-SA",
        },
        {
            name: "vosk-model-nl-spraakherkenning-0.6",
            url: "https://alphacephei.com/vosk/models/vosk-model-nl-spraakherkenning-0.6.zip",
            size: 901775360,
            license: "CC-BY-NC-SA",
        },
    ],
    catalan: [
        {
            name: "vosk-model-small-ca-0.4",
            url: "https://alphacephei.com/vosk/models/vosk-model-small-ca-0.4.zip",
            size: 44040192,
            license: "Apache 2.0",
        },
    ],
    arabic: [
        {
            name: "vosk-model-ar-mgb2-0.4",
            url: "https://alphacephei.com/vosk/models/vosk-model-ar-mgb2-0.4.zip",
            size: 333447168,
            license: "Apache 2.0",
        },
    ],
    farsi: [
        {
            name: "vosk-model-small-fa-0.4",
            url: "https://alphacephei.com/vosk/models/vosk-model-small-fa-0.4.zip",
            size: 49283072,
            license: "Apache 2.0",
        },
        {
            name: "vosk-model-small-fa-0.5",
            url: "https://alphacephei.com/vosk/models/vosk-model-small-fa-0.5.zip",
            size: 62914560,
            license: "Apache 2.0",
        },
        {
            name: "vosk-model-fa-0.5",
            url: "https://alphacephei.com/vosk/models/vosk-model-fa-0.5.zip",
            size: 1073741824,
            license: "Apache 2.0",
        },
    ],
    filipino: [
        {
            name: "vosk-model-tl-ph-generic-0.6",
            url: "https://alphacephei.com/vosk/models/vosk-model-tl-ph-generic-0.6.zip",
            size: 335544320,
            license: "CC-BY-NC-SA 4.0",
        },
    ],
    ukrainian: [
        {
            name: "vosk-model-small-uk-v3-nano",
            url: "https://alphacephei.com/vosk/models/vosk-model-small-uk-v3-nano.zip",
            size: 76546048,
            license: "Apache 2.0",
        },
        {
            name: "vosk-model-small-uk-v3-small",
            url: "https://alphacephei.com/vosk/models/vosk-model-small-uk-v3-small.zip",
            size: 139460608,
            license: "Apache 2.0",
        },
        {
            name: "vosk-model-uk-v3-lgraph",
            url: "https://alphacephei.com/vosk/models/vosk-model-uk-v3-lgraph.zip",
            size: 340787200,
            license: "Apache 2.0",
        },
        {
            name: "vosk-model-uk-v3",
            url: "https://alphacephei.com/vosk/models/vosk-model-uk-v3.zip",
            size: 359661568,
            license: "Apache 2.0",
        },
    ],
    kazakh: [
        {
            name: "vosk-model-small-kz-0.15",
            url: "https://alphacephei.com/vosk/models/vosk-model-small-kz-0.15.zip",
            size: 44040192,
            license: "Apache 2.0",
        },
        {
            name: "vosk-model-kz-0.15",
            url: "https://alphacephei.com/vosk/models/vosk-model-kz-0.15.zip",
            size: 396361728,
            license: "Apache 2.0",
        },
    ],
    swedish: [
        {
            name: "vosk-model-small-sv-rhasspy-0.15",
            url: "https://alphacephei.com/vosk/models/vosk-model-small-sv-rhasspy-0.15.zip",
            size: 303038464,
            license: "MIT",
        },
    ],
    japanese: [
        {
            name: "vosk-model-small-ja-0.22",
            url: "https://alphacephei.com/vosk/models/vosk-model-small-ja-0.22.zip",
            size: 50331648,
            license: "Apache 2.0",
        },
        {
            name: "vosk-model-ja-0.22",
            url: "https://alphacephei.com/vosk/models/vosk-model-ja-0.22.zip",
            size: 1073741824,
            license: "Apache 2.0",
        },
    ],
    esperanto: [
        {
            name: "vosk-model-small-eo-0.42",
            url: "https://alphacephei.com/vosk/models/vosk-model-small-eo-0.42.zip",
            size: 44040192,
            license: "Apache 2.0",
        },
    ],
    hindi: [
        {
            name: "vosk-model-small-hi-0.22",
            url: "https://alphacephei.com/vosk/models/vosk-model-small-hi-0.22.zip",
            size: 44040192,
            license: "Apache 2.0",
        },
        {
            name: "vosk-model-hi-0.22",
            url: "https://alphacephei.com/vosk/models/vosk-model-hi-0.22.zip",
            size: 1610612736,
            license: "Apache 2.0",
        },
    ],
    czech: [
        {
            name: "vosk-model-small-cs-0.4-rhasspy",
            url: "https://alphacephei.com/vosk/models/vosk-model-small-cs-0.4-rhasspy.zip",
            size: 46137344,
            license: "MIT",
        },
    ],
    polish: [
        {
            name: "vosk-model-small-pl-0.22",
            url: "https://alphacephei.com/vosk/models/vosk-model-small-pl-0.22.zip",
            size: 52953088,
            license: "Apache 2.0",
        },
    ],
    "speaker-identification-model": [
        {
            name: "vosk-model-spk-0.4",
            url: "https://alphacephei.com/vosk/models/vosk-model-spk-0.4.zip",
            size: 13631488,
            license: "Apache 2.0",
        },
    ],
} as const;
