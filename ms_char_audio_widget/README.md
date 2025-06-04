# Audio Recorder Widget for Odoo

A custom widget for Odoo that enables audio recording and speech-to-text conversion in char fields.

## Installation

1. Install the module in your Odoo instance
2. Make sure you have the required system dependencies:
   ```
   sudo apt-get update
   sudo apt-get install ffmpeg python3-pyaudio
   pip install SpeechRecognition pyaudio
   ```

## Usage

```xml
<field name="your_field_name" widget="audio_recorder"/>
```

## Dependencies

- FFmpeg
- PyAudio
- SpeechRecognition
