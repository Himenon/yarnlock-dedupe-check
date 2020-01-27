export const uniq = (stringArray: string[]) => {
  return Array.from(new Set(stringArray));
}

export const uniqObjList = (objList: Object[]) => {
  return Array.from(new Set(objList));
}
