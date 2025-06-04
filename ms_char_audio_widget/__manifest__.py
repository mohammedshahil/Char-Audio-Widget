{
    "name": "Char Audio Recorder",
    "version": "17.0.1.0.0",
    "summary": "Char Audio Recorder" "",
    "author": "Mohammed Shahil",
    "website": "https://www.shahil.info",
    "license": "OPL-1",
    "category": "Extra Tools",
    "depends": ["web", "base"],
    "data": [
        "security/ir.model.access.csv",
    ],
    "assets": {
        "web.assets_backend": [
            "ms_char_audio_widget/static/src/views/fields/audio_field/audio_field.js",
            "ms_char_audio_widget/static/src/views/fields/audio_field/audio_field.xml",
        ],
    },
    "application": True,
    "auto_install": False,
}
