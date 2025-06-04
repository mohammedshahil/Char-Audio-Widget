/** @odoo-module **/

import { registry } from "@web/core/registry";
import { standardFieldProps } from "@web/views/fields/standard_field_props";
import { useState, onWillStart, onWillUnmount } from "@odoo/owl";
import { Field } from "@web/views/fields/field";
import { _t } from "@web/core/l10n/translation";
import { useService } from "@web/core/utils/hooks";

export class AudioRecorderField extends Field {
  static template = "ms_char_audio_widget.AudioRecorderField";
  static props = {
    ...standardFieldProps,
  };

  setup() {
    super.setup();
    this.orm = this.env.services.orm;
    this.notification = useService("notification");
    this.state = useState({
      isRecording: false,
      duration: 0,
      inputValue: "",
      isProcessing: false,
    });

    onWillStart(() => {
      this.state.inputValue =
        this.props.value || this.props.record.data[this.props.name] || "";
    });

    this.props.record.data[this.props.name] &&
      (this.state.inputValue = this.props.record.data[this.props.name]);

    onWillUnmount(() => {
      this.stopTimer();
    });
  }

  async startRecording() {
    if (this.props.readonly) {
      return;
    }

    if (!this.state.isRecording) {
      this.state.isRecording = true;
      this.state.isProcessing = true;
      this.startTimer();

      try {
        const result = await this.orm.call(
          "audio.converter",
          "recognize_speech",
          []
        );

        if (result.error) {
          this.notification.add(result.error, {
            type: "danger",
            title: _t("Error"),
          });
          return;
        }

        this.state.inputValue = result.text;
        this.props.record.update({
          [this.props.name]: result.text,
        });
      } catch (err) {
        console.error("Error converting audio to text:", err);
        this.notification.add(
          _t("Failed to process audio. Please try again."),
          {
            type: "danger",
            title: _t("Error"),
          }
        );
      } finally {
        this.state.isRecording = false;
        this.state.isProcessing = false;
        this.stopTimer();
      }
    }
  }

  async stopRecording() {
    if (this.state.isRecording) {
      this.state.isRecording = false;
      this.stopTimer();
    }
  }

  startTimer() {
    this.state.duration = 0;
    this.timer = setInterval(() => {
      this.state.duration += 1;
    }, 1000);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  onInputChange(ev) {
    if (this.props.readonly) {
      return;
    }

    const value = ev.target.value;
    this.state.inputValue = value;
    this.props.record.update({
      [this.props.name]: value,
    });
  }
}

export const audioRecorderField = {
  component: AudioRecorderField,
  displayName: "Audio Recorder",
  supportedTypes: ["char"],
  extractProps: ({ attrs }) => ({}),
};

registry.category("fields").add("audio_recorder", audioRecorderField);
