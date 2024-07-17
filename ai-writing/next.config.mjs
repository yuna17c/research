/** @type {import('next').NextConfig} */
// const nextConfig = {};

const nextConfig = {
    reactStrictMode: true,
    env: {
      SYSTEM_INITIALIZE: 'system-initialize',
      TEXT_INSERT: 'text-insert',
      TEXT_DELETE: 'text-delete',
      SUGGESTION_GENERATE: 'suggestion-generate',
      SUGGESTION_ACCEPT: 'suggestion-accept',
      SUGGESTION_REGENERATE: 'suggestion-regenerate',
      SUGGESTION_CLOSE: 'suggestion-close',
      CURSOR_BACKWARD: 'cursor-backward',
      CURSOR_FORWARD: 'cursor-forward',
      CURSOR_SELECT: 'cursor-select',
      SKIP: 'skip',
    },
  };
  

export default nextConfig;