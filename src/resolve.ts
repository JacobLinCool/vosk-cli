import { MODELS } from "./constants";

export function resolve_model(model_name: string): string {
    if (!model_name.startsWith("vosk-model-")) {
        model_name = "vosk-model-" + model_name;
    }

    const models = Object.values(MODELS)
        .flat()
        .filter((m) => m.name.startsWith(model_name));
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
