import assert from 'assert';

import { enableConsole } from './env.js';

/**
 * @param {string | number} methodPath
 */
export async function runMethodPath(methodPath) {
  let parts = `${methodPath}`.split('#');

  assert(
    parts.length === 2,
    `module#method identifier must be a string separated by a #`,
  );

  let [modulePath, methodName] = parts;

  /**
   * @type {Record<string, Record<string, unknown>>}
   */
  let indexModule = await import('../index.js');
  let chosenModule = indexModule[modulePath];

  assert(
    chosenModule,
    `Could not find namespace at path '${modulePath}. Available namespaces: ${Object.keys(
      indexModule,
    ).join(', ')}`,
  );
  assert(
    methodName in chosenModule,
    `method ${methodName} could not be found in module ${modulePath}`,
  );

  let maybeFn = chosenModule[methodName];

  assert(typeof maybeFn === 'function', `'${methodName}' is not a function`);

  enableConsole();

  await maybeFn();
}
