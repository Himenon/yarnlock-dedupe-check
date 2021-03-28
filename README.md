# yarnlock-dedupe-check

Check the following.

* [x] Multi version installed.
* [x] Monorepo

## Install

```bash
yarn add -D yarnlock-dedupe-check
```

## Usage

```bash
Usage: yarnlock-dedupe-check [options]

Check the health of npm libraries installed with yarn or npm.

Options:
  -V, --version                               output the version number
  -i --input <yarn.lock | package-lock.json>  input yarn.lock file
  --json <output.json>                        output filename.
  --html <output.html>                        output html filename.
  --ignore <regex>                            ignore regex pattern
  --test <regex>                              test target pattern
  --warn <regex>                              warning target pattern
  -h, --help                                  output usage information
```

### Generate JSON report

```bash
yarnlock-dedupe-check --input ./yarn.lock --test "[String RegExp]" --json ./report.json
```

DEMO: https://himenon.github.io/node-yarnlock-dedupe-check/

### Generate HTML Report

```bash
yarnlock-dedupe-check --input ./yarn.lock --test "[String RegExp]" --html ./report.html
```

DEMO: <https://himenon.github.io/yarnlock-dedupe-check>

### Test

```bash
yarnlock-dedupe-check --input ./yarn.lock --test "^react$" --warn "react"
```

### Select target

* `--pattern` : test target (JS RegExp)
* `--skip`    : test skip target (JS RegExp)

## License

yarnlock-dedupe-check is [MIT licensed](https://github.com/Himenon/yarnlock-dedupe-check/blob/master/LICENSE).
