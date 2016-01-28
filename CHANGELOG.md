# Changelog

All notable changes to this project will be documented in this file, in reverse chronological order by release.

## 0.2.5 - 2016-01-28

### Added

- [#3](https://github.com/zendframework/zf-mkdoc-theme/pull/3) adds the
  `theme-installer.sh` script, which provides routines for installing MkDocs and
  related extensions, as well as conditionally downloading and installing the
  zf-mkdoc-theme itself. Repositories using build automation should
  conditionally download and install this script when the target build is
  successful.

### Deprecated

- Nothing.

### Removed

- Nothing.

### Fixed

- [#3](https://github.com/zendframework/zf-mkdoc-theme/pull/3) updates the
  directions for build automation to use the new `theme-installer.sh` script to
  ensure that Travis asset caching will work as expected.

## 0.2.4 - 2016-01-28

### Added

- [#2](https://github.com/zendframework/zf-mkdoc-theme/pull/2) renames
  `cinder.css` to `zf.css`, and provides a number of updates to the jumbotron
  and "feature" panel styles.

### Deprecated

- Nothing.

### Removed

- [#2](https://github.com/zendframework/zf-mkdoc-theme/pull/2) removes several
  CSS declarations that were specific to the Expressive documentation.

### Fixed

- [#1](https://github.com/zendframework/zf-mkdoc-theme/pull/1) updates the shell
  scripts to:
  - Use `/usr/bin/env bash` for the shebang line.
  - Use a more portable way of determining the script directory.

## 0.2.3 - 2016-01-26

### Added

- Nothing.

### Deprecated

- Nothing.

### Removed

- Nothing.

### Fixed

- Updated all references to `weierophinney` to read `zendframework`, as the
  repository has moved under that organization.
- Final updates to the `after_success` script that ensure it works.

## 0.2.2 - 2016-01-26

### Added

- Re-introduces the `GH_USER_*` env variables to the Travis configuration;
  they're required by git in order to commit.

### Deprecated

- Nothing.

### Removed

- Nothing.

### Fixed

- Continued improvements to the `after_success` script.

## 0.2.1 - 2016-01-26

### Added

- Nothing.

### Deprecated

- Nothing.

### Removed

- Removes the `GH_USER_*` env variables from the Travis configuration.

### Fixed

- Provides some fixes to conditionals in the `after_success` script.

## 0.2.0 - 2016-01-26

### Added

- Adds the `theme/` subdirectory, containing all elements of the MkDocs theme.
- Adds build/deployment scripts to the root directory.
- Adds documentation on how to setup automated deployment.

### Deprecated

- Nothing.

### Removed

- Removes the MkDocs theme elements from the root directory.

### Fixed

- Nothing.

## 0.1.7 - 2016-01-25

### Added

- Adds homepage styles.
- Adds comments before and after the main content area, to allow replacing
  contents as needed.

### Deprecated

- Nothing.

### Removed

- Nothing.

### Fixed

- Nothing.

## 0.1.6 - 2016-01-25

### Added

- Adds a pager to the top of the content whenever the navbar is collapsed.

### Deprecated

- Nothing.

### Removed

- Nothing.

### Fixed

- Updates the navbar collapse point to 1024px to prevent navbar wrapping to a
  new line.
- Updates the base font selection to ensure a serif font is used, and that a
  font is available for any OS platform.

## 0.1.5 - 2016-01-25

### Added

- Updated to use Libre Baskerville instead of Open Sans for base content font.

### Deprecated

- Nothing.

### Removed

- Nothing.

### Fixed

- Nothing.

## 0.1.4 - 2016-01-23

### Added

- Adds ZF logo to topnav, linked to the website.
- Adds ZF favicon.

### Deprecated

- Nothing.

### Removed

- Nothing.

### Fixed

- Nothing.

## 0.1.3 - 2016-01-23

### Added

- Implemented prev/next pager following content.

### Deprecated

- Nothing.

### Removed

- Nothing.

### Fixed

- Fixed aria labels for prev/next links in topnav.

## 0.1.2 - 2016-01-23

### Added

- Added breadcrumbs.

### Deprecated

- Nothing.

### Removed

- Nothing.

### Fixed

- Nothing.

## 0.1.1 - 2016-01-22

### Added

- Added `<script>` tag to set `base_url` variable globally, enabling search to work.

### Deprecated

- Nothing.

### Removed

- Nothing.

### Fixed

- Nothing.

## 0.1.0 - 2016-07-21

Initial tag.

### Added

- Nothing.

### Deprecated

- Nothing.

### Removed

- Nothing.

### Fixed

- Nothing.
