import i18n from 'sveltekit-i18n';
import lang from './lang.json';

/** @type {import('sveltekit-i18n').Config} */
export const config = {
    translations: {
        "en": { lang },
        "zh-CN": { lang },
    },
    loaders: [
        //EN
        {
            locale: 'en',
            key: 'sidebar',
            loader: async () => (await import('./en/sidebar.json')).default,
        },
        {
            locale: 'en',
            key: 'setting',
            loader: async () => (await import('./en/setting.json')).default,
        },
        {
            locale: 'en',
            key: 'device',
            loader: async () => (await import('./en/device.json')).default,
        },
        {
            locale: 'en',
            key: 'demoplay',
            loader: async () => (await import('./en/demoplay.json')).default,
        },
        {
            locale: 'en',
            key: 'toast',
            loader: async () => (await import('./en/toast.json')).default,
        },
        {
            locale: 'en',
            key: 'color',
            loader: async () => (await import('./en/color.json')).default,
        },
        //ZH-CN
        {
            locale: 'zh-CN',
            key: 'sidebar',
            loader: async () => (await import('./zh-cn/sidebar.json')).default,
        },
        {
            locale: 'zh-CN',
            key: 'setting',
            loader: async () => (await import('./zh-cn/setting.json')).default,
        },
        {
            locale: 'zh-CN',
            key: 'device',
            loader: async () => (await import('./zh-cn/device.json')).default,
        },
        {
            locale: 'zh-CN',
            key: 'demoplay',
            loader: async () => (await import('./zh-cn/demoplay.json')).default,
        },
        {
            locale: 'zh-CN',
            key: 'toast',
            loader: async () => (await import('./zh-cn/toast.json')).default,
        },
        {
            locale: 'zh-CN',
            key: 'color',
            loader: async () => (await import('./zh-cn/color.json')).default,
        },
    ],
};

export const { t, loading, locales, locale, loadTranslations } = new i18n(config);

loading.subscribe(($loading) => $loading && console.log('Loading localizations...'));