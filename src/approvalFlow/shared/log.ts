let showLog = false;

function log(...args: any[]) {
  if(showLog) {
    console.warn(...args);
  }
}

export {
  log
}
