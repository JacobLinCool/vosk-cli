import fs from "node:fs";
import path from "node:path";
import { MODELS, MODEL_DIR } from "./constants";

export function resolve_model(model_name: string): string {
    if (fs.existsSync(path.join(MODEL_DIR, model_name, "DONE"))) {
        return model_name;
    }

    model_name = model_name.toLowerCase();

    if (Object.keys(MODELS).includes(model_name)) {
        return MODELS[model_name][0].name;
    }

    if (!model_name.startsWith("vosk-model-")) {
        model_name = "vosk-model-" + model_name;
    }

    const models = Object.values(MODELS)
        .flat()
        .filter((m) => m.name.startsWith(model_name));

    for (const model of models) {
        if (model.name === model_name) {
            return model_name;
        }
    }

    if (models.length === 0) {
        console.error(`Model ${model_name} not found`);
        process.exit(1);
    }

    if (models.length > 1) {
        console.error(`Multiple models found: ${models.map((m) => m.name).join(", ")}`);
        process.exit(1);
    }

    return models[0].name;
}
