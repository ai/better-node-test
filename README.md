# Better Node Test

The CLI shortcut for [`node --test`](https://nodejs.org/api/test.html) with:

- **TypeScript** support.
- `-t` **shortcut** to run special test.
- `--coverage` to check test coverage.

<p align="center">
  <img src="./screenshot.png" alt="Better Node Test CLI" width="721">
</p>

---

<img src="https://cdn.evilmartians.com/badges/logo-no-label.svg" alt="" width="22" height="16" />  Better Node Test is built by <b><a href="https://evilmartians.com/">Evil Martians</a></b>, an American design and engineering consultancy for <b>developer tools, AI, and cybersecurity startups</b>.

---

## Install

```sh
npm install --save-dev better-node-test
```

## Usage

To run all tests with `*.test.ts` or `*.test.js`:

```sh
npx bnt
```

To run special test:

```sh
npx bnt ./test/request.test.ts -t 'uses HTTPS'
```

To run test coverage:

```sh
npx bnt --coverage 100 --coverage-exclude '**/*.test.*'
```

Use `/* node:coverage ignore next 2 */` comments to ignore lines.
