#!/bin/bash
#
#
# This script creates a quick app that you can diff and browse
# (faster than if using the automated tests)
# ...maybe that's a problem with the automated tests... idk


ABSOLUTE_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
currentDirectory="$(dirname $ABSOLUTE_PATH)"
repoRoot="$currentDirectory/../../.."
applyDirectory="$repoRoot/ember-apply"
cli="$applyDirectory/src/cli/index.js"
applyable="$currentDirectory/index.js"
target=$(mktemp -d -t ember-test-XXXX)

echo ""
echo ""
echo "Manual test directory is at $target"
echo "Repo root is                $repoRoot"
echo "CLI and util directory is   $applyDirectory"
echo "CLI exists $(test -f $cli && echo "yes")"
echo "applyable exists $(test -f $applyable && echo "yes")"
echo ""
echo ""

cd $target

commandArgs="$cli --verbose $applyable"

echo ""
echo ""
echo "In $target/my-app"
echo "about to run:"
echo "  node $commandArgs"
echo ""
node $commandArgs



