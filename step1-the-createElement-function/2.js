// create createElement function 1: base

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children  // children is always an array, even an empty array.
    }
  }
}

const element = React.createElement(
  "div",
  { id: "foo" },
  React.createElement("a", null, "bar"),
  React.createElement("b")
)

const container = document.getElementById("root")
ReactDOM.render(element, container)