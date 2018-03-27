import { MarkdownIt } from 'markdown-it'

namespace plugin {
  export type Preprocessor = (code: string) => string

  export interface RendererParams {
    demoContainerClass?: string
    languages?: Record<string, Preprocessor>
  }
}

const defaultLanguages: Record<string, plugin.Preprocessor> = {
  html: code => code
}

function plugin(md: MarkdownIt, params: plugin.RendererParams = {}): void {
  const defaultRenderer = md.renderer.rules.fence
  const demoContainerClass = params.demoContainerClass || 'markdown-demo'
  const languages = {
    ...defaultLanguages,
    ...(params.languages || {})
  }

  md.renderer.rules.fence = function demoRenderer(
    tokens,
    idx,
    options,
    env,
    self
  ) {
    const token = tokens[idx]
    const preprocess = languages[token.info.trim()]

    if (!preprocess) {
      return defaultRenderer(tokens, idx, options, env, self)
    }

    const html = preprocess(token.content)

    return (
      `<div class="${demoContainerClass}">${html}</div>` +
      defaultRenderer(tokens, idx, options, env, self)
    )
  }
}

export = plugin
