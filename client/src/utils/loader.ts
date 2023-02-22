import * as fs from 'fs';
import i18next from 'i18next';
import i18nbackend from 'i18next-fs-backend';
import { logger } from './logger';
export async function loadLocales(path: string): Promise<void> {
    try {
        logger.info("Loading locales...")
        await i18next.use(i18nbackend).init({
            ns: ["commands", "events", "permissions"],
            defaultNS: "commands",
            preload: fs.readdirSync(path),
            fallbackLng: "pt-BR",
            backend: { loadPath: `${path}/{{lng}}/{{ns}}.json` },
            interpolation: {
                escapeValue: false,
                useRawValueToEscape: true
            },
            returnEmptyString: false,
            returnObjects: true
        });
        return logger.success(`Loaded ${i18next.languages.length} languages!`, "LOCALES");
    } catch (error) {
        return logger.error(`failed to load locales: `, error);
    }
}