import { log } from "./log"

export class LuteProxy implements ILuteProxy {

  private instance: Lute
  private vditor: IVditor

  private beforeRender?: (markdown: string) => string
  private afterRender?: (plainHTML: string) => string

  private _log(method: string, content: string) {
    log("LuteProxy." + method, content, "hooks", this.vditor.options.debugger)
  }

  constructor(vditor: IVditor) {
    this.instance = vditor.lute
    this.vditor = vditor
    this.beforeRender = vditor.hooks.before
    this.afterRender = vditor.hooks.after
  }

  // md 转换为 html
  public Md2HTML(markdown: string): string {
    this._log("Md2HTML", "before")
    this.beforeRender(markdown)
    let result = this.instance.Md2HTML(markdown)
    this._log("Md2HTML", "after")
    result = this.afterRender?.(result) || result
    return result
  }

  // 粘贴时将 html 转换为 md
  public HTML2Md(html: string): string {
    this._log("HTML2Md", "before")
    let result = this.instance.HTML2Md(html)
    this._log("Md2HTML", "after")
    result = this.afterRender?.(result) || result
    return result
  }

  // wysiwyg 转换为 html
  public VditorDOM2HTML(vhtml: string): string {
    this._log("VditorDOM2HTML", "before")
    this.beforeRender(vhtml)
    let result = this.instance.VditorDOM2HTML(vhtml)
    result = this.afterRender?.(result) || result
    return result
  }

  // wysiwyg 输入渲染
  public SpinVditorDOM(html: string): string {
    this._log("SpinVditorDOM", "before")
    this.beforeRender(html)
    let result = this.instance.SpinVditorDOM(html)
    result = this.afterRender?.(result) || result
    return result
  }

  // 粘贴时将 html 转换为 wysiwyg
  public HTML2VditorDOM(html: string): string {
    this._log("HTML2VditorDOM", "before")
    this.beforeRender(html)
    let result = this.instance.HTML2VditorDOM(html)
    this._log("HTML2VditorDOM", "after")
    result = this.afterRender?.(result) || result
    return result
  }

  // 将 wysiwyg 转换为 md
  public VditorDOM2Md(html: string): string {
    this._log("VditorDOM2Md", "before")
    let result = this.instance.VditorDOM2Md(html)
    this._log("VditorDOM2Md", "after")
    result = this.afterRender?.(result) || result
    return result
  }

  // 将 md 转换为 wysiwyg
  public Md2VditorDOM(markdown: string): string {
    this._log("Md2VditorDOM", "before")
    this.beforeRender(markdown)
    let result = this.instance.Md2VditorDOM(markdown)
    this._log("Md2VditorDOM", "after")
    result = this.afterRender?.(result) || result
    return result
  }

  // ir 输入渲染
  public SpinVditorIRDOM(markdown: string): string {
    this._log("SpinVditorIRDOM", "before")
    this.beforeRender(markdown)
    let result = this.instance.SpinVditorIRDOM(markdown)
    this._log("SpinVditorIRDOM", "after")
    result = this.afterRender?.(result) || result
    return result
  }

  // ir 获取 md
  public VditorIRDOM2Md(html: string): string {
    let result = this.instance.VditorIRDOM2Md(html)
    // result = this.afterRender?.(result) || result
    return result
  }

  // md 转换为 ir
  public Md2VditorIRDOM(text: string): string {
    this._log("Md2VditorIRDOM", "before")
    this.beforeRender(text)
    let result = this.instance.Md2VditorIRDOM(text)
    this._log("Md2VditorIRDOM", "after")
    result = this.afterRender?.(result) || result
    return result
  }

  // 获取 HTML
  public VditorIRDOM2HTML(html: string): string {
    let result = this.instance.VditorIRDOM2HTML(html)
    // result = this.afterRender?.(result) || result
    return result
  }

  // 粘贴时将 html 转换为 sv
  public HTML2VditorIRDOM(html: string): string {
    let result = this.instance.HTML2VditorIRDOM(html)
    result = this.afterRender?.(result) || result
    return result
  }

  // sv 输入渲染
  public SpinVditorSVDOM(text: string): string {
    this._log("SpinVditorSVDOM", "before")
    this.beforeRender(text)
    let result = this.instance.SpinVditorSVDOM(text)
    this._log("SpinVditorSVDOM", "after")
    result = this.afterRender?.(result) || result
    return result
  }

  // 粘贴是 md 转换为 sv
  public Md2VditorSVDOM(text: string): string {
    this._log("Md2VditorSVDOM", "before")
    this.beforeRender(text)
    let result = this.instance.Md2VditorSVDOM(text)
    this._log("Md2VditorSVDOM", "after")
    result = this.afterRender?.(result) || result
    return result
  }

}