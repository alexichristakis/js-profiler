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

export type UpdateFileArgs = {
  fileId: string;
  isModule?: boolean;
  file: string;
};

export type InfoArgs = { fileId: string; pos: number };

export type LintArgs = { fileId: string };

export type FormatFileArgs = { fileId: string };

export type DeleteFileArgs = { fileId: string };

export type GetFileArgs = { fileId: string };

export type AutocompleteArgs = {
  fileId: string;
  pos: number;
  explicit: boolean;
  charBefore?: string;
};

export type AutocompleteEntries = ({
  sourceDisplayString: string;
  details?: CompletionEntryDetails;
} & CompletionEntry)[];

export type HostMethods =
  | {
      method: "updateFile";
      arguments: UpdateFileArgs;
      response: void;
    }
  | {
      method: "deleteFile";
      arguments: DeleteFileArgs;
      response: void;
    }
  | {
      method: "getFile";
      arguments: GetFileArgs;
      response: string | undefined;
    }
  | {
      method: "getFileList";
      arguments: undefined;
      response: string[] | undefined;
    }
  | {
      method: "lint";
      arguments: LintArgs;
      response: { diagnostics: SerializedDiagnostic[] };
    }
  | {
      method: "format";
      arguments: FormatFileArgs;
      response: { changes: TextChange[] };
    }
  | {
      method: "applyAction";
      arguments: { action: CodeActionCommand };
      response: void;
    }
  | {
      method: "autocomplete";
      arguments: AutocompleteArgs;
      response: null | {
        entries: AutocompleteEntries;
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
