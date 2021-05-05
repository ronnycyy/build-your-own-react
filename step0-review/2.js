// replace React.createElement with its output

const element = {
  type: "h1",   // tag name, it can alse be a function, see Step VII
  props: {
    title: "foo",
    // Children is usually an array with elements.
    // But in this case, it's a string, because element only have a text node child.
    children: "Hello"
  }
}

// element has more properties, but now we only care about these two

const container = document.getElementById("root")
ReactDOM.render(element, container)
