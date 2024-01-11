import { Constants } from "../constants";
import { isCtrl, isFirefox } from "../util/compatibility";
import {
    blurEvent,
    copyEvent, cutEvent, dblclickEvent,
    dropEvent,
    focusEvent,
    hotkeyEvent,
    scrollCenter,
    selectEvent,
} from "../util/editorCommonEvent";
import { paste } from "../util/fixBrowserBehavior";
import { hasClosestByAttribute, hasClosestByClassName } from "../util/hasClosest";
import {
    getEditorRange, setRangeByWbr,
    setSelectionFocus,
} from "../util/selection";
import { clickToc } from "../util/toc";
import { expandMarker } from "./expandMarker";
import { highlightToolbarIR } from "./highlightToolbarIR";
import { input } from "./input";
import { popoverToolbar } from "./popoverToolbar";
import { processAfterRender, processHint } from "./process";

class IR {
    public range: Range;
    public element: HTMLPreElement;
    public selectPopover: HTMLDivElement;
    public popover: HTMLDivElement;
    public processTimeoutId: number;
    public hlToolbarTimeoutId: number;
    public composingLock: boolean = false;
    public preventInput: boolean;
    private scrollListener: () => void;

    constructor(vditor: IVditor) {
        const divElement = document.createElement("div");
        divElement.className = "vditor-ir";

        //         divElement.innerHTML = `<pre class="vditor-reset" placeholder="${vditor.options.placeholder}"
        //  contenteditable="true" spellcheck="false"></pre>`;
        divElement.innerHTML = `<pre class="vditor-reset" placeholder="${vditor.options.placeholder}"
contenteditable="true" spellcheck="false"></pre>
<div class="vditor-panel vditor-panel--none"></div>
<div class="vditor-panel vditor-panel--none">
   <button type="button" aria-label="${window.VditorI18n.comment}" class="vditor-icon vditor-tooltipped vditor-tooltipped__n">
       <svg><use xlink:href="#vditor-icon-comment"></use></svg>
   </button>
</div>`;

        this.element = divElement.firstElementChild as HTMLPreElement;
        this.popover = divElement.firstElementChild.nextElementSibling as HTMLDivElement;
        this.selectPopover = divElement.lastElementChild as HTMLDivElement;

        this.bindEvent(vditor);

        focusEvent(vditor, this.element);
        dblclickEvent(vditor, this.element);
        blurEvent(vditor, this.element);
        hotkeyEvent(vditor, this.element);
        selectEvent(vditor, this.element);
        dropEvent(vditor, this.element);
        copyEvent(vditor, this.element, this.copy);
        cutEvent(vditor, this.element, this.copy);
    }

    private copy(event: ClipboardEvent, vditor: IVditor) {
        const range = getSelection().getRangeAt(0);
        if (range.toString() === "") {
            return;
        }
        event.stopPropagation();
        event.preventDefault();

        const tempElement = document.createElement("div");
        tempElement.appendChild(range.cloneContents());

        event.clipboardData.setData("text/plain", vditor.luteProxy.VditorIRDOM2Md(tempElement.innerHTML).trim());
        event.clipboardData.setData("text/html", "");
    }

    private bindEvent(vditor: IVditor) {
        this.unbindListener();
        this.element.addEventListener("paste", (event: ClipboardEvent & { target: HTMLElement }) => {
            paste(vditor, event, {
                pasteCode: (code: string) => {
                    document.execCommand("insertHTML", false, code);
                },
            });
        });

        window.addEventListener("scroll", this.scrollListener = () => {
            // hidePanel(vditor, ["hint"]);
            if (this.popover.style.display !== "block" || this.selectPopover.style.display !== "block") {
                return;
            }
            const top = parseInt(this.popover.getAttribute("data-top"), 10);
            if (vditor.options.height !== "auto") {
                if (vditor.options.toolbarConfig.pin && vditor.toolbar.element.getBoundingClientRect().top === 0) {
                    const popoverTop = Math.max(window.scrollY - vditor.element.offsetTop - 8,
                        Math.min(top - vditor.ir.element.scrollTop, this.element.clientHeight - 21)) + "px";
                    if (this.popover.style.display === "block") {
                        this.popover.style.top = popoverTop;
                    }
                    if (this.selectPopover.style.display === "block") {
                        this.selectPopover.style.top = popoverTop;
                    }
                }
                return;
            } else if (!vditor.options.toolbarConfig.pin) {
                return;
            }
            const popoverTop1 = Math.max(top, (window.scrollY - vditor.element.offsetTop - 8)) + "px";
            if (this.popover.style.display === "block") {
                this.popover.style.top = popoverTop1;
            }
            if (this.selectPopover.style.display === "block") {
                this.selectPopover.style.top = popoverTop1;
            }
        });

        this.element.addEventListener("scroll", () => {
            // hidePanel(vditor, ["hint"]);
            if (vditor.options.comment && vditor.options.comment.enable && vditor.options.comment.scroll) {
                vditor.options.comment.scroll(vditor.ir.element.scrollTop);
            }
            if (this.popover.style.display !== "block") {
                return;
            }
            const top = parseInt(this.popover.getAttribute("data-top"), 10) - vditor.ir.element.scrollTop;
            let max = -8;
            if (vditor.options.toolbarConfig.pin && vditor.toolbar.element.getBoundingClientRect().top === 0) {
                max = window.scrollY - vditor.element.offsetTop + max;
            }
            const topPx = Math.max(max, Math.min(top, this.element.clientHeight - 21)) + "px";
            this.popover.style.top = topPx;
            this.selectPopover.style.top = topPx;
        });

        this.element.addEventListener("compositionstart", (event: InputEvent) => {
            this.composingLock = true;
        });

        this.element.addEventListener("compositionend", (event: InputEvent) => {
            if (!isFirefox()) {
                input(vditor, getSelection().getRangeAt(0).cloneRange());
            }
            this.composingLock = false;
        });

        this.element.addEventListener("input", (event: InputEvent) => {
            if (event.inputType === "deleteByDrag" || event.inputType === "insertFromDrop") {
                // https://github.com/Vanessa219/vditor/issues/801 编辑器内容拖拽问题
                return;
            }
            if (this.preventInput) {
                this.preventInput = false;
                processAfterRender(vditor, {
                    enableAddUndoStack: true,
                    enableHint: true,
                    enableInput: true,
                });
                return;
            }
            if (this.composingLock || event.data === "‘" || event.data === "“" || event.data === "《") {
                return;
            }
            input(vditor, getSelection().getRangeAt(0).cloneRange(), false, event);
        });

        this.element.addEventListener("click", (event: MouseEvent & { target: HTMLInputElement }) => {
            if (event.target.tagName === "INPUT") {
                if (event.target.checked) {
                    event.target.setAttribute("checked", "checked");
                } else {
                    event.target.removeAttribute("checked");
                }
                this.preventInput = true;
                processAfterRender(vditor);
                return;
            }

            const range = getEditorRange(vditor);

            // 点击后光标落于预览区
            let previewElement = hasClosestByClassName(event.target, "vditor-ir__preview");
            if (!previewElement) {
                previewElement = hasClosestByClassName(
                    range.startContainer, "vditor-ir__preview");
            }
            if (previewElement) {
                if (previewElement.previousElementSibling.firstElementChild) {
                    range.selectNodeContents(previewElement.previousElementSibling.firstElementChild);
                } else {
                    // 行内数学公式
                    range.selectNodeContents(previewElement.previousElementSibling);
                }
                range.collapse(true);
                setSelectionFocus(range);
                scrollCenter(vditor);
            }

            // 点击图片光标选中图片地址
            if (event.target.tagName === "IMG") {
                const linkElement =
                    event.target.parentElement.querySelector<HTMLSpanElement>(".vditor-ir__marker--link");
                if (linkElement) {
                    range.selectNode(linkElement);
                    setSelectionFocus(range);
                }
            }
            // 打开链接
            const aElement = hasClosestByAttribute(event.target, "data-type", "a");
            if (aElement && (!aElement.classList.contains("vditor-ir__node--expand"))) {
                if (vditor.options.link.click) {
                    vditor.options.link.click(aElement.querySelector(":scope > .vditor-ir__marker--link"));
                } else if (vditor.options.link.isOpen) {
                    window.open(aElement.querySelector(":scope > .vditor-ir__marker--link").textContent);
                }
                return;
            }

            if (event.target.isEqualNode(this.element) && this.element.lastElementChild && range.collapsed) {
                const lastRect = this.element.lastElementChild.getBoundingClientRect();
                if (event.y > lastRect.top + lastRect.height) {
                    if (this.element.lastElementChild.tagName === "P" &&
                        this.element.lastElementChild.textContent.trim().replace(Constants.ZWSP, "") === "") {
                        range.selectNodeContents(this.element.lastElementChild);
                        range.collapse(false);
                    } else {
                        this.element.insertAdjacentHTML("beforeend",
                            `<p data-block="0">${Constants.ZWSP}<wbr></p>`);
                        setRangeByWbr(this.element, range);
                    }
                }
            }

            if (range.toString() === "") {
                expandMarker(range, vditor);
            } else {
                // https://github.com/Vanessa219/vditor/pull/681 当点击选中区域时 eventTarget 与 range 不一致，需延迟等待 range 发生变化
                setTimeout(() => {
                    expandMarker(getEditorRange(vditor), vditor);
                });
            }
            clickToc(event, vditor);
            highlightToolbarIR(vditor);
            popoverToolbar(vditor)
        });

        this.element.addEventListener("keyup", (event) => {
            if (event.isComposing || isCtrl(event)) {
                return;
            }
            if (event.key === "Enter") {
                scrollCenter(vditor);
            }
            highlightToolbarIR(vditor);
            if ((event.key === "Backspace" || event.key === "Delete") &&
                vditor.ir.element.innerHTML !== "" && vditor.ir.element.childNodes.length === 1 &&
                vditor.ir.element.firstElementChild && vditor.ir.element.firstElementChild.tagName === "P"
                && vditor.ir.element.firstElementChild.childElementCount === 0
                && (vditor.ir.element.textContent === "" || vditor.ir.element.textContent === "\n")) {
                // 为空时显示 placeholder
                vditor.ir.element.innerHTML = "";
                return;
            }
            const range = getEditorRange(vditor);
            if (event.key === "Backspace") {
                // firefox headings https://github.com/Vanessa219/vditor/issues/211
                if (isFirefox() && range.startContainer.textContent === "\n" && range.startOffset === 1) {
                    range.startContainer.textContent = "";
                    expandMarker(range, vditor);
                }
                // 数学公式前是空块，空块前是 table，在空块前删除，数学公式会多一个 br
                this.element.querySelectorAll(".language-math").forEach((item) => {
                    const brElement = item.querySelector("br");
                    if (brElement) {
                        brElement.remove();
                    }
                });
            } else if (event.key.indexOf("Arrow") > -1) {
                if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                    processHint(vditor);
                }
                expandMarker(range, vditor);
            } else if (event.keyCode === 229 && event.code === "" && event.key === "Unidentified") {
                // https://github.com/Vanessa219/vditor/issues/508 IR 删除到节点需展开
                expandMarker(range, vditor);
            }

            const previewRenderElement = hasClosestByClassName(range.startContainer, "vditor-ir__preview");

            if (previewRenderElement) {
                if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
                    if (previewRenderElement.previousElementSibling.firstElementChild) {
                        range.selectNodeContents(previewRenderElement.previousElementSibling.firstElementChild);
                    } else {
                        // 行内数学公式/html entity
                        range.selectNodeContents(previewRenderElement.previousElementSibling);
                    }
                    range.collapse(false);
                    event.preventDefault();
                    return true;
                }
                if (previewRenderElement.tagName === "SPAN" &&
                    (event.key === "ArrowDown" || event.key === "ArrowRight")) {
                    if (previewRenderElement.parentElement.getAttribute("data-type") === "html-entity") {
                        // html entity
                        previewRenderElement.parentElement.insertAdjacentText("afterend", Constants.ZWSP);
                        range.setStart(previewRenderElement.parentElement.nextSibling, 1);
                    } else {
                        range.selectNodeContents(previewRenderElement.parentElement.lastElementChild);
                    }
                    range.collapse(false);
                    event.preventDefault();
                    return true;
                }
            }
        });
    }

    private unbindListener() {
        window.removeEventListener("scroll", this.scrollListener);
    }
}

export { IR };
