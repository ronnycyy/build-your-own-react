# 函数组件
下一件要做的事是添加对`函数组件`的支持

首先让我们换一个`React`应用。我们将使用下面这个简单的函数组件，她返回一个`h1`元素
```jsx
/** @jsx Didact.createElement */
function App(props) {
  return <h1>Hi {props.name}</h1>
}
const element = <App name="foo" />

// render
const container = document.getElementById("root")
Didact.render(element, container)
```

如果我们将`jsx`转换为`js`，她会变成下面这样
```js
function App(props) {
  return Didact.createElement(
    "h1",
    null,
    "Hi ",
    props.name
  )
}
const element = Didact.createElement(
  App,
  { name: "foo" }
)
```

`函数组件`与直接写`jsx`语句有两点不同:
1. 来自`函数组件`的`fiber`，没有`DOM`的`node`
2. 子节点要执行函数才能获得，而不是直接从`props`中取

检查`fiber`的类型是否为`function component`，以区分使用哪个更新函数
```js
function performUnitOfWork(fiber) {
  const isFunctionComponent = fiber.type instanceof Function

  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }
  
  // ...
}
```

`updateHostComponent`是我们之前的更新逻辑
```js
function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  reconcileChildren(fiber, fiber.props.children)
}
```

`updateFunctionComponent`中，我们执行函数，以取得子结点。
```js
function updateFunctionComponent(props) {
  const children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children)
}
```
在我们这个例子中，`fiber.type`是`APP`函数，当我们执行她之后，返回的是`h1`元素。

然后，取得了子结点，协调函数将以同样方式工作，这里我们不需要做任何修改。

我们需要修改的是`commitWork`函数。

现在我们可能会接收到没有`node`的`fiber`，所以我们需要改变两个地方。

第一个地方在`添加结点`的时候，需要寻找到`node`的父结点，所以我们需要沿着`fiber`树一直往上找，直到找到一个具有`dom`的`fiber`结点
```js
function commitWork(fiber) {
  // ...
  let domParentFiber = fiber.parent
  while(!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent
  }
  const domParent = domParentFiber.dom
  // ...
}
```

第二个地方是在`删除结点`的时候，这时候需要沿着`fiber`树往下找，直到找到一个具有`dom`的`fiber`子结点
```js
function commitWork(fiber) {
  // ...
  else if (fiber.effectTag === "DELETION") {
    commitDeletion(fiber, domParent)
  }
  // ...
}

function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom)
  } else {
    commitDeletion(fiber.child, domParent)
  }
}
```


# Hooks