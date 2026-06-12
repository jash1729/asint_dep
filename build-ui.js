/* eslint-disable */

const { exec } = require("child_process");
const os = require("os");

const buildCMD = "ui5 build preload --clean-dest --config ui5-deploy.yaml --include-task=generateCachebusterInfo";
const rootFolder = __dirname; // Replace with the root folder If It isn't working

const subfolders = [
    "asint_ais_library",
    "asint_ais_cml_config"    
]; // UI folders

const cpus = os.cpus().length;
const batchSize = Math.max(1, cpus - 1);

const queue = [...subfolders];

let failedToBuild = [];
let activeProcess = 0;

function execute(cmd, cwd) {
    return new Promise((resolve, reject) => {
        exec(cmd, { cwd }, (error, stdout, stderr) => {
            console.log(stdout);
            console.error(stderr);
            error ? reject({ cwd, error }) : resolve(cwd);
        });

    });
}

async function processQueue() {
    while (queue.length > 0 && activeProcess < batchSize) {
        let folder = queue.shift();
        let cwd = rootFolder + "/" + folder;
        
        activeProcess++;

        execute(buildCMD, cwd)
            .then(() => {
                console.log(`Successfully built ${folder}\n\n----------------------------------------------------------------------------------------------`)
            })
            .catch((error) => {
                console.log(`Failed to build ${folder}: ${error}\n\n----------------------------------------------------------------------------------------------`);
                failedToBuild.push(folder);
            })
            .finally(() => {
                activeProcess--;
                processQueue();
            });
    }
}

(async function () {
    console.log("##############################################################################################\n\nStarting UI build\n\n##############################################################################################\n\n");

    for (let i = 0; i < batchSize; i++) {
        processQueue();
    }

    while (activeProcess > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (failedToBuild.length > 0) {
        console.log(`\nThe following modules failed to build:\n${failedToBuild.join(", ")}\n\n##############################################################################################`);
    } else {
        console.log(`\nAll modules built successfully\n\n##############################################################################################`);
    }
})();