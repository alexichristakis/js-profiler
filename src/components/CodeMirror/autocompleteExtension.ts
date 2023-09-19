import {
  Completion,
  CompletionResult,
  autocompletion,
} from "@codemirror/autocomplete";
import LanguageServerManager from "languageServer/LanguageServerManager";
import throttleAsync from "./throttleAsync";

type Args = {
  id: string;
  languageServer: LanguageServerManager;
};

const autocompleteExtension = ({ id, languageServer }: Args) => {
  return autocompletion({
    activateOnTyping: true,
    override: [
      throttleAsync(50, async (ctx): Promise<CompletionResult | null> => {
        const { pos, explicit } = ctx;

        try {
          const charBefore = ctx.matchBefore(/./)?.text;

          const completions = await languageServer.getAutocompleteResults({
            fileId: id,
            pos,
            explicit,
            charBefore,
          });

          if (!completions) {
            console.warn("Unable to get completions", { pos });
            return null;
          }

          const { entries } = completions;
          const tokenBefore = ctx.matchBefore(/[^. \n]*/)?.text;

          const completionOptions = entries.map(
            ({
              details,
              sortText,
              kind,
              sourceDisplayString,
              name,
            }): Completion => {
              const description = details?.codeActions?.at(0)?.description;

              const source =
                details?.sourceDisplay?.map((token) => token.text).join("") ||
                sourceDisplayString;

              return {
                type: kind,
                label: name,
                displayLabel: name,
                detail: source,
                info: description,
                apply: name,
                boost: 1 / Number(sortText),
              };
            }
          );

          return {
            from: pos - (tokenBefore?.length ?? 0),
            to: pos,
            options: completionOptions,
          };
        } catch (e) {
          console.error("Unable to get completions", { pos, error: e });
          return null;
        }
      }),
    ],
  });
};

export default autocompleteExtension;
