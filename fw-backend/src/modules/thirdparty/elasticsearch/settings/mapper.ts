import { AvailableIndexes } from '../types';
import { ES_TRIGRAM_SETTINGS } from './trigram';

export const indexSettingsMapper = {
  [AvailableIndexes.Products]: ES_TRIGRAM_SETTINGS,
};
