// break the work into small units

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === "object"
          ? child
          : createTextElement(child)
      ),
    },
  }
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  }
}

function render(element, container) {
  const dom =
    element.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type)

  const isProperty = key => key !== "children"
  Object.keys(element.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = element.props[name]
    })

  element.props.children.forEach(child =>
    render(child, dom)
  )


  /**
   * we are going to break the work into small units, 
   * and after we finish each unit,
   * we’ll let the browser interrupt the rendering if there’s anything else that needs to be done.
   */
  let nextUnitOfWork = null

  function workLoop(deadline) {
    let shouldYield = false

    // 持续循环，直到分配的时间结束
    while (nextUnitOfWork && !shouldYield) { 
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork)

      shouldYield = deadline.timeRemaining() < 1
    }

    // 分配时间结束，重新设置工作循环，将在浏览器空闲时执行
    requestIdleCallback(workLoop)
  }

  requestIdleCallback(workLoop)   // 入口

  function performUnitOfWork() {
    // TODO
  }

  container.appendChild(dom)
}

const Didact = {
  createElement,
  render,
}

/** @jsx Didact.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
)
const container = document.getElementById("root")
Didact.render(element, container)
