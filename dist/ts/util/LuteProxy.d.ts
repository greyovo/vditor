/// <reference types="./types" />
export declare class LuteProxy implements ILuteProxy {
    private instance;
    private vditor;
    private hooks?;
    constructor(vditor: IVditor);
    private _log;
    private renderWrapper;
    Md2HTML(markdown: string): string;
    HTML2Md(html: string): string;
    VditorDOM2HTML(vhtml: string): string;
    SpinVditorDOM(html: string): string;
    HTML2VditorDOM(html: string): string;
    VditorDOM2Md(html: string): string;
    Md2VditorDOM(markdown: string): string;
    SpinVditorIRDOM(markdown: string): string;
    VditorIRDOM2Md(html: string): string;
    Md2VditorIRDOM(text: string): string;
    VditorIRDOM2HTML(html: string): string;
    HTML2VditorIRDOM(html: string): string;
    SpinVditorSVDOM(text: string): string;
    Md2VditorSVDOM(text: string): string;
}
