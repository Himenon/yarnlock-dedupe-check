import { PurePackageData } from "./types";

/**
 * @example raw @pkg1/hoge@^1.2.3
 */
export const parseConcatNameAndVersionString = (raw: string): PurePackageData => {
  const values = raw.split("@");
  if (values.length == 2) {
    return {
      name: values[0],
      version: values[1],
    };
  } else {
    return {
      name: `@${values[1]}`,
      version: values[2],
    };
  }
};
