import fs from "node:fs/promises";
import path from "node:path";

async function main() {
  const baseDir = path.resolve(import.meta.dirname, "..");
  const deployDir = path.resolve(baseDir, "_deploy");

  // _deployフォルダ作成
  await fs.rm(deployDir, { recursive: true, force: true });
  await fs.mkdir(deployDir, { recursive: true });

  // buildをコピー
  await fs.cp(`${baseDir}/build`, `${deployDir}/build`, { recursive: true });

  // @react-routerをコピー
  await fs.cp(`${baseDir}/dist`, `${deployDir}/node_modules`, {
    recursive: true,
  });

  // node_modulesから@react-router/serve/bin.jsをコピー
  await fs.cp(
    `${baseDir}/node_modules/@react-router/serve/bin.js`,
    `${deployDir}/node_modules/@react-router/serve/bin.js`
  );

  // run.shをコピー
  await fs.cp(`${baseDir}/run.sh`, `${deployDir}/run.sh`);
  await fs.chmod(`${deployDir}/run.sh`, "0755");
}

main();
