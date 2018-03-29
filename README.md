# markdown-it-demo-renderer

[markdown-it](https://github.com/markdown-it/markdown-it) renderer to render live demo over each code block fence

## Outline

This markdown-it plugin allows you to render live demo over each code block fence. For example, if you have the following HTML code block:

````md
```html
<h1>Hello!</h1>
```
````

The renderer will generate the following HTML (added some comments and indentations for readability):

```html
<!-- Live demo -->
<div class="markdown-demo">
  <h1>Hello!</h1>
</div>

<!-- Escaped code block (same as the output of normal renderer) -->
<pre><code class="language-html">
  &lt;h1&gt;Hello!&lt;/h1&gt;
</code></pre>
```

## Usage

Install it via npm:

```sh
$ npm install markdown-it-demo-renderer
```

Then apply it to your markdown-it instance.

```js
const MarkdownIt = require('markdown-it')
const md = new MarkdownIt()
  .use(require('markdown-it-demo-renderer'))

const code = `
\`\`\`html
<h1>Hello!</h1>
\`\`\`
`

console.log(md.render(code))
```

### Customize Wrapper Element

Sometimes you may want to custom the wrapper element of a live demo and a code example. In that case, you specify `wrap` option when apply the renderer. The `wrap` option should be a function that receives a live demo and a code example html strings and return wrapped entire html string.

```js
const MarkdownIt = require('markdown-it')
const md = new MarkdownIt()
  .use(require('markdown-it-demo-renderer'), {
    wrap: (demo, code) => {
      return (
        // Wrap demo html string with `.example-demo`
        '<div class="example-demo">' + demo + '</div>' +
        // Wrap code html string with `.example-code`
        '<div class="example-code">' + code + '</div>'
      )
    }
  })
```

### Preprocessor

markdown-it-demo-renderer supports `html` code block to render live demo in default. You can add other html preprocessors by passing `preprocessors` option. `preprocessors` expects transform functions that receive the original code string and expect to return transformed html string for each language.

```js
const MarkdownIt = require('markdown-it')
const pug = require('pug')

const md = new MarkdownIt()
  .use(require('markdown-it-demo-renderer'), {
    preprocessors: {
      // Enable to show live demo for `pug` code block
      pug: code => {
        // Return compiled html code
        return pug.render(code)
      }
    }
  })

const code = `
\`\`\`pug
h1 Hello!
\`\`\`
`

console.log(md.render(code))
```

## License

MIT
