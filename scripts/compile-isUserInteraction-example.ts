/**
 * One-shot helper that compiles only the new IsUserInteraction example into
 * its syntax-highlighted JSON sibling. We can't use `compile:examples`
 * directly on Windows because the upstream loop in `react-lib-tools` filters
 * files with `file.includes("/examples/")` -- a POSIX-only check -- and
 * silently skips every file on Windows AFTER having `rm`ed the existing
 * `public/generated/examples/*.json` outputs.
 *
 * Delete this script (and call `pnpm run compile:examples`) once
 * https://github.com/bvaughn/react-lib-tools picks up a path-separator fix.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { basename, join } from "node:path";
import { cwd } from "node:process";
import { syntaxHighlight } from "react-lib-tools/scripts/utils/syntax-highlight.ts";
import { trimExcludedText } from "react-lib-tools/scripts/utils/examples/trimExcludedText.ts";

const inputFile = join(
  cwd(),
  "src",
  "routes",
  "examples",
  "IsUserInteraction.tsx"
);
const outputDir = join(cwd(), "public", "generated", "examples");

await mkdir(outputDir, { recursive: true });

let rawText = (await readFile(inputFile)).toString();
rawText = trimExcludedText(rawText);
rawText = rawText
  .split("\n")
  .filter(
    (line) =>
      !line.includes("prettier-ignore") &&
      !line.includes("eslint-disable-next-line") &&
      !line.includes("@ts-expect-error") &&
      !line.includes("// hidden")
  )
  .join("\n");

const html = await syntaxHighlight(rawText, "TSX");

const outputFile = join(
  outputDir,
  basename(inputFile).replace(/(\.example)?\.[\w]+$/, ".json")
);

await writeFile(outputFile, JSON.stringify({ html }, null, 2));

console.log("Wrote", outputFile);
