import type { Diagnostic } from "@codemirror/lint";
import { RPCMethodConfigs } from "rpc/types";
import type {
  CompletionEntryDetails,
  QuickInfo,
  CompletionEntry,
  TextChange,
  CodeActionCommand,
  CodeFixAction,
} from "typescript";

interface SerializedAction {
  name: string;
  data: CodeFixAction;
}

export interface SerializedDiagnostic extends Diagnostic {
  serializedActions: SerializedAction[];
}

export type UpdateFileArgs = { fileId: string; file: string };

export type InfoArgs = { fileId: string; pos: number };

export type HostMethods =
  | {
      method: "updateFile";
      arguments: UpdateFileArgs;
      response: void;
    }
  | {
      method: "lint";
      arguments: { fileId: string };
      response: { diagnostics: SerializedDiagnostic[] };
    }
  | {
      method: "format";
      arguments: { fileId: string };
      response: { changes: TextChange[] };
    }
  | {
      method: "applyAction";
      arguments: { action: CodeActionCommand };
      response: void;
    }
  | {
      method: "autocomplete";
      arguments: { fileId: string; pos: number };
      response: {
        entries: ({
          sourceDisplayString: string;
          details: CompletionEntryDetails;
        } & CompletionEntry)[];
      };
    }
  | {
      method: "info";
      arguments: InfoArgs;
      response: null | {
        result: QuickInfo;
        tooltipText: string;
      };
    };

export type HostRPCMethodConfigs = RPCMethodConfigs<HostMethods>;
