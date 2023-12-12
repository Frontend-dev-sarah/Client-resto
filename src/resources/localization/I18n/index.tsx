import I18n from 'i18n-js';
import * as Localization from 'expo-localization';

// import locales
import fr from './fr';

// Setup
I18n.fallbacks = true;

I18n.translations = { fr, en: fr };
I18n.locale = Localization.locale;

export default I18n;
