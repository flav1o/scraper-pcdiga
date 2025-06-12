export const ES_TRIGRAM_SETTINGS = {
  settings: {
    analysis: {
      tokenizer: {
        trigram_tokenizer: {
          type: 'ngram',
          min_gram: 2,
          max_gram: 3,
          token_chars: ['letter', 'digit'],
        },
      },
      analyzer: {
        trigram_analyzer: {
          type: 'custom',
          tokenizer: 'trigram_tokenizer',
        },
      },
    },
  },
  mappings: {
    properties: {
      name: {
        type: 'text',
        analyzer: 'trigram_analyzer',
        search_analyzer: 'standard',
      },
    },
  },
};
