import { processAfterRender } from "../ir/process";
import { log } from "./log";
import { processCodeRender } from "./processCode";

export function renderMd2Html(vditor: IVditor, markdownText: string) {
  log("renderMd2Html", "Hooks: before()", "args", vditor.options.debugger)
  markdownText = vditor.customRender?.before?.(markdownText)

  switch (vditor.currentMode) {
    case "wysiwyg":

      break;

    case "sv":
      break;

    case "ir":
      vditor.ir.element.innerHTML = vditor.lute.Md2VditorIRDOM(markdownText);
      vditor.ir.element
        .querySelectorAll(".vditor-ir__preview[data-render='2']")
        .forEach((item: HTMLElement) => {
          processCodeRender(item, vditor);
        });
      processAfterRender(vditor, {
        enableAddUndoStack: true,
        enableHint: false,
        enableInput: false,
      });
      break;
  }

  log("renderMd2Html", "Hooks: after()", "args", vditor.options.debugger)
  vditor.customRender?.after?.(vditor.element)
}