const fs = require('fs');
const path = require('path');

// Read the package.json file
const packageJson = require('./package.json');
const installedDependencies = Object.keys(packageJson.dependencies || {}).filter(dep => !dep.startsWith('@'));
const installedDevDependencies = Object.keys(packageJson.devDependencies || {});

const allInstalledPackages = [...installedDependencies, ...installedDevDependencies];

const directoryToSearch = './';


function findJavaScriptFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory() && path.basename(file) !== 'node_modules') {
      results = results.concat(findJavaScriptFiles(file));
    } else if (file.endsWith('.js')) {
      results.push(file);
    }
  });
  return results;
}

function findPackageReferences(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const packageReferences = new Set();
  installedDependencies.forEach(dep => {
    const regex = new RegExp(`require\\(['"]${dep}['"]\\)|import.*\\s${dep}|\\b${dep}\\b`, 'g');
    if (regex.test(fileContent)) {
      packageReferences.add(dep);
    }
  });
  return Array.from(packageReferences);
}

const javascriptFiles = findJavaScriptFiles(directoryToSearch);

// Store found package references
const foundPackageReferences = {};

javascriptFiles.forEach(file => {
  const references = findPackageReferences(file);
  if (references.length > 0) {
    foundPackageReferences[file] = references;
  }
});

// Log the found package references
console.log('Found package references:');
console.log(foundPackageReferences);

// Remove unused dependencies from package.json
const usedDependencies = new Set();
Object.values(foundPackageReferences).forEach(references => {
  references.forEach(dep => usedDependencies.add(dep));
});

const unusedDependencies = installedDependencies.filter(dep => !usedDependencies.has(dep));

if (unusedDependencies.length > 0) {
  console.log('\nUnused dependencies found. Removing them from package.json.');
  unusedDependencies.forEach(dep => {
    if (packageJson.dependencies.hasOwnProperty(dep)) {
      delete packageJson.dependencies[dep];
    } else if (packageJson.devDependencies.hasOwnProperty(dep)) {
      delete packageJson.devDependencies[dep];
    }
  });

  // Save the updated package.json
  fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
  console.log('Unused dependencies have been removed from package.json.');
} else {
  console.log('\nNo unused dependencies found. The package.json has not been changed.');
}
