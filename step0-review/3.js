// implement ReactDOM.render

const element = {
  type: "h1",
  props: {
    title: "foo",
    children: "Hello"
  }
}
const container = document.getElementById("root")

// [1] create the node and fill props
const node = document.createElement(element.type)
node["title"] = element.props.title

// [2] add node children, like what [1] do, in Order to treat all elements in the same way
const text = document.createTextNode("")
text["nodeValue"] = element.props.children

// [3] append h1 to node, and then append node to container
node.appendChild(text)
container.appendChild(node)
