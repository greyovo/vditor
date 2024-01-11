import {getMarkdown} from "./getMarkdown";

export const getHTML = (vditor: IVditor) => {
    if (vditor.currentMode === "sv") {
        return vditor.luteProxy.Md2HTML(getMarkdown(vditor));
    } else if (vditor.currentMode === "wysiwyg") {
        return vditor.luteProxy.VditorDOM2HTML(vditor.wysiwyg.element.innerHTML);
    } else if (vditor.currentMode === "ir") {
        return vditor.luteProxy.VditorIRDOM2HTML(vditor.ir.element.innerHTML);
    }
};
