// @ts-check

/**
 * @typedef {import('../js/transform').CallbackApi} JSTransformArgs
 *
 */

/**
 *
 * @example
 *
 * ```js
 * import { js, ember } from 'ember-apply';
 *
 * await js.transform('path/to/deprecation-workflow.js', ({ root, j }) => {
 *   let { ensureThrow, ensureLog } = ember.deprecations.withAST({ root, j });
 *
 *   ensureThrow('computed-property.override');
 *   ensureLog('ember-modifier.function-based-options');
 * });
 * ```
 *
 * @param {JSTransformArgs} transformArgs the root and jscodeshift object from js.transform
 */
export function withAST({ root, j }) {
  return {
    ensureThrow:
      /**
       * @param {string} id the deprecation-id to switch to "throw"
       */
      (id) => ensureThrow(id, { root, j }),
    ensureLog:
      /**
       * @param {string} id the deprecation-id to switch to "log"
       */
      (id) => ensureLog(id, { root, j }),
    ensureSilence:
      /**
       * @param {string} id the deprecation-id to switch to "silonce"
       */
      (id) => ensureSilence(id, { root, j }),
    remove:
      /**
       * @param {string} id the deprecation-id to remove
       */
      (id) => remove(id, { root, j }),
  };
}

/**
 * jscodeshift helper for ensuring that a deprecation workflow
 * file has an entry with the correct "handler".
 *
 * @typedef {JSTransformArgs & { handler: string }} EnsureOptions
 * @typedef {import('jscodeshift')} J
 * @typedef {J['RestElement']} RestElement
 * @typedef {J['SpreadElement']} SpreadElement
 * @typedef {J['ExpressionKind']} ExpressionKind
 * @typedef {J['ObjectExpression']} ObjectExpression
 *
 *
 * @typedef {RestElement | SpreadElement | ExpressionKind} Entry
 *
 *
 * @param {string} id
 * @param {EnsureOptions} options
 */
export function ensure(id, { root, j, handler = 'throw' }) {
  root
    .find(j.Property, {
      key: { name: 'workflow' },
      value: { type: 'ArrayExpression' },
    })
    .forEach((path) => {
      if (!('elements' in path.node.value)) return;

      /**
       * @type {(Entry | null)[]}
       */
      let entries = path.node.value.elements;

      /**
       * @param {string} matchId
       * @param {string} [handler]
       */
      // function has(matchId, handler = 'throw') {
      //   let entry = get(matchId);

      //   return handlerIs(entry, handler);
      // }

      /**
       * @param {Entry} entry
       * @param {string} [handler]
       */
      function handlerIs(entry, handler = 'throw') {
        let currentHandler = entry.properties.find(
          /** @param {any} prop */
          (prop) => prop.key.name === 'handler',
        ).value.value;

        return currentHandler === handler;
      }

      /**
       * @param {string} matchId
       */
      function get(matchId) {
        return entries
          .filter(
            /** @param {Entry} entry */
            (entry) => entry.type === 'ObjectExpression',
          )
          .find(
            /** @param {any} entry */
            (entry) => {
              let hasId = entry.properties.find(
                /** @param {any} prop */
                (prop) =>
                  prop.key.name === 'matchId' && prop.value.value === matchId,
              );

              return hasId;
            },
          );
      }

      let entry = get(id);

      if (!entry) {
        let handler = j.property(
          'init',
          j.identifier('handler'),
          j.literal('throw'),
        );
        let matchId = j.property(
          'init',
          j.identifier('matchId'),
          j.literal(id),
        );
        let newEntry = j.objectExpression([handler, matchId]);

        entries.unshift(newEntry);

        return;
      }

      if (handlerIs(entry, handler)) {
        return;
      }

      j(entry)
        .find(j.Property, { key: { name: 'handler' } })
        .forEach((entryPath) => {
          let replacement = j.property(
            'init',
            j.identifier('handler'),
            j.literal(handler),
          );

          j(entryPath).replaceWith(replacement);
        });
    });
}

/**
 * @param {string} id
 * @param {JSTransformArgs} options
 */
function remove(id, { root, j }) {
  console.info({ id, root, j });
  throw 'Remove not implemented, please open an issue or PR';
}

/**
 * @param {string} id
 * @param {JSTransformArgs} options
 */
function ensureSilence(id, { root, j }) {
  return ensure(id, { root, j, handler: 'silence' });
}

/**
 * @param {string} id
 * @param {JSTransformArgs} options
 */
function ensureThrow(id, { root, j }) {
  return ensure(id, { root, j, handler: 'throw' });
}

/**
 * @param {string} id
 * @param {JSTransformArgs} options
 */
function ensureLog(id, { root, j }) {
  return ensure(id, { root, j, handler: 'log' });
}
