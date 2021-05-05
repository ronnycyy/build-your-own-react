// in render function, set the nextUnitOfWork to the root of the fiber tree
// Then, when the browser is ready, it will call our workLoop and we will start working on the root

// progress: 
// 1. jsx -> react element 
// 2. render(element, ...) -> in render function, nextUnitOfWork ready
// 3. requestIdleCallback run at some time, now nextUnitOfWork ready, and shouldYield is false, so workLoop's performUnitOfWork function execute

/**
 * we can watch nextUnitOfWork's struct at this chapter
 * 
 * nextUnitOfWork {
 *  dom,
 *  props
 * }
 */

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

function createDOM(fiber) {
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type)

  const isProperty = key => key !== "children"
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = fiber.props[name]
    })

  return dom
}

function render(element, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element]
    }
  }
}

let nextUnitOfWork = null

function workLoop(deadline) {
  let shouldYield = false

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)

    shouldYield = deadline.timeRemaining() < 1
  }

  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

function performUnitOfWork() {
  // TODO add dom node
  // TODO create new fibers
  // TODO return new next unit of work
}

const Didact = {
  createElement,
  render,
}

const container = document.getElementById("root")

/** @jsx Didact.createElement */
Didact.render(
  <div>
    <h1>
      <p />
      <a />
    </h1>
    <h2 />
  </div>,
  container
)
