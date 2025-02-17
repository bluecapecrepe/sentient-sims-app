/* eslint-disable no-console */
import '@testing-library/jest-dom';
import { OpenAIService } from 'main/sentient-sims/services/OpenAIService';
import { SettingsService } from 'main/sentient-sims/services/SettingsService';
import { SettingsEnum } from 'main/sentient-sims/models/SettingsEnum';
import {
  OpenAIRequestBuilder,
  PromptRequest2,
} from 'main/sentient-sims/models/OpenAIRequestBuilder';
import { OpenAITokenCounter } from 'main/sentient-sims/tokens/OpenAITokenCounter';

describe('OpenAIServiceIT', () => {
  let settingsService: SettingsService;
  let openAIService: OpenAIService;
  let builder: OpenAIRequestBuilder;

  beforeEach(() => {
    settingsService = new SettingsService();
    openAIService = new OpenAIService(settingsService);
    builder = new OpenAIRequestBuilder(new OpenAITokenCounter());
  });

  it('sentientSimsGenerate', async () => {
    const promptRequest: PromptRequest2 = {
      participants: 'Gus',
      location: 'Square cube',
      memories: [],
      action: 'Looks around',
      systemPrompt: 'system prompt',
      maxResponseTokens: 90,
      maxTokens: 3900,
    };
    const request = builder.buildOpenAIRequest(promptRequest);
    const result = await openAIService.sentientSimsGenerate(request);
    expect(result.request.messages[0].content).toEqual(
      [
        promptRequest.systemPrompt,
        promptRequest.location,
        promptRequest.participants,
      ].join('\n\n')
    );
    expect(result.text).toContain('Gus');
  }, 20000);

  it('translation', async () => {
    // No way this test is gonna pass every time
    settingsService.set(SettingsEnum.LOCALIZATION_ENABLED, true);
    settingsService.set(SettingsEnum.LOCALIZATION_LANGUAGE, 'Spanish');
    const systemPrompt = 'Return the text "Alright?"';
    const promptRequest: PromptRequest2 = {
      participants: '',
      location: '',
      memories: [],
      systemPrompt,
      maxResponseTokens: 3900,
      maxTokens: 90,
    };
    const request = builder.buildOpenAIRequest(promptRequest);
    const result = await openAIService.sentientSimsGenerate(request);
    console.log(`Translation: ${result.text}`);
    const possibleMatches = ['acuerdo?', 'bien?'];
    const isMatch = possibleMatches.some((item) =>
      result.text.toLocaleLowerCase().includes(item)
    );
    expect(isMatch).toBeTruthy();
  }, 20000);

  it('test works', async () => {
    const result = await openAIService.healthCheck();
    expect(result.status).toEqual('OK');
  });
});
