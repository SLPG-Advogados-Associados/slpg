const quote = require('shell-quote').quote

module.exports = {
  '*.{js,jsx,ts,tsx}': filenames => {
    return filenames.reduce(
      (commands, filename) =>
        commands.concat([
          `eslint --fix ${filename}`,
          quote(['prettier', '--write', filename]),
          quote(['git', 'add', filename]),
        ]),
      []
    )
  },
  '*.{json,md}': ['prettier --write', 'git add'],
  'package.json': ['yarn sort-package-json', 'git add'],
}
