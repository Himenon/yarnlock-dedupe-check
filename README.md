# libcheck

Check the following.

* [x] Multi version installed.

## Install

```bash
yarn add -D libcheck
```

## Usage

### Generate HTML report

```bash
libcheck --input ./yarn.lock --html ./report.html --pattern "[String RegExp]"
```

DEMO: https://himenon.github.io/node-libcheck/index.html

### Generate JSON

```bash
libcheck --input ./yarn.lock --html ./report.html --pattern "[String RegExp]"
```

### Test

```bash
libcheck --input ./yarn.lock --pattern "[namespace]" --test
```

## TODO

features

* [x] yarn.lock
* [ ] package-lock.json
* [ ] other?


## License

libcheck is [MIT licensed](https://github.com/Himenon/libcheck/blob/master/LICENSE).
