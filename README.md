# libcheck

Check the following.

* [x] Multi version installed.
* [x] Monorepo

## Install

```bash
yarn add -D libcheck
```

## Usage

### Generate HTML report

before install

```
yarn add react react-dom
```

```bash
libcheck --input ./yarn.lock --html ./report.html --pattern "[String RegExp]"
```

DEMO: https://himenon.github.io/node-libcheck/

### Generate JSON

```bash
libcheck --input ./yarn.lock --html ./report.html --pattern "[String RegExp]"
```

### Test

```bash
libcheck --input ./yarn.lock --pattern "[String RegExp]" --test
```

### Select target

* `--pattern` : test target (JS RegExp)
* `--skip`    : test skip target (JS RegExp)

## TODO

features

* [x] yarn.lock
* [ ] package-lock.json
* [ ] other?


## License

libcheck is [MIT licensed](https://github.com/Himenon/libcheck/blob/master/LICENSE).
