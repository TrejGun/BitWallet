#!/usr/bin/env node
import pify from "pify";
const exec = pify(require("child_process").exec, {multiArgs: true});
import manifest from "../dist/chrome/manifest.json";
const {version} = manifest;

start().catch(console.error);

async function start () {
  const authWorked = await checkIfAuthWorks();
  if (!authWorked) {
    console.log(`Sentry auth failed...`);
  }
  // check if version exists or not
  const versionAlreadyExists = await checkIfVersionExists();
  // abort if versions exists
  if (versionAlreadyExists) {
    console.log(`Version "${version}" already exists on Sentry, aborting sourcemap upload.`);
    return;
  }

  // create sentry release
  console.log(`creating Sentry release for "${version}"...`);
  await exec(`sentry-cli releases --org 'metamask' --project 'metamask' new ${version}`);
  console.log(`removing any existing files from Sentry release "${version}"...`);
  await exec(`sentry-cli releases --org 'metamask' --project 'metamask' files ${version} delete --all`);
  // upload sentry source and sourcemaps
  console.log(`uploading source files Sentry release "${version}"...`);
  await exec(`for FILEPATH in ./dist/chrome/*.js; do [ -e $FILEPATH ] || continue; export FILE=\`basename $FILEPATH\` && echo uploading $FILE && sentry-cli releases --org 'metamask' --project 'metamask' files ${version} upload $FILEPATH metamask/$FILE; done;`);
  console.log(`uploading sourcemaps Sentry release "${version}"...`);
  await exec(`sentry-cli releases --org 'metamask' --project 'metamask' files ${version} upload-sourcemaps ./dist/sourcemaps/ --url-prefix 'sourcemaps'`);
  console.log("all done!");
}

async function checkIfAuthWorks () {
  const itWorked = await doesNotFail(async () => {
    await exec(`sentry-cli releases --org 'metamask' --project 'metamask' list`);
  });
  return itWorked;
}

async function checkIfVersionExists () {
  const versionAlreadyExists = await doesNotFail(async () => {
    await exec(`sentry-cli releases --org 'metamask' --project 'metamask' info ${version}`);
  });
  return versionAlreadyExists;
}

async function doesNotFail (asyncFn) {
  try {
    await asyncFn();
    return true;
  } catch (err) {
    return false;
  }
}
