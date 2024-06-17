interface Atributes {
  name: string;
  value: string;
}
interface ElementParametrs {
  tag: string;
  cssClasses: string[];
  textContent?: string;
  atributes?: Atributes[];
  quantity?: number;
  target?: string;
  innerHTML?: string;
}

class ElementCreator {
  private element: HTMLElement;

  constructor(param: ElementParametrs) {
    this.element = this.createElement(param.tag);
    this.setCssCLasses(param.cssClasses);
    if (param.textContent !== undefined) {
      this.setTextContent(param.textContent);
    }
    if (param.atributes !== undefined) {
      this.setElementAttributes(param.atributes);
    }
    if (param.innerHTML) {
      this.setInnerHtml(param.innerHTML);
    }
  }

  private createElement(tag: string): HTMLElement {
    const element = document.createElement(tag);
    return element;
  }

  private setCssCLasses(cssClasses: string[]): void {
    for (let i = 0; i < cssClasses.length; i += 1) {
      this.element?.classList.add(cssClasses[i].trim());
    }
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public addInnerElements(...param: HTMLElement[]): void {
    for (let i = 0; i < param.length; i += 1) {
      this.getElement()?.append(param[i]);
    }
  }

  public setTextContent(text: string): void {
    if (this.element !== null) {
      this.element.textContent = text;
    }
  }

  public setElementAttributes(atributes: Atributes[]): void {
    for (let i = 0; i < atributes.length; i += 1) {
      this.element?.setAttribute(atributes[i].name, atributes[i].value);
    }
  }

  public setInnerHtml(innerHtml: string): void {
    if (this.element) {
      this.element.innerHTML = innerHtml;
    }
  }
}

export { ElementParametrs, Atributes, ElementCreator };
