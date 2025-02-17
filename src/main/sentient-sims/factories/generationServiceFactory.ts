import { GenerationService } from '../services/GenerationService';
import { SettingsEnum } from '../models/SettingsEnum';
import { OpenAIService } from '../services/OpenAIService';
import { SettingsService } from '../services/SettingsService';
import { SentientSimsAIService } from '../services/SentientSimsAIService';
import { TokenCounter } from '../tokens/TokenCounter';
import { LLaMaTokenCounter } from '../tokens/LLaMaTokenCounter';
import { OpenAITokenCounter } from '../tokens/OpenAITokenCounter';
import { ApiType } from '../models/ApiType';
import { NovelAIService } from '../services/NovelAIService';
import { NovelAITokenCounter } from '../tokens/NovelAITokenCounter';

export function getGenerationService(
  settingsService: SettingsService
): GenerationService {
  const aiType = settingsService.get(SettingsEnum.AI_API_TYPE);
  if (aiType === ApiType.SentientSimsAI || aiType === ApiType.CustomAI) {
    return new SentientSimsAIService(settingsService);
  }

  if (aiType === ApiType.NovelAI) {
    return new NovelAIService(settingsService);
  }

  return new OpenAIService(settingsService);
}

export function getTokenCounter(
  settingsService: SettingsService
): TokenCounter {
  const aiType = settingsService.get(SettingsEnum.AI_API_TYPE);

  if (aiType === ApiType.NovelAI) {
    return new NovelAITokenCounter();
  }

  if (aiType === ApiType.OpenAI) {
    return new OpenAITokenCounter();
  }

  return new LLaMaTokenCounter();
}
