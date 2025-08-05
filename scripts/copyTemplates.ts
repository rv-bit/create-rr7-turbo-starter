import fs from 'fs'
import path from 'path'

function copyRecursive(src: string, dest: string) {
	if (!fs.existsSync(src)) return

	const stats = fs.statSync(src)
	if (stats.isDirectory()) {
		fs.mkdirSync(dest, { recursive: true })
		for (const entry of fs.readdirSync(src)) {
			const srcPath = path.join(src, entry)
			const destPath = path.join(dest, entry)
			copyRecursive(srcPath, destPath)
		}
	} else {
		fs.mkdirSync(path.dirname(dest), { recursive: true })
		fs.copyFileSync(src, dest)
	}
}

const [srcArg, destArg] = process.argv.slice(2)

if (!srcArg || !destArg) {
	console.error('Usage: node copyTemplates.js <source> <destination>')
	process.exit(1)
}

copyRecursive(srcArg, destArg)
