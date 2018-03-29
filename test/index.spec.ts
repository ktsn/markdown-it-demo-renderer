import MarkdownIt = require('markdown-it')
import deindent = require('deindent')
import pug = require('pug')
import plugin = require('../src/index')

describe('Demo Renderer', () => {
  it('should render demo container over fence', () => {
    const md = new MarkdownIt().use(plugin)

    const code = deindent(`
      \`\`\`html
      <p>Hello!</p>
      \`\`\`
    `)

    expect(md.render(code)).toMatchSnapshot()
  })

  it('should not render when unsupported language', () => {
    const md = new MarkdownIt().use(plugin)

    const code = deindent(`
      \`\`\`js
      function sum(a, b) {
        return a + b
      }
      \`\`\`
    `)

    expect(md.render(code)).toMatchSnapshot()
  })

  it('should be specified preprocessor', () => {
    const md = new MarkdownIt().use(plugin, {
      languages: {
        pug: pug.render
      }
    })

    const code = deindent(`
      \`\`\` pug
      h1.title Hello World!
      \`\`\`
    `)

    expect(md.render(code)).toMatchSnapshot()
  })

  it('allows to customize wrapper element', () => {
    const md = new MarkdownIt().use(plugin, {
      wrap(demo: string, code: string): string {
        return (
          '<div class="test-demo">' +
          demo +
          '</div>' +
          '<div class="test-code">' +
          code +
          '</div>'
        )
      }
    })

    const code = deindent(`
    \`\`\`html
    <h1>Hello!</h1>
    \`\`\`
    `)

    expect(md.render(code)).toMatchSnapshot()
  })
})
