/**
 * Thin wrapper that strips Jest-only flags (e.g. --watchAll=false)
 * before forwarding to `vitest run`, which doesn't recognise them.
 */
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'

const JEST_ONLY_FLAGS = new Set([
  '--watchAll',
  '--watchAll=false',
  '--watchAll=true',
  '--watch',
  '--coverage',        // vitest uses --coverage differently; keep safe
  '--forceExit',
  '--passWithNoTests',
  '--testPathPattern',
  '--testNamePattern',
  '--runInBand',
  '--bail',
])

// Strip any flag whose prefix matches a Jest-only flag
const extraArgs = process.argv.slice(2).filter((arg) => {
  const key = arg.split('=')[0]
  return !JEST_ONLY_FLAGS.has(arg) && !JEST_ONLY_FLAGS.has(key)
})

const __dirname = dirname(fileURLToPath(import.meta.url))
const vitestBin = join(__dirname, 'node_modules', '.bin', 'vitest')

const child = spawn(
  process.execPath,                          // node
  [vitestBin, 'run', ...extraArgs],
  { stdio: 'inherit', shell: false }
)

child.on('exit', (code) => process.exit(code ?? 0))
