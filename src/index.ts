import { MarkdownIt } from 'markdown-it'

namespace plugin {
  export type Preprocessor = (code: string) => string

  export interface RendererParams {
    preprocessors?: Record<string, Preprocessor>
    wrap?: (demo: string, code: string) => string
  }
}

const defaultPreprocessors: Record<string, plugin.Preprocessor> = {
  html: code => code
}

function defaultWrap(demo: string, code: string): string {
  return '<div class="markdown-demo">' + demo + '</div>' + code
}

function plugin(md: MarkdownIt, params: plugin.RendererParams = {}): void {
  const defaultRenderer = md.renderer.rules.fence
  const wrap = params.wrap || defaultWrap
  const preprocessors = {
    ...defaultPreprocessors,
    ...(params.preprocessors || {})
  }

  md.renderer.rules.fence = function demoRenderer(
    tokens,
    idx,
    options,
    env,
    self
  ) {
    const token = tokens[idx]
    const preprocess = preprocessors[token.info.trim()]

    if (!preprocess) {
      return defaultRenderer(tokens, idx, options, env, self)
    }

    const demo = preprocess(token.content)

    return wrap(demo, defaultRenderer(tokens, idx, options, env, self) as any)
  }
}

export = plugin
