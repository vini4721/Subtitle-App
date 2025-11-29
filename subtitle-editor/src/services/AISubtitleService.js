// OpenAI API configuration
const OPENAI_API_KEY = "your-openai-api-key-here";
const OPENAI_API_URL = "https://api.openai.com/v1/audio/transcriptions";

export class AISubtitleService {
  static async generateSubtitles(
    videoUri,
    options = { language: "en", model: "whisper-1" }
  ) {
    try {
      return this.getMockSubtitles();
    } catch (error) {
      console.error("Error generating subtitles:", error);
      throw new Error("Failed to generate subtitles");
    }
  }

  static getMockSubtitles() {
    return [
      {
        id: "1",
        startTime: 0,
        endTime: 3000,
        text: "Welcome to our AI-powered subtitle editor!",
        style: {
          fontSize: 16,
          color: "#FFFFFF",
          backgroundColor: "rgba(0,0,0,0.8)",
          fontWeight: "normal",
        },
      },
      {
        id: "2",
        startTime: 3000,
        endTime: 7000,
        text: "This app automatically generates subtitles using artificial intelligence.",
        style: {
          fontSize: 16,
          color: "#FFFFFF",
          backgroundColor: "rgba(0,0,0,0.8)",
          fontWeight: "normal",
        },
      },
      {
        id: "3",
        startTime: 7000,
        endTime: 12000,
        text: "You can edit, customize, and export your subtitles easily.",
        style: {
          fontSize: 16,
          color: "#FFFFFF",
          backgroundColor: "rgba(0,0,0,0.8)",
          fontWeight: "normal",
        },
      },
      {
        id: "4",
        startTime: 12000,
        endTime: 16000,
        text: "Perfect for content creators, educators, and video professionals.",
        style: {
          fontSize: 16,
          color: "#FFFFFF",
          backgroundColor: "rgba(0,0,0,0.8)",
          fontWeight: "normal",
        },
      },
      {
        id: "5",
        startTime: 16000,
        endTime: 20000,
        text: "Start creating amazing subtitled videos today!",
        style: {
          fontSize: 16,
          color: "#FFFFFF",
          backgroundColor: "rgba(0,0,0,0.8)",
          fontWeight: "normal",
        },
      },
    ];
  }

  static exportToSRT(subtitles) {
    return subtitles
      .map((subtitle, index) => {
        const startTime = this.formatSRTTime(subtitle.startTime);
        const endTime = this.formatSRTTime(subtitle.endTime);
        return `${index + 1}\n${startTime} --> ${endTime}\n${subtitle.text}\n`;
      })
      .join("\n");
  }

  static exportToVTT(subtitles) {
    const header = "WEBVTT\n\n";
    const content = subtitles
      .map((subtitle) => {
        const startTime = this.formatVTTTime(subtitle.startTime);
        const endTime = this.formatVTTTime(subtitle.endTime);
        return `${startTime} --> ${endTime}\n${subtitle.text}\n`;
      })
      .join("\n");
    return header + content;
  }

  static formatSRTTime(milliseconds) {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const ms = milliseconds % 1000;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")},${ms
      .toString()
      .padStart(3, "0")}`;
  }

  static formatVTTTime(milliseconds) {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const ms = milliseconds % 1000;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${ms
      .toString()
      .padStart(3, "0")}`;
  }
}

export class FileService {
  static async getVideoMetadata(videoUri) {
    return {
      duration: 30000,
      size: 5000000,
      format: "mp4",
    };
  }

  static async extractAudio(videoUri) {
    throw new Error("Audio extraction not implemented yet");
  }
}

export class StorageService {
  static async saveProject(projectName, data) {
    console.log("Saving project:", projectName, data);
  }

  static async loadProject(projectName) {
    return null;
  }

  static async getProjectList() {
    return [];
  }
}
