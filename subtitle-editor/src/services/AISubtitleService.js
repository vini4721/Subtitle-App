// OpenAI API configuration
const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY"; // Configure in src/config/openai.js
const OPENAI_API_URL = "https://api.openai.com/v1/audio/transcriptions";

export class AISubtitleService {
  // Real OpenAI Whisper implementation
  static async generateSubtitlesWithWhisper(
    videoUri,
    options = { language: "en" }
  ) {
    try {
      // Note: This requires a valid OpenAI API key in src/config/openai.js
      if (!OPENAI_API_KEY || OPENAI_API_KEY === "YOUR_OPENAI_API_KEY") {
        console.warn("OpenAI API key not configured. Using mock subtitles.");
        return this.getMockSubtitles();
      }

      // Extract audio from video (simplified - in production use FFmpeg)
      const audioUri = await this.extractAudio(videoUri);

      // Create form data for OpenAI API
      const formData = new FormData();
      formData.append("file", {
        uri: audioUri,
        type: "audio/mp3",
        name: "audio.mp3",
      });
      formData.append("model", "whisper-1");
      formData.append("response_format", "verbose_json");
      if (options.language) {
        formData.append("language", options.language);
      }

      // Call OpenAI Whisper API
      const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();

      // Convert OpenAI response to subtitle format
      return this.convertWhisperToSubtitles(data);
    } catch (error) {
      console.error("Error with Whisper API:", error);
      console.log("Falling back to mock subtitles");
      return this.getMockSubtitles();
    }
  }

  static async extractAudio(videoUri) {
    // Simplified audio extraction
    // In production, use expo-av or ffmpeg for proper extraction
    return videoUri;
  }

  static convertWhisperToSubtitles(whisperResponse) {
    const segments = whisperResponse.segments || [];
    return segments.map((segment, index) => ({
      id: String(index + 1),
      startTime: Math.floor(segment.start * 1000),
      endTime: Math.floor(segment.end * 1000),
      text: segment.text.trim(),
      style: {
        fontSize: 16,
        color: "#FFFFFF",
        backgroundColor: "rgba(0,0,0,0.8)",
        fontWeight: "normal",
      },
    }));
  }

  static async generateSubtitles(
    videoUri,
    options = { language: "en", model: "whisper-1" }
  ) {
    try {
      // Try real OpenAI Whisper first, fall back to mock if not configured
      return await this.generateSubtitlesWithWhisper(videoUri, options);
    } catch (error) {
      console.error("Error generating subtitles:", error);
      return this.getMockSubtitles();
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
