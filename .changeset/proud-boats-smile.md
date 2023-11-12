---
"@ember-apply/tailwind-webpack": patch
---

Fixes: #495

- Make some check/throw so that the logic doesn ot just silently fail, but gives reasonable guidance.
- Make sure that the import statement is inserted correctly.
- We now assume the need to have embroider ready project.
- We throw information if that is not adhered to.
- Changed from HTML parser (why did I do that?) to jscodeshift one.
- We throw when there is already `packagerOptions` defined.
