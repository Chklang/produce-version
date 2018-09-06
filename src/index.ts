import * as child_process from "child_process";
import * as fs from "fs";
import * as semVer from "semver";
// import * as conventionalChangelog from "conventional-changelog";
const conventionalChangelog = require('conventional-changelog');
import * as minimist from "minimist";

const args = minimist.default(process.argv);
const nextVersion = args['tagversion'];
const gitExecution: boolean = args['git-publish'] !== "false"
if (!semVer.valid(nextVersion)) {
    throw new Error('Version ' + nextVersion + ' isn\'t a valid semver!');
}
Promise.resolve().then(() => {
    const packageJsonContent = JSON.parse(fs.readFileSync('package.json').toString());
    if (packageJsonContent.version !== nextVersion) {
        packageJsonContent.version = nextVersion;
        fs.writeFileSync('package.json', JSON.stringify(packageJsonContent, null, 2));
    }
}).then(() => {
    const changeLog = fs.createWriteStream('CHANGELOG.md');
    return new Promise((resolve, reject) => {
        conventionalChangelog({
            preset: 'angular',
            releaseCount: 0
        }).pipe(changeLog).on("close", () => {
            resolve();
        });
    });
}).then(() => {
    if (gitExecution) {
        child_process.execSync('git add package.json CHANGELOG.md');
        child_process.execSync('git commit -m "Produce version ' + nextVersion + '"');
        child_process.execSync('git tag "v' + nextVersion + '"');
        child_process.execSync('git push');
    }
});
