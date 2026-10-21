// Optional authoring check. Requires local rustc and .NET 10; never runs learner input.
import { createServer } from "vite";
import ts from "typescript";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const server = await createServer({
  configFile: false,
  server: { middlewareMode: true },
  appType: "custom",
});
let lessons, scenarios;
try {
  ({ lessons } = await server.ssrLoadModule("/src/data/lessons.ts"));
  ({ scenarios } = await server.ssrLoadModule("/src/data/scenarios.ts"));
} finally {
  await server.close();
}
const fixtures = [
  ...lessons.map((l) => ({
    id: l.id,
    language: l.language,
    code: l.code,
    output: l.output,
  })),
  ...scenarios.map((s) => ({
    id: s.id,
    language: s.language,
    code: s.exercises[0].code,
    output: s.exercises[0].solution,
  })),
];
const taskDir = await mkdtemp(join(tmpdir(), "codebadger-curriculum-"));
function run(command, args) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    timeout: 120000,
    windowsHide: true,
    env: {
      ...process.env,
      DOTNET_NOLOGO: "1",
      DOTNET_CLI_TELEMETRY_OPTOUT: "1",
    },
  });
  if (result.error || result.status !== 0)
    throw new Error(
      `${command} failed: ${result.error ?? result.stdout + result.stderr}`,
    );
  return result.stdout.trim();
}
const typed = fixtures.filter((f) => f.language === "typescript");
const paths = [];
for (const [i, f] of typed.entries()) {
  const path = join(taskDir, `fixture-${i}.ts`);
  await writeFile(path, `export {};\n${f.code}`);
  paths.push(path);
}
const program = ts.createProgram(paths, {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  strict: true,
  noEmit: true,
  skipLibCheck: true,
  types: [],
});
const diagnostics = ts.getPreEmitDiagnostics(program);
if (diagnostics.length)
  throw new Error(
    ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCanonicalFileName: (p) => p,
      getCurrentDirectory: () => process.cwd(),
      getNewLine: () => "\n",
    }),
  );
console.log(
  `TypeScript: ${typed.length} strict-checked fixtures (outputs checked in npm test).`,
);

const rust = fixtures.filter((f) => f.language === "rust");
for (const [i, f] of rust.entries()) {
  const path = join(taskDir, `rust-${i}.rs`),
    binary = join(
      taskDir,
      `rust-${i}${process.platform === "win32" ? ".exe" : ""}`,
    );
  await writeFile(path, `fn main() {\n${f.code}\n}`);
  run("rustc", [
    "--edition=2021",
    "--crate-name",
    `fixture_${i}`,
    "-A",
    "warnings",
    path,
    "-o",
    binary,
  ]);
  const output = run(binary, []);
  if (output !== f.output)
    throw new Error(
      `${f.id}: expected ${JSON.stringify(f.output)}, got ${JSON.stringify(output)}`,
    );
}
console.log(`Rust: ${rust.length} fixtures compiled and output-verified.`);

const csharp = fixtures.filter((f) => f.language === "csharp");
let members = "";
const methods = [];
for (const [i, f] of csharp.entries()) {
  let code = f.code;
  const index = code.search(/\n(?:record Player|class Counter)/);
  if (index >= 0) {
    members += code.slice(index) + "\n";
    code = code.slice(0, index);
  }
  methods.push(`static async Task Case${i}() {\n${code}\n}`);
}
const calls = csharp
  .map(
    (f, i) =>
      `{ var writer = new System.IO.StringWriter(); Console.SetOut(writer); await Case${i}(); var actual = writer.ToString().TrimEnd().Replace("\\r\\n", "\\n"); if (actual != ${JSON.stringify(f.output)}) throw new Exception(${JSON.stringify(f.id)} + ": " + actual); }`,
  )
  .join("\n");
const project = join(taskDir, "Content.csproj");
await writeFile(
  project,
  '<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net10.0</TargetFramework><ImplicitUsings>enable</ImplicitUsings><Nullable>enable</Nullable></PropertyGroup></Project>',
);
await writeFile(
  join(taskDir, "Program.cs"),
  `using System;\nusing System.Collections.Generic;\nusing System.Linq;\nusing System.Threading.Tasks;\nclass Program { static async Task Main() { ${calls} }\n${methods.join("\n")}\n${members}\n}`,
);
run("dotnet", [
  "build",
  project,
  "--nologo",
  "--verbosity",
  "quiet",
  "--ignore-failed-sources",
]);
run("dotnet", ["run", "--project", project, "--no-build"]);
console.log(`C#: ${csharp.length} fixtures compiled and output-verified.`);
console.log(`Authoring fixtures: ${taskDir}`);
