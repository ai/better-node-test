# Better Node Test

The CLI shortcut for `node --test` with:

* **TypeScript** support.
* Shorter arguments to type. For instance, **-t** to run special test.

---

<img src="https://cdn.evilmartians.com/badges/logo-no-label.svg" alt="" width="22" height="16" />  Made in <b><a href="https://evilmartians.com/?utm_source=nanoid&utm_campaign=devtools-button&utm_medium=github">Evil Martians</a></b>, product consulting for <b>developer tools</b>.

---

## Usage

Install CLI:

```sh
npm install --save-dev better-node-test
```

For TypeScript you will also need `tsm`:

```sh
npm install --save-dev better-node-test tsm
```

To run all tests with `*.test.ts` or `*.test.js`:

```sh
npx bnt
```

To run special test:

```sh
npx bnt ./test/request.test.ts -t 'uses HTTPS'
```
