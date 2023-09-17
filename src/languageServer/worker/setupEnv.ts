import {
  VirtualTypeScriptEnvironment,
  createDefaultMapFromCDN,
  createSystem,
  createVirtualTypeScriptEnvironment,
} from "@typescript/vfs";
import ts, { CompilerOptions } from "typescript";

export const JS_FS_ENTRY_POINT = "index.js";

export const JS_COMPILER_OPTIONS: CompilerOptions = {
  target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.CommonJS,
  allowJs: true,
  checkJs: true,
  noEmit: true,
  resolveJsonModule: true,
  strict: true,
  lib: ["es2020"],
  esModuleInterop: true,
  forceConsistentCasingInFileNames: false,
};

const setupEnv = async (): Promise<VirtualTypeScriptEnvironment> => {
  const fsMap = await createDefaultMapFromCDN(
    JS_COMPILER_OPTIONS,
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
    JS_COMPILER_OPTIONS
  );
};

export default setupEnv;
