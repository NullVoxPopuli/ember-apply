/**
 * NOTE: don't use tabs.
 *       we don't know how wide a tab is (and kind of can't know)
 */
import { styleText } from 'node:util';

/**
 * as close to column-width as we can get
 *
 * @param {string} text
 */
function characterLength(text) {
  return [...text].length;
}

/**
 * @param {string} text
 */
export function code(text) {
  return '`' + styleText('cyan', text) + '`';
}

/**
 * @param {string} text
 */
export function linesToList(text) {
  return text
    .split('\n')
    .map((line) => `- ${line}`)
    .join('\n');
}

/**
 * @param {number} count
 */
export function spaces(count) {
  let result = '';

  for (let i = 0; i < count; i++) {
    result += ' ';
  }

  return result;
}

/**
 * @param {string} text
 */
export function note(text) {
  let [first, ...rest] = text.split('\n');

  return ` ⓘ  ${first}\n` + indent(rest.join('\n'));
}

/**
 * @param {string} msg
 * @param {string} [ chars ]
 *
 */
export function indent(msg, chars = '    ') {
  return msg
    .split('\n')
    .map((line) => chars + line)
    .join('\n');
}

/**
 *
 * @param {string} text
 * @param {number} [ offset ]
 */
export function centeredText(text, offset = 0) {
  let maxWidth = process.stdout.columns - offset;
  let spaces = '';
  let textLength = characterLength(text);
  let centerSpaces = (maxWidth - textLength) / 2;

  for (let i = 0; i < Math.floor(centerSpaces); i++) {
    spaces += ' ';
  }

  let oddFix = centerSpaces % 2 !== 0 ? ' ' : '';

  return spaces + text + spaces + oddFix;
}

/**
 * Draws an alarming box, nearly the full width of the terminal, centered
 *
 * @param {string} title
 */
export function warningBanner(title) {
  let maxWidth = process.stdout.columns;
  let padding = 8;

  maxWidth -= padding * 2;

  let numBars = maxWidth - 2;
  let horizontalBars = '';

  for (let i = 0; i < numBars; i++) {
    horizontalBars += '═';
  }

  let centered = centeredText(
    /* NOTE:
     *     some terminals don't use the correct width for this emoji --
     *     this can't be fixed here and is a bug with those terminals */
    `⚠️    ${title.toUpperCase()}    ⚠️`,
    /* padding on left and right + the two box characters on either side */ 2 *
      padding +
      2,
  );

  let message = [
    /* should take up the whole width of the terminal, about */
    /* 1 */ styleText('yellow', `╔${horizontalBars}╗`),
    /* 2 */ styleText('yellow', `║${centered /* */}║`),
    /* 3 */ styleText('yellow', `╚${horizontalBars}╝`),
  ].join('\n');

  console.warn(indent(message, spaces(padding)));
}

/**
 * @param {string} title
 * @param {string} body
 */
export function bigWarning(title, body) {
  warningBanner(title);
  console.info(body);
  warningBanner(title);
}
