export const getObjectKeyByValue: any = (o: any, val: any) => {
  return Object.keys(o).filter( key => {
    // console.log('object-util.ts: key, o[key], val:', key, o[key], val);
    if(o[key] === val) {
      return key;
    }
  });
};
