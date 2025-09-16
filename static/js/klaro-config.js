var klaroConfig = {
    version: 1,
    elementID: 'klaro',
    storageMethod: 'localStorage',
    cookieName: 'klaro',
    htmlTexts: true,
    acceptAll: true,
    hideDeclineAll: false,
    translations: {
        de: {
            consentModal: {
                title: 'Cookies & Datenschutz',
                description: 'Wir nutzen Cookies, um unsere Website und Werbedienste zu verbessern. Bitte wählen Sie, welche Sie erlauben möchten.',
            },
            acceptAll: 'Alle akzeptieren',
            decline: 'Nur notwendige Cookies',
            purposes: {
                analytics: 'Besucherstatistiken (Google Analytics)',
                ads: 'Marketing & Werbung (Google Ads)',
            },
        }
    },
    services: [
        {
            name: 'google-analytics',
            purposes: ['analytics'],
            cookies: [/^_ga/, /^_gid/, /^_gat/],
        },
        {
            name: 'google-ads',
            purposes: ['ads'],
            cookies: [/^_gcl/, /^_gads/],
        },
    ],
};