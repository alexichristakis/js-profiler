interface DiagnosticAllowList {
  type: "allow";
  codes: Set<number>;
}

interface DiagnosticDenyList {
  type: "deny";
  codes: Set<number>;
}

export type DiagnosticFilter = DiagnosticAllowList | DiagnosticDenyList;

const AllowAllDiagnostics: DiagnosticFilter = {
  type: "deny",
  codes: new Set(),
};

/**
 * Turn features on and off to change the UX.
 * @todo Inline the policy decisions once we're happy with the UX.
 */
export const CONFIG = {
  /**
   * When true, console.log all communications sent between the worker & main
   * thread
   */
  debugBridge: false,
  /**
   * Show JSON of each completion.
   */
  debugCompletions: false,
  /** Show doc tags like `@version` or `@see` as written. */
  showDocTags: false,
  /** Convert @see URLs to beta URLs */
  showBetaDocsLinks: true,
  /** Eg, "this variable is unused, delete it?" */
  showSuggestionDiagnostics: false,

  semanticDiagnosticFilter: AllowAllDiagnostics,
  /**
   * Show the Typescript diagnostic number when rendering diagnostics.
   * Intended primarily for debugging use.
   */
  showDiagnosticCodeNumber: false,
  /** Show random declared globals in completions. This is a heuristic. */
  showAmbientDeclareCompletions: false,
  showTypes: true,
} as const;
