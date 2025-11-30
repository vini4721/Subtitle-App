// Translation Service using LibreTranslate API (free alternative to Google Translate)
// You can also use Google Cloud Translation API if you have credits

const LIBRETRANSLATE_API_URL = "https://libretranslate.com/translate";

class TranslationService {
  static supportedLanguages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "zh", name: "Chinese" },
    { code: "ar", name: "Arabic" },
    { code: "hi", name: "Hindi" },
  ];

  static async translateText(text, targetLanguage, sourceLanguage = "en") {
    try {
      const response = await fetch(LIBRETRANSLATE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
          source: sourceLanguage,
          target: targetLanguage,
          format: "text",
        }),
      });

      const data = await response.json();
      return data.translatedText || text;
    } catch (error) {
      console.error("Translation error:", error);
      return text; // Return original text if translation fails
    }
  }

  static async translateSubtitles(
    subtitles,
    targetLanguage,
    sourceLanguage = "en"
  ) {
    try {
      const translatedSubtitles = await Promise.all(
        subtitles.map(async (subtitle) => {
          const translatedText = await this.translateText(
            subtitle.text,
            targetLanguage,
            sourceLanguage
          );

          return {
            ...subtitle,
            text: translatedText,
            originalText: subtitle.text,
            language: targetLanguage,
          };
        })
      );

      return translatedSubtitles;
    } catch (error) {
      console.error("Subtitle translation error:", error);
      throw new Error("Failed to translate subtitles");
    }
  }

  static async batchTranslate(texts, targetLanguage, sourceLanguage = "en") {
    // Batch translate multiple texts at once
    try {
      const translated = await Promise.all(
        texts.map((text) =>
          this.translateText(text, targetLanguage, sourceLanguage)
        )
      );
      return translated;
    } catch (error) {
      console.error("Batch translation error:", error);
      return texts;
    }
  }

  static detectLanguage(text) {
    // Simple language detection (could be enhanced with a real library)
    // For now, assume English if not specified
    return "en";
  }
}

export default TranslationService;
