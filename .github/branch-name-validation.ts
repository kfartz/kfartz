#!/usr/bin/env bun

const validator =
  /^(feature|bugfix|hotfix|chore|docs|test)\/[a-z0-9]+(-[a-z0-9]+)*$/;

const branchName = (await Bun.stdin.text()).trim();

const res = branchName.match(validator);

if (res) {
  console.log("Alright: checks have passed /ᐠ. ｡.ᐟ\\");
  process.exit(0);
} else {
  console.log("Nuh uh /ᐠ –ꞈ –ᐟ\\");
  console.log("\nError: Branch name is invalid!");
  console.log("Valid format: <type>/<description>");
  console.log("Allowed types: feature, bugfix, hotfix, chore, docs, test");
  console.log("Description rules:");
  console.log("  - Can contain letters (a-z), numbers (0-9), and hyphens (-)");
  console.log("  - Must not start or end with a hyphen");
  console.log("  - No spaces or special characters other than hyphen");
  console.log("Example: feature/add-login-functionality");
  console.log(`You entered: "${branchName}"\n`);

  process.exit(1);
}
