import { Tooltip, hoverTooltip } from "@codemirror/view";
import LanguageServerManager from "languageServer/LanguageServerManager";

type Args = {
  id: string;
  languageServerManager: LanguageServerManager;
};

const hoverTooltipExtension = ({ id, languageServerManager }: Args) => {
  return hoverTooltip(
    async (_, pos): Promise<Tooltip | null> => {
      const quickInfo = await languageServerManager.getQuickInfo(id, pos);
      if (!quickInfo) {
        return null;
      }

      const { tooltipText } = quickInfo;

      return {
        pos,
        above: true,
        create: (view) => {
          const dom = document.createElement("div");
          dom.textContent = tooltipText;
          return { dom };
        },
      };
    },
    { hideOnChange: true }
  );
};

export default hoverTooltipExtension;
