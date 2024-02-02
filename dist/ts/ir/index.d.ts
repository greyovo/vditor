/// <reference types="./types" />
declare class IR {
    range: Range;
    element: HTMLPreElement;
    selectPopover: HTMLDivElement;
    popover: HTMLDivElement;
    processTimeoutId: number;
    hlToolbarTimeoutId: number;
    composingLock: boolean;
    preventInput: boolean;
    private scrollListener;
    constructor(vditor: IVditor);
    private copy;
    private bindEvent;
    private unbindListener;
}
export { IR };
