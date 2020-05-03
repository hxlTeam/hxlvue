/**
 * new Compile(el,vm)
 */
class Compile {
  constructor(el, vm) {
    this.$vm = vm;
    this.$el = document.querySelector(el);
    if (this.$el) {
      // 提取宿主中模板内容到Fragment标签，dom操作会提高效率
      this.$fragment = this.node2Fragment(this.$el);
      // 编译模板内容，同时进行依赖收集
      this.compile(this.$fragment);
      // 将编译会的纯html代码，追加到$el上
      this.$el.appendChild(this.$fragment);
    }
  }

  node2Fragment(el) {
    const fragment = document.createDocumentFragment();
    let firstChild;
    while (firstChild = el.firstChild) {
      fragment.appendChild(firstChild);
    }
    return fragment;
  }

  compile(el) {
    const childNodes = el.childNodes;

    Array.from(childNodes).forEach(node => {
      // 判断节点类型
      if (node.nodeType === 1) {// element节点
        console.log(`编译元素节点:${node.nodeName}`);
      }
      else if (this.isInterpolation(node)) { // 插值表达式
        console.log(`编译插值文本:${node.textContent}`);
      }
      // 递归子节点
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node);
      }
    });

  }

  isInterpolation(node) {
    return node.nodeType === 3 && /\{\{.*\}\}/.test(node.textContent); // 是文本且符合{{}}
  }
}