import RpcRegistry from "rpc/registry";
import { HostRPCMethodConfigs, InfoArgs, UpdateFileArgs } from "./types";
import { VirtualTypeScriptEnvironment } from "@typescript/vfs";
import setupEnv from "./setupEnv";
import { assertIsNotNullish } from "typeguards";
import { displayPartsToString } from "typescript";

class LanguageServer {
  rpc: RpcRegistry<HostRPCMethodConfigs>;
  env: VirtualTypeScriptEnvironment | null = null;

  constructor() {
    this.rpc = new RpcRegistry<HostRPCMethodConfigs>({
      updateFile: this.updateFile,
      info: this.info,
      // @ts-expect-error
      autocomplete: () => {},
      // @ts-expect-error
      lint: () => {},
      formatFile: () => {},
    });

    this.initialize();
  }

  private initialize = async () => {
    this.env = await setupEnv();
  };

  get isReady() {
    return !!this.env;
  }

  private getFileName = (fileId: string) => {
    return `${fileId}.ts`;
  };

  updateFile = ({ fileId, file }: UpdateFileArgs) => {
    assertIsNotNullish(this.env, "env not ready");
    const fileName = this.getFileName(fileId);
    if (!this.env.sys.fileExists(fileName)) {
      this.env.createFile(fileName, file);
    } else {
      this.env.updateFile(fileName, file);
    }
  };

  info = ({ fileId, pos }: InfoArgs) => {
    assertIsNotNullish(this.env, "env not ready");

    const result = this.env.languageService.getQuickInfoAtPosition(
      this.getFileName(fileId),
      pos
    );

    if (!result) {
      return null;
    }

    const { displayParts, documentation } = result;

    const tooltipText =
      displayPartsToString(displayParts) +
      (documentation?.length ? "\n" + displayPartsToString(documentation) : "");

    return {
      result,
      tooltipText,
    };
  };

  autocomplete = () => {};
}

export default LanguageServer;
