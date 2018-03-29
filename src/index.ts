import { MarkdownIt } from 'markdown-it'

namespace plugin {
  export type Preprocessor = (code: string) => string

  export interface RendererParams {
    languages?: Record<string, Preprocessor>
    wrap?: (demo: string, code: string) => string
  }
}

const defaultLanguages: Record<string, plugin.Preprocessor> = {
  html: code => code
}

function defaultWrap(demo: string, code: string): string {
  return '<div class="markdown-demo">' + demo + '</div>' + code
}

function plugin(md: MarkdownIt, params: plugin.RendererParams = {}): void {
  const defaultRenderer = md.renderer.rules.fence
  const wrap = params.wrap || defaultWrap
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

    const demo = preprocess(token.content)

    return wrap(demo, defaultRenderer(tokens, idx, options, env, self) as any)
  }
}

export = plugin
