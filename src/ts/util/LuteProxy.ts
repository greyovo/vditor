import { log } from "./log"

// by @greyovo
// 在实际调用 Lute 渲染前进行拦截，方便对外提供更多事件钩子
export class LuteProxy implements ILuteProxy {

  private instance: Lute
  private vditor: IVditor
  private hooks?: IHooks

  constructor(vditor: IVditor) {
    this.instance = vditor.lute
    this.vditor = vditor
    this.hooks = vditor.hooks
  }

  private _log(method: string, content: string) {
    log("[vditor.luteProxy." + method + "]", content, "hooks", this.vditor.options.debugger)
  }

  private renderWrapper(
    method: string,
    doRender: (str: string) => string,
    arg: string,
    before?: (s: string) => string,
    after?: (s: string) => string,
  ) {
    this._log(method, "before")
    arg = before?.(arg) || arg
    let result = doRender(arg)
    this._log(method, "after")
    result = after?.(result) || result
    return result
  }


  ////////////////////////////////////////////////
  //////////////// MD <-> HTML ///////////////////
  ////////////////////////////////////////////////

  // md 转换为 html
  public Md2HTML(markdown: string): string {
    return this.renderWrapper(
      "Md2HTML", this.instance.Md2HTML, markdown,
      this.hooks?.md2html?.before,
      this.hooks?.md2html?.after,
    )
  }

  // 粘贴时将 html 转换为 md
  public HTML2Md(html: string): string {
    return this.renderWrapper(
      "HTML2Md", this.instance.HTML2Md, html,
      this.hooks?.html2md?.before,
      this.hooks?.html2md?.after,
    )
  }


  ////////////////////////////////////////////////
  //////////////////// WYSIWYG ///////////////////
  ////////////////////////////////////////////////

  // wysiwyg 转换为 html
  public VditorDOM2HTML(vhtml: string): string {
    return this.renderWrapper(
      "VditorDOM2HTML", this.instance.VditorDOM2HTML, vhtml
    )
  }

  // wysiwyg 输入渲染
  public SpinVditorDOM(html: string): string {
    return this.renderWrapper(
      "VditorDOM2HTML", this.instance.VditorDOM2HTML, html,
      this.hooks?.wysiwyg?.before,
      this.hooks?.wysiwyg?.after,
    )
  }

  // 粘贴时将 html 转换为 wysiwyg
  public HTML2VditorDOM(html: string): string {
    return this.renderWrapper(
      "HTML2VditorDOM", this.instance.HTML2VditorDOM, html,
      this.hooks?.wysiwyg?.before,
      this.hooks?.wysiwyg?.after,
    )
  }

  // 将 wysiwyg 转换为 md
  public VditorDOM2Md(html: string): string {
    return this.renderWrapper(
      "VditorDOM2Md", this.instance.VditorDOM2Md, html,
      this.hooks?.html2md?.before,
      this.hooks?.html2md?.after,
    )
  }

  // 将 md 转换为 wysiwyg
  public Md2VditorDOM(markdown: string): string {
    return this.renderWrapper(
      "Md2VditorDOM", this.instance.Md2VditorDOM, markdown,
      this.hooks?.wysiwyg?.before,
      this.hooks?.wysiwyg?.after,
    )
  }


  ////////////////////////////////////////////////
  ////////////////////// IR //////////////////////
  ////////////////////////////////////////////////

  // ir 输入渲染
  public SpinVditorIRDOM(markdown: string): string {
    return this.renderWrapper(
      "SpinVditorIRDOM", this.instance.SpinVditorIRDOM, markdown,
      this.hooks?.ir?.before,
      this.hooks?.ir?.after,
    )
  }

  // ir 获取 md
  public VditorIRDOM2Md(html: string): string {
    return this.renderWrapper(
      "VditorIRDOM2Md", this.instance.VditorIRDOM2Md, html,
      this.hooks?.html2md?.before,
      this.hooks?.html2md?.after,
    )
  }

  // md 转换为 ir
  public Md2VditorIRDOM(text: string): string {
    return this.renderWrapper(
      "Md2VditorIRDOM", this.instance.Md2VditorIRDOM, text,
      this.hooks?.ir?.before,
      this.hooks?.ir?.after,
    )
  }

  // 获取 HTML
  public VditorIRDOM2HTML(html: string): string {
    return this.renderWrapper("VditorIRDOM2HTML", this.instance.VditorIRDOM2HTML, html)
  }

  // 粘贴时将 html 转换为 ir
  public HTML2VditorIRDOM(html: string): string {
    return this.renderWrapper("HTML2VditorIRDOM", this.instance.HTML2VditorIRDOM, html)
  }


  ////////////////////////////////////////////////
  ////////////////////// SV //////////////////////
  ////////////////////////////////////////////////

  // sv 输入渲染
  public SpinVditorSVDOM(text: string): string {
    return this.renderWrapper(
      "SpinVditorSVDOM", this.instance.SpinVditorSVDOM, text,
      this.hooks?.sv?.before,
      this.hooks?.sv?.after,
    )
  }

  // 粘贴时 md 转换为 sv
  public Md2VditorSVDOM(text: string): string {
    return this.renderWrapper(
      "Md2VditorSVDOM", this.instance.Md2VditorSVDOM, text,
      this.hooks?.sv?.before,
      this.hooks?.sv?.after,
    )
  }

}