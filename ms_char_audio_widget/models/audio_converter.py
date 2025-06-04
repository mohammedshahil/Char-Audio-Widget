from odoo import models, api, _
import speech_recognition as sr


class AudioConverter(models.TransientModel):
    _name = "audio.converter"
    _description = "Audio to Text Converter"

    @api.model
    def recognize_speech(self, duration=5):
        """This is used to recognize the voice directly from microphone"""
        try:
            recognizer = sr.Recognizer()

            with sr.Microphone() as source:
                # Adjust for ambient noise
                recognizer.adjust_for_ambient_noise(source, duration=1)

                audio_data = recognizer.record(source, duration=duration)

            text = recognizer.recognize_google(audio_data, language="en-US")
            return {"text": text}

        except sr.UnknownValueError:
            return {"error": _("Speech could not be understood. Please try again.")}
        except sr.RequestError as e:
            return {
                "error": _(
                    "Could not request results from speech recognition service: %s",
                    str(e),
                )
            }
        except Exception as e:
            return {
                "error": _(
                    "An error occurred during speech recognition. Please try again."
                )
            }

    @api.model
    def convert_audio_to_text(self, record_duration=5):
        try:
            result = self.recognize_speech(duration=record_duration)
            if "error" in result:
                return result
            return {"text": result["text"]}
        except Exception as e:
            return {"error": str(e)}
