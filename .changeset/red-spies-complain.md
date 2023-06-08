---
"ember-apply": minor
---

Add CSS tools, transform, and analyze.

For example:

```js
import { css } from "ember-apply";

let transformed = await css.analyze("some/file.css", {
  Once(root) {
    // postcss plugin
  },
});

// writes file after applying the plugin
await css.transform("some/file.css", {
  Once(root) {
    // postcss plugin
  },
});
```
