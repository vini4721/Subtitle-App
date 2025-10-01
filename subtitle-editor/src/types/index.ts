export interface Subtitle {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  position?: {
    x: number;
    y: number;
  };
  style?: {
    fontSize: number;
    color: string;
    backgroundColor: string;
    fontWeight: "normal" | "bold";
  };
}

export interface VideoInfo {
  uri: string;
  duration: number;
  width: number;
  height: number;
  size: number;
  name: string;
}

export interface SubtitleGenerationOptions {
  language: string;
  model: "whisper-1";
  prompt?: string;
}

export interface AITranscriptionResponse {
  text: string;
  segments: Array<{
    id: number;
    seek: number;
    start: number;
    end: number;
    text: string;
    tokens: number[];
    temperature: number;
    avg_logprob: number;
    compression_ratio: number;
    no_speech_prob: number;
  }>;
}
