import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const cssExempt = new Set([
	'components/ui/.figma-ui-components.css',
]);

const tsxDirectoryExemptions = [
	path.join(repoRoot, 'src', 'components', 'ui'),
];

const cssNameOverrides = new Map([
	['components/navigation/Navigation.tsx', 'nav-shell'],
]);

const errors = [];

await validateCssHierarchy();
await validateComponentStyleImports();

if (errors.length > 0) {
	console.error('Style architecture violations detected:');
	for (const message of errors) {
		console.error(` - ${message}`);
	}
	process.exitCode = 1;
} else {
	console.log('Style architecture validation passed.');
}

async function validateCssHierarchy() {
	const cssRoot = path.join(repoRoot, 'src', 'styles');
	const cssFiles = await walk(cssRoot, (filePath) => filePath.endsWith('.css'));

	for (const filePath of cssFiles) {
		const relativePath = toPosix(path.relative(cssRoot, filePath));

		if (cssExempt.has(relativePath)) {
			continue;
		}

		const content = await readFile(filePath, 'utf8');
		const imports = extractCssImports(content);

		if (relativePath === 'globals.css') {
			// Base token file; no import requirements beyond existing declarations.
			continue;
		}

		if (relativePath === 'themes.css') {
			if (imports.length !== 1 || imports[0] !== './globals.css') {
				errors.push(`[CSS] ${relativePath} must import exactly './globals.css'.`);
			}
			continue;
		}

		const isSharedFile = relativePath.endsWith('.shared.css');

		if (isSharedFile) {
			const expectedImport = expectedSharedImport(relativePath);

			if (imports.length !== 1 || imports[0] !== expectedImport) {
				errors.push(
					`[CSS] ${relativePath} must import exactly '${expectedImport}' (found ${imports.length === 0 ? 'none' : `'${imports.join(", ")}'`}).`
				);
			}
			continue;
		}

		if (imports.length !== 1 || imports[0] !== './.shared.css') {
			errors.push(
				`[CSS] ${relativePath} must import exactly './.shared.css' (found ${imports.length === 0 ? 'none' : `'${imports.join(", ")}'`}).`
			);
		}
	}
}

async function validateComponentStyleImports() {
	const checks = [
		{ kind: 'components', dir: path.join(repoRoot, 'src', 'components') },
		{ kind: 'content', dir: path.join(repoRoot, 'src', 'content') },
	];

	for (const { kind, dir } of checks) {
		const tsxFiles = await walk(dir, (filePath) => filePath.endsWith('.tsx'));

		for (const filePath of tsxFiles) {
			if (isTsxExempt(filePath)) {
				continue;
			}

			const fileContent = await readFile(filePath, 'utf8');
			const cssImports = extractCssImports(fileContent);

			if (cssImports.length > 1) {
				errors.push(`[TSX] ${relativeToSrc(filePath)} should not import more than one CSS file.`);
				continue;
			}

			if (cssImports.length === 0) {
				continue;
			}

			const importTarget = cssImports[0];
			const expectedPrefix = `@/styles/${kind}/`;

			if (!importTarget.startsWith(expectedPrefix)) {
				errors.push(
					`[TSX] ${relativeToSrc(filePath)} must import styles via '${expectedPrefix}…' (found '${importTarget}').`
				);
				continue;
			}

			const cssRelativePath = importTarget.substring(expectedPrefix.length);
			const tsxRelativePath = toPosix(path.relative(dir, filePath));
			const cssDir = normalizeDir(path.posix.dirname(cssRelativePath));
			const tsxDir = normalizeDir(path.posix.dirname(tsxRelativePath));

			if (tsxDir && cssDir !== tsxDir) {
				errors.push(
					`[TSX] ${relativeToSrc(filePath)} must load styles from '${expectedPrefix}${tsxDir}/…', but uses '${importTarget}'.`
				);
				continue;
			}

			const cssBaseName = path.posix.basename(cssRelativePath, '.css');
			const tsxBaseName = path.posix.basename(tsxRelativePath, '.tsx');
			const overrideKey = `${kind}/${tsxRelativePath}`;
			const expectedBaseName = cssNameOverrides.get(overrideKey) ?? toKebabCase(tsxBaseName);

			if (cssBaseName !== expectedBaseName) {
				errors.push(
					`[TSX] ${relativeToSrc(filePath)} should import '${expectedPrefix}${tsxDir ? `${tsxDir}/` : ''}${expectedBaseName}.css' (found '${importTarget}').`
				);
			}
		}
	}
}

function expectedSharedImport(relativePath) {
	const segments = relativePath.split('/');
	const directoryDepth = segments.length - 1;

	if (directoryDepth <= 1) {
		return '../themes.css';
	}

	return '../.shared.css';
}

function extractCssImports(source) {
	const matches = source.matchAll(/@import\s+['"]([^'"\s]+)['"];?/g);
	const esModuleMatches = source.matchAll(/import\s+[^'"\n]+['"]([^'"\n]+\.css)['"]/g);
	const results = [];

	for (const match of matches) {
		results.push(match[1]);
	}

	for (const match of esModuleMatches) {
		results.push(match[1]);
	}

	return results;
}

async function walk(dir, predicate) {
	const entries = await readdir(dir, { withFileTypes: true });
	const files = [];

	for (const entry of entries) {
		if (entry.name === 'node_modules' || entry.name === '.git') {
			continue;
		}

		const entryPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			files.push(...await walk(entryPath, predicate));
		} else if (!predicate || predicate(entryPath)) {
			files.push(entryPath);
		}
	}

	return files;
}

function isTsxExempt(filePath) {
	return tsxDirectoryExemptions.some((excludedDir) => filePath.startsWith(excludedDir + path.sep));
}

function relativeToSrc(filePath) {
	return toPosix(path.relative(path.join(repoRoot, 'src'), filePath));
}

function toPosix(inputPath) {
	return inputPath.split(path.sep).join('/');
}

function normalizeDir(dir) {
	return dir === '.' ? '' : dir;
}

function toKebabCase(text) {
	return text
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
		.replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
		.replace(/[\s_]+/g, '-')
		.toLowerCase();
}
