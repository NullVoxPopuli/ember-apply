#!/bin/bash
#
# Dear cloudflare, if you see this,
# if you support pnpm in your build workers, 
# I can replace all of this with pnpm build:docs
#
# Also, due to taking over the `functions` path, you broke 
# type doc deploys....
# 
# I would very much like to not have this script at all.
echo "==================================================="
echo "||            For running on CI  only            ||"
echo "==================================================="

# npm install --location global pnpm
# pnpm i --ignore-scripts
pnpm build
pnpm build:docs

cd packages/docs/

# cloudflare broke all user's Sites that have a "functions" path.
# ... thanks cloudflare. you're usually such a good company :p 
#
#  - https://github.com/NullVoxPopuli/ember-resources/issues/679
#  - https://github.com/TypeStrong/typedoc/issues/2111
#  - https://github.com/cloudflare/wrangler2/issues/2240
#  - https://community.cloudflare.com/t/functions-dir-is-ignored-in-deploy/438211
DOCS_DIRECTORY='dist'
FUNCTIONS='functions'
RENAMED_FUNCTIONS='funcs'
FUNCTIONS_DIRECTORY="$DOCS_DIRECTORY/$FUNCTIONS"
RENAMED_FUNCTIONS_DIRECTORY="$DOCS_DIRECTORY/$RENAMED_FUNCTIONS"

mv $FUNCTIONS_DIRECTORY $RENAMED_FUNCTIONS_DIRECTORY

echo $PWD
echo $DOCS_DIRECTORY
find $DOCS_DIRECTORY \
  -type f \
  -name "*.html" \
  -exec \
    sed -i -e "s/${FUNCTIONS}/${RENAMED_FUNCTIONS}/g" {} +

echo "Renamed $FUNCTIONS_DIRECTORY to $RENAMED_FUNCTIONS_DIRECTORY"



