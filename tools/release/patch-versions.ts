import { workspaceRoot } from '@nrwl/tao/src/utils/app-root';
import { execSync } from 'child_process';
import { readJsonSync, writeFileSync } from 'fs-extra';
import { join } from 'path';

   
// the role of this script is to update the version of a dependency ('0.0.0-development' by default) in the packages that used it
// for example, 'nx-spring-boot' contains a dependency on 'common' package
// after the release of 'common' package, we need to update the version of 'common' in 'nx-spring-boot' before releasing it

const distFolder = join(workspaceRoot, 'dist');
const packagesFolder = join(distFolder,'packages');

execSync('nx dep-graph --file dist/deps.json', { stdio: 'inherit'});

const depGraph =  readJsonSync(join(distFolder, 'deps.json'));
const packages = Object.keys(depGraph.graph.nodes).filter(name => !name.endsWith('-e2e') && name !== 'smoke');

const dependencies = depGraph.graph.dependencies;

packages.forEach(sourcePkgName => {
    const sourcePkg = readJsonSync(join(packagesFolder, sourcePkgName, 'package.json'));

    const dependencies = depGraph.graph.dependencies[sourcePkgName];
    dependencies.forEach(dep => {
        const target = dep.target;
        const depPkg = readJsonSync(join(packagesFolder, target, 'package.json'));
        const depPkgVersion = depPkg.version;
        const depPkgName = depPkg.name;

        if(depPkgVersion === '0.0.0-development') {
            return; // not released yet, we skip it
        }

        sourcePkg.dependencies[depPkgName] = depPkgVersion;
    });

    // write the patched package.json
    writeFileSync(join(packagesFolder, sourcePkgName, 'package.json'), JSON.stringify(sourcePkg, null, 2));

});

