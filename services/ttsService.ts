
import { GoogleGenAI, Modality } from "@google/genai";

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const getAudioContext = () => {
  return new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
};

/**
 * Speak a word using the free browser-native SpeechSynthesis API.
 * Used for auto-play on each question to avoid exhausting the Google API quota.
 */
export const speakWord = async (text: string) => {
  try {
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.error("Browser TTS Error:", error);
  }
};

/**
 * Plays an enthusiastic celebratory audio for high scores
 */
export const playCelebration = async () => {
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance("Hooray! You did it! Amazing!");
    utterance.lang = 'en-US';
    utterance.rate = 1.1;
    utterance.pitch = 1.3;
    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.error("Celebration Audio Error:", error);
  }
};
