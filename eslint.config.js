import loguxConfig from '@logux/eslint-config'

export default [
  ...loguxConfig,
  {
    rules: {
      'n/no-unsupported-features/node-builtins': 'off'
    }
  }
]
