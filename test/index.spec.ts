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

  it('should rewrite container class name', () => {
    const md = new MarkdownIt().use(plugin, {
      demoContainerClass: 'test-class-name'
    })

    const code = deindent(`
      \`\`\`html
      <h1>Test</h1>
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
})
