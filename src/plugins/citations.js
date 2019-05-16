const visit = require('unist-util-visit')

module.exports = () => tree => {
  visit(tree, 'linkReference', node => {
    visit(node, 'text', textNode => {
      const text = textNode.value ? textNode.value.trim() : ''

      if (text.includes('@')) {
        const keys = text
          .split(/;/)
          .map(item => item.trim())
          .filter(item => item.includes('@'))
          // TODO: syntax from https://pandoc.org/MANUAL.html#citations
          .map(item => item.substr(1))

        node.type = 'html'
        node.children = undefined
        node.value = `<Cite items="${keys.join(';')}"/>`
      }
    })
  })
}
