export class LuteProxy implements ILuteProxy {

  private instance: Lute

  constructor(inst: Lute) {
    this.instance = inst
  }

  // md 转换为 html
  public Md2HTML(markdown: string): string {
    return this.instance.Md2HTML(markdown)
  }

  // 粘贴时将 html 转换为 md
  public HTML2Md(html: string): string {
    return this.instance.HTML2Md(html)
  }

  // wysiwyg 转换为 html
  public VditorDOM2HTML(vhtml: string): string {
    return this.instance.VditorDOM2HTML(vhtml)
  }

  // wysiwyg 输入渲染
  public SpinVditorDOM(html: string): string {
    return this.instance.SpinVditorDOM(html)
  }

  // 粘贴时将 html 转换为 wysiwyg
  public HTML2VditorDOM(html: string): string {
    return this.instance.HTML2VditorDOM(html)
  }

  // 将 wysiwyg 转换为 md
  public VditorDOM2Md(html: string): string {
    return this.instance.VditorDOM2Md(html)
  }

  // 将 md 转换为 wysiwyg
  public Md2VditorDOM(markdown: string): string {
    return this.instance.Md2VditorDOM(markdown)
  }

  // ir 输入渲染
  public SpinVditorIRDOM(markdown: string): string {
    return this.instance.SpinVditorIRDOM(markdown)
  }

  // ir 获取 md
  public VditorIRDOM2Md(html: string): string {
    return this.instance.VditorIRDOM2Md(html)
  }

  // md 转换为 ir
  public Md2VditorIRDOM(text: string): string {
    return this.instance.Md2VditorIRDOM(text)
  }

  // 获取 HTML
  public VditorIRDOM2HTML(html: string): string {
    return this.instance.VditorIRDOM2HTML(html)
  }

  // 粘贴时将 html 转换为 sv
  public HTML2VditorIRDOM(html: string): string {
    return this.instance.HTML2VditorIRDOM(html)
  }

  // sv 输入渲染
  public SpinVditorSVDOM(text: string): string {
    return this.instance.SpinVditorSVDOM(text)
  }

  // 粘贴是 md 转换为 sv
  public Md2VditorSVDOM(text: string): string {
    return this.instance.Md2VditorSVDOM(text)
  }

}