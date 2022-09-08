# Vosk CLI

Use vosk in command line.

List all pre-trained models, download & install them, and use them to transcribe audio files or live audio.

```sh
❯ vosk help
Usage: vosk [options] [command]

Use vosk in command line.

Options:
  -V, --version                            output the version number
  -h, --help                               display help for command

Commands:
  list|ls                                  List all the models available
  install|i [options] <model>              Install a model
  remove|rm <model>                        Remove a model
  recognize|rec [options] <model> <audio>  Recognize text from an audio file
  microphone|mic [options] <model>         Recognize text from microphone
  help [command]                           display help for command
```

## Usage

### Install Model

```sh
# Install the small english model
❯ vosk i english
```

```sh
# Install the large english model
❯ vosk i en-us-0.22
```

```sh
# Install from a local file
❯ vosk i --from "path/to/my-model.zip" my-model-name
```

> Tips: you can use `vosk ls` to list all the official models, and `vosk-model-` prefix is optional.

### Using Microphone

```sh
# Using the small english model to recognize text from microphone and output the result to a file (with live preview)
❯ vosk mic -o out.txt -t english
# Output:
ℹ hello
ℹ my name is jacob
⠇ Listening
```

### Using Audio File

```sh
# Using the small english model to recognize text from an audio file (auto-convert to wav), and output the result to stdout
❯ vosk rec -c english audio.mp3
```
