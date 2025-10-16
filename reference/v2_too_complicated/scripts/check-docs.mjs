import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const files = ['docs/UseCase.md', 'docs/yaml.md']
const bad = []
for (const file of files) {
  const txt = readFileSync(resolve(file), 'utf8')
  if (txt.match(/#[A-Z]/)) bad.push(file)
}
if (bad.length) {
  console.error('Invalid anchors in', bad.join(', '))
  process.exit(1)
}
