# Defrag

## Usage

```bash 
defrag-dependencies
```

## Config

Example `.defragrc.yaml`
```yaml
# When writing to package.json,
# remove the semver-range, pinning the dependencie
# to an exact version.
write-as: pinned

# Default assumes every package follows semver and
# is 100% safe to upgrade within semver ranges.
#
# in practice, this is only true if all dependencies
# sharing those listed here do not use private APIs.
#
# Due to private API usage (or relying on "undefined" behavior)
# we are more conservative with these ranges and will deal with
# them more manually.
update-range:
  "~":
    - ember-source
    - ember-data
    - "@ember-data/*"
```
