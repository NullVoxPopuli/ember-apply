const path = require('path');

const appRoot = path.join(__dirname, '../');
const libraries = [
  /* someLibraryName */
];

const libraryPaths = libraries.map((name) =>
  path.dirname(require.resolve(name)),
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    `${appRoot}/app/**/*.{js,ts,hbs,gjs,gts,html}`,
    ...libraryPaths.map(
      (libraryPath) => `${libraryPath}/**/*.{js,ts,hbs,gjs,gts,html}`,
    ),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

