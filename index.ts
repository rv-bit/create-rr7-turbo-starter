import chalk from 'chalk'
import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import path from 'path'
import inquirer from 'inquirer'
import minimist from 'minimist'
import simpleGit from 'simple-git'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const TEMPLATES_DIR = path.join(__dirname, 'templates')

if (!fs.existsSync(TEMPLATES_DIR)) {
	console.error(chalk.red(`\n❌ Templates directory "${TEMPLATES_DIR}" does not exist. Please ensure you have the correct setup.\n`))
	process.exit(1)
}

const args = minimist(process.argv.slice(2), {
	alias: {
		t: 'template',
		n: 'name',
		g: 'git',
		e: 'env',
		h: 'help',
	},
	boolean: ['git', 'env', 'help'],
})

if (args.help) {
	console.log(`
        Usage: create-rr7-turbo-starter [options]

        Options:
        --template, -t     Name of the template to use (e.g., cloudflare, railway)
        --name, -n         Name of your new project
        --help, -h         Show this help message

        Examples:
        create-rr7-turbo-starter
        create-rr7-turbo-starter --template railway --name my-app
        create-rr7-turbo-starter -t cloudflare -n edge-app --git --env
    `)
	process.exit(0)
}

const passedTemplate = args.template || args.t
const passedProjectName = args.name || args.n
const passedInitGit = args.git || false

;(async () => {
	console.log(chalk.cyan.bold('\n🚀 Create a new project from a template\n'))

	const templates = fs.readdirSync(TEMPLATES_DIR).filter((dir) => fs.statSync(path.join(TEMPLATES_DIR, dir)).isDirectory())

	let template = passedTemplate
	let projectName = passedProjectName
	let initGit = passedInitGit

	if (!template || !templates.includes(template)) {
		if (template && !templates.includes(template)) {
			console.log(chalk.red(`\n❌ Template "${template}" not found. Showing available options...\n`))
		}

		const answers = await inquirer.prompt([
			{
				name: 'template',
				type: 'list',
				message: 'Which template do you want to use?',
				choices: templates,
				when: () => !template || !templates.includes(template),
			},
		])
		template = answers.template || template
	}

	if (!projectName) {
		const answers = await inquirer.prompt([
			{
				name: 'projectName',
				type: 'input',
				message: 'Project name:',
				validate: (input) => !!input || 'Project name cannot be empty.',
			},
		])
		projectName = answers.projectName
	}

	const templatePath = path.join(TEMPLATES_DIR, template)
	const targetPath = path.join(process.cwd(), projectName)

	if (fs.existsSync(targetPath)) {
		console.log(chalk.red(`\n❌ Folder "${projectName}" already exists.`))
		process.exit(1)
	}

	await fs.copy(templatePath, targetPath)

	const envTemplate = path.join(templatePath, '.env.example')
	const envTarget = path.join(targetPath, '.env')
	if (fs.existsSync(envTemplate)) {
		await fs.copy(envTemplate, envTarget)
		await fs.unlink(path.join(targetPath, '.env.example')) // Remove this from the folder created
		console.log(chalk.green('📄 .env file created from .env.example'))
	} else {
		await fs.outputFile(envTarget, '# Your environment variables\n')
		console.log(chalk.green('📄 Blank .env file generated'))
	}

	if (!initGit) {
		const answers = await inquirer.prompt([
			{
				name: 'initGit',
				type: 'confirm',
				message: 'Would you like to initialize git:',
			},
		])

		initGit = answers.initGit
	}

	if (initGit) {
		const git = simpleGit(targetPath)
		await git.init()
		await git.add('.')
		await git.commit('Initial commit from starter CLI')

		console.log(chalk.green('🔧 Git repo initialized'))
	}

	console.log(chalk.green(`\n✅ Project "${projectName}" created using "${template}" template!`))
	console.log(chalk.yellow(`\nNext steps:`))
	console.log(`  cd ${projectName}`)
	console.log(`  bun install (or npm/yarn/pnpm)`)
	console.log(`  bun dev`)
})()
