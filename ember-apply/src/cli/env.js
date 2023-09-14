let __isConsoleEnabled = false;

export function enableConsole() {
  __isConsoleEnabled = true;
}

export function isConsoleEnabled() {
  return __isConsoleEnabled === true;
}

export function disableConsole() {
  __isConsoleEnabled = false;
}
