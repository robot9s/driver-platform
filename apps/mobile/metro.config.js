const path = require('path')
const {getSentryExpoConfig} = require('@sentry/react-native/metro')
const {withNativeWind} = require('nativewind/metro')

/** @type {import('expo/metro-config').MetroConfig} */
const config = getSentryExpoConfig(__dirname)

// Metro watches the whole monorepo root. Exclude trees the mobile bundle can
// never import at runtime — keeps the file map small enough for Windows file
// handle limits (EMFILE) and speeds up startup. Type-only imports from
// @repo/api and @repo/auth are erased at compile time and never reach Metro.
// Patterns are anchored to the monorepo root so package-internal dirs with
// the same names (e.g. react-native's Libraries/vendor) are unaffected.
const monorepoRoot = path.resolve(__dirname, '../..')
const escapeForRegex = (s) => s.replace(/[.*+?^${}()|[\]]/g, '\\$&')
const toPattern = (p) => escapeForRegex(p.replaceAll('\\', '/')).replaceAll('/', String.raw`[/\\]`)
const blockDir = (dir) => new RegExp(`^${toPattern(path.join(monorepoRoot, dir))}[/\\\\].*`)

const projectBlockList = [
  blockDir('vendor'),
  blockDir('docs'),
  blockDir('.git'),
  blockDir('apps/saas'),
  blockDir('apps/marketing'),
  blockDir('apps/docs'),
  blockDir('apps/mail-preview'),
  blockDir('tooling'),
  blockDir('apps/mobile/android'),
  blockDir('apps/mobile/ios'),
]
const existingBlockList = config.resolver.blockList
config.resolver.blockList = [
  ...(Array.isArray(existingBlockList) ? existingBlockList : existingBlockList ? [existingBlockList] : []),
  ...projectBlockList,
]

module.exports = withNativeWind(config, {input: './src/application/global.css'})
