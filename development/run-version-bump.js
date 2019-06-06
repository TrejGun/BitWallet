import promisify from "pify";
import fs from "fs";
import path from "path";
import manifest from "../app/manifest.json";
import versionBump from "./version-bump";

const bumpType = normalizeType(process.argv[2]);
const changelogPath = path.join(__dirname, "..", "CHANGELOG.md");
const manifestPath = path.join(__dirname, "..", "app", "manifest.json");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

start().catch(console.error);

async function start () {

  const changeBuffer = await readFile(changelogPath);
  const changelog = changeBuffer.toString();

  const newData = await versionBump(bumpType, changelog, manifest);

  const manifestString = JSON.stringify(newData.manifest, null, 2);

  await writeFile(changelogPath, newData.changelog);
  await writeFile(manifestPath, manifestString);

  console.log(`Bumped ${bumpType} to version ${newData.version}`);
}


function normalizeType (userInput) {
  const err = new Error("First option must be a type (major, minor, or patch)");
  if (!userInput || typeof userInput !== "string") {
    throw err;
  }

  const lower = userInput.toLowerCase();

  if (lower !== "major" && lower !== "minor" && lower !== "patch") {
    throw err;
  }

  return lower;
}
