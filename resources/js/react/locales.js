// dayjs locale imports — registers each locale globally with dayjs
import 'dayjs/locale/ar'
import 'dayjs/locale/ar-sa'
import 'dayjs/locale/be'
import 'dayjs/locale/bg'
import 'dayjs/locale/bn'
import 'dayjs/locale/bn-bd'
import 'dayjs/locale/ca'
import 'dayjs/locale/cs'
import 'dayjs/locale/da'
import 'dayjs/locale/de'
import 'dayjs/locale/el'
import 'dayjs/locale/en'
import 'dayjs/locale/en-gb'
import 'dayjs/locale/es'
import 'dayjs/locale/es-mx'
import 'dayjs/locale/et'
import 'dayjs/locale/eu'
import 'dayjs/locale/fa'
import 'dayjs/locale/fi'
import 'dayjs/locale/fr'
import 'dayjs/locale/fr-ca'
import 'dayjs/locale/he'
import 'dayjs/locale/hi'
import 'dayjs/locale/hr'
import 'dayjs/locale/hu'
import 'dayjs/locale/hy-am'
import 'dayjs/locale/id'
import 'dayjs/locale/is'
import 'dayjs/locale/it'
import 'dayjs/locale/ja'
import 'dayjs/locale/ka'
import 'dayjs/locale/kk'
import 'dayjs/locale/km'
import 'dayjs/locale/kn'
import 'dayjs/locale/ko'
import 'dayjs/locale/lo'
import 'dayjs/locale/lt'
import 'dayjs/locale/lv'
import 'dayjs/locale/mk'
import 'dayjs/locale/ml'
import 'dayjs/locale/mn'
import 'dayjs/locale/mr'
import 'dayjs/locale/ms'
import 'dayjs/locale/ms-my'
import 'dayjs/locale/my'
import 'dayjs/locale/nb'
import 'dayjs/locale/ne'
import 'dayjs/locale/nl'
import 'dayjs/locale/nn'
import 'dayjs/locale/pa-in'
import 'dayjs/locale/pl'
import 'dayjs/locale/pt'
import 'dayjs/locale/pt-br'
import 'dayjs/locale/ro'
import 'dayjs/locale/ru'
import 'dayjs/locale/si'
import 'dayjs/locale/sk'
import 'dayjs/locale/sl'
import 'dayjs/locale/sq'
import 'dayjs/locale/sr'
import 'dayjs/locale/sv'
import 'dayjs/locale/sw'
import 'dayjs/locale/ta'
import 'dayjs/locale/te'
import 'dayjs/locale/th'
import 'dayjs/locale/tl-ph'
import 'dayjs/locale/tr'
import 'dayjs/locale/uk'
import 'dayjs/locale/ur'
import 'dayjs/locale/vi'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/zh-hk'
import 'dayjs/locale/zh-tw'

// MUI x-date-pickers built-in locale texts (40 languages)
import {
    beBY,
    bgBG,
    bnBD,
    caES,
    csCZ,
    daDK,
    deDE,
    elGR,
    enUS,
    esES,
    eu,
    faIR,
    fiFI,
    frFR,
    heIL,
    hrHR,
    huHU,
    isIS,
    itIT,
    jaJP,
    koKR,
    kzKZ,
    mk,
    nbNO,
    nlNL,
    nnNO,
    plPL,
    ptBR,
    ptPT,
    roRO,
    ruRU,
    skSK,
    svSE,
    trTR,
    ukUA,
    urPK,
    viVN,
    zhCN,
    zhHK,
    zhTW,
} from '@mui/x-date-pickers/locales'

// Extract localeText from MUI locale object
function text(muiLocale) {
    return muiLocale.components.MuiLocalizationProvider.defaultProps.localeText
}

// Mapping: locale code → { dayjs locale name, MUI localeText (if available) }
// MUI-provided locales get built-in JS translations.
// Other locales get their translations from PHP lang files instead.
const localeMap = {
    // MUI-provided locales (JS translations from npm package)
    be: { dayjs: 'be', mui: text(beBY) },
    bg: { dayjs: 'bg', mui: text(bgBG) },
    bn: { dayjs: 'bn-bd', mui: text(bnBD) },
    bn_BD: { dayjs: 'bn-bd', mui: text(bnBD) },
    ca: { dayjs: 'ca', mui: text(caES) },
    cs: { dayjs: 'cs', mui: text(csCZ) },
    da: { dayjs: 'da', mui: text(daDK) },
    de: { dayjs: 'de', mui: text(deDE) },
    el: { dayjs: 'el', mui: text(elGR) },
    en: { dayjs: 'en', mui: text(enUS) },
    en_GB: { dayjs: 'en-gb', mui: text(enUS) },
    es: { dayjs: 'es', mui: text(esES) },
    es_MX: { dayjs: 'es-mx', mui: text(esES) },
    eu: { dayjs: 'eu', mui: text(eu) },
    fa: { dayjs: 'fa', mui: text(faIR) },
    fi: { dayjs: 'fi', mui: text(fiFI) },
    fr: { dayjs: 'fr', mui: text(frFR) },
    fr_CA: { dayjs: 'fr-ca', mui: text(frFR) },
    he: { dayjs: 'he', mui: text(heIL) },
    hr: { dayjs: 'hr', mui: text(hrHR) },
    hu: { dayjs: 'hu', mui: text(huHU) },
    is: { dayjs: 'is', mui: text(isIS) },
    it: { dayjs: 'it', mui: text(itIT) },
    ja: { dayjs: 'ja', mui: text(jaJP) },
    kk: { dayjs: 'kk', mui: text(kzKZ) },
    ko: { dayjs: 'ko', mui: text(koKR) },
    mk: { dayjs: 'mk', mui: text(mk) },
    nb: { dayjs: 'nb', mui: text(nbNO) },
    nl: { dayjs: 'nl', mui: text(nlNL) },
    nn: { dayjs: 'nn', mui: text(nnNO) },
    pl: { dayjs: 'pl', mui: text(plPL) },
    pt: { dayjs: 'pt', mui: text(ptPT) },
    pt_BR: { dayjs: 'pt-br', mui: text(ptBR) },
    pt_PT: { dayjs: 'pt', mui: text(ptPT) },
    ro: { dayjs: 'ro', mui: text(roRO) },
    ru: { dayjs: 'ru', mui: text(ruRU) },
    sk: { dayjs: 'sk', mui: text(skSK) },
    sv: { dayjs: 'sv', mui: text(svSE) },
    tr: { dayjs: 'tr', mui: text(trTR) },
    uk: { dayjs: 'uk', mui: text(ukUA) },
    ur: { dayjs: 'ur', mui: text(urPK) },
    vi: { dayjs: 'vi', mui: text(viVN) },
    zh: { dayjs: 'zh-cn', mui: text(zhCN) },
    zh_CN: { dayjs: 'zh-cn', mui: text(zhCN) },
    zh_HK: { dayjs: 'zh-hk', mui: text(zhHK) },
    zh_TW: { dayjs: 'zh-tw', mui: text(zhTW) },

    // Locales without MUI translations — UI text comes from PHP lang files
    ar: { dayjs: 'ar' },
    ar_SA: { dayjs: 'ar-sa' },
    ms: { dayjs: 'ms' },
    ms_MY: { dayjs: 'ms-my' },
    ta: { dayjs: 'ta' },
    th: { dayjs: 'th' },
    hi: { dayjs: 'hi' },
    id: { dayjs: 'id' },
    sw: { dayjs: 'sw' },
    fil: { dayjs: 'tl-ph' },
    tl: { dayjs: 'tl-ph' },
    km: { dayjs: 'km' },
}

/**
 * Resolve locale info for a given locale code.
 * Supports: 'fr', 'fr_FR', 'fr-FR', 'pt_BR', 'zh-CN', etc.
 * Falls back to base language if regional variant not found.
 */
export function resolveLocale(locale) {
    if (!locale) {
        return { dayjsLocale: 'en', localeText: undefined }
    }

    // Normalize hyphens to underscores for lookup
    const normalized = locale.replace('-', '_')

    // Exact match
    if (localeMap[normalized]) {
        return {
            dayjsLocale: localeMap[normalized].dayjs,
            localeText: localeMap[normalized].mui,
        }
    }

    // Base language fallback (e.g., 'fr_CA' → 'fr')
    const base = normalized.split('_')[0]
    if (localeMap[base]) {
        return {
            dayjsLocale: localeMap[base].dayjs,
            localeText: localeMap[base].mui,
        }
    }

    // Unknown locale — pass through to dayjs, no MUI text
    return {
        dayjsLocale: locale.toLowerCase().replace('_', '-'),
        localeText: undefined,
    }
}
