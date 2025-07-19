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

cp wrangler.json ./dist/

