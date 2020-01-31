# libcheck

Check the following.

* [x] Multi version installed.

## Install

```bash
yarn add -D libcheck
```

## Usage

### Generate report

```bash
libcheck --input ./yarn.lock --html ./report.html --pattern "[namespace]"
```

### Generate JSON

```bash
libcheck --input ./yarn.lock --html ./report.html --pattern "[namespace]"
```

### Test

```bash
libcheck --input ./yarn.lock --pattern "[namespace]" --check
```

## TODO

features

* [x] yarn.lock
* [ ] package-lock.json
* [ ] other?


## License

libcheck is [MIT licensed](https://github.com/Himenon/libcheck/blob/master/LICENSE).
