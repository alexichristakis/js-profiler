import {
  VirtualTypeScriptEnvironment,
  createDefaultMapFromCDN,
  createSystem,
  createVirtualTypeScriptEnvironment,
} from "@typescript/vfs";
import ts, { CompilerOptions, ModuleKind, ScriptTarget } from "typescript";

export const JS_FS_ENTRY_POINT = "index.js";

const COMPILER_OPTIONS: CompilerOptions = {
  target: ScriptTarget.ESNext,
  module: ModuleKind.CommonJS,
  allowJs: true,
  checkJs: true,
  resolveJsonModule: true,
  strict: true,
  lib: ["es2020", "dom"],
  esModuleInterop: true,
  forceConsistentCasingInFileNames: false,
};

const setupEnv = async (): Promise<VirtualTypeScriptEnvironment> => {
  const fsMap = await createDefaultMapFromCDN(
    COMPILER_OPTIONS,
    ts.version,
    false,
    ts
  );

  fsMap.set(
    JS_FS_ENTRY_POINT,
    "// pre-file comment necessary to create file\n"
  );

  const system = createSystem(fsMap);

  return createVirtualTypeScriptEnvironment(
    system,
    [JS_FS_ENTRY_POINT],
    ts,
    COMPILER_OPTIONS
  );
};

export default setupEnv;
