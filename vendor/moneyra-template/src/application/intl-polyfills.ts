/* eslint-disable import/extensions */
// Polyfill Intl for iOS hermes
// (1) Always required
import '@formatjs/intl-getcanonicallocales/polyfill-force.js'
import '@formatjs/intl-locale/polyfill-force.js'
// (2) Required for Intl.RelativeTimeFormat and Intl.DateTimeFormat
import '@formatjs/intl-pluralrules/polyfill-force.js'
import '@formatjs/intl-pluralrules/locale-data/en.js'
import '@formatjs/intl-numberformat/polyfill-force.js'
import '@formatjs/intl-numberformat/locale-data/en.js'
import '@formatjs/intl-relativetimeformat/polyfill-force.js'
import '@formatjs/intl-relativetimeformat/locale-data/en.js'
