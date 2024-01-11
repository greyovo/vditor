import {highlightToolbarIR} from "../ir/highlightToolbarIR";
import { popoverToolbar } from "../ir/popoverToolbar";
import {highlightToolbarWYSIWYG} from "../wysiwyg/highlightToolbarWYSIWYG";

export const highlightToolbar = (vditor: IVditor) => {
    if (vditor.currentMode === "wysiwyg") {
        highlightToolbarWYSIWYG(vditor);
    } else if (vditor.currentMode === "ir") {
        highlightToolbarIR(vditor);
        popoverToolbar(vditor)
    }
};
