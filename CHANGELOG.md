# Changelog

All notable changes to this project will be documented in this file, in reverse chronological order by release.

## 0.6.2 - TBD

### Added

- Nothing.

### Changed

- [#45](https://github.com/zendframework/zf-mkdoc-theme/pull/45) updates the component "dropdown" to be based on Choices.js, which provides us the
  ability to type-to-select a package, as well as better styling and content for
  each option. The patch also now groups components in optgroups based on the
  "group" presented in the `zf-component-list.json`.

### Deprecated

- Nothing.

### Removed

- Nothing.

### Fixed

- [#44](https://github.com/zendframework/zf-mkdoc-theme/pull/44) removes the phrase "ZF Docs" from the subheader and subnavigation.

## 0.6.1 - 2018-05-22

### Added

- [#38](https://github.com/zendframework/zf-mkdoc-theme/pull/38) adds the ability to swap in HTML contents in the landing page. Packages
  may do so by providing a `.zf-mkdoc-theme-landing` file in their package root,
  and an `index.html` file in the documentation directory with the contents to
  swap in. The contents will be rendered inside the main container of the
  content area.

### Changed

- Nothing.

### Deprecated

- Nothing.

### Removed

- Nothing.

### Fixed

- Nothing.

## 0.6.0 - 2018-05-22

### Added

- Nothing.

### Changed

- [#34](https://github.com/zendframework/zf-mkdoc-theme/pull/34) rewrites the entire theme to be more mobile friendly,
  provide subnavigation in-page (instead of via a menu), improve navigation
  between components, and more. Additionally, it simplifies the SASS used, and
  reduces remote dependencies.

### Deprecated

- Nothing.

### Removed

- Nothing.

### Fixed

- Nothing.

## 0.5.3 - 2017-09-21

### Added

- [#31](https://github.com/zendframework/zf-mkdoc-theme/pull/31) adds links to
  our Slack and our forums in the footer.

### Changed

- [#31](https://github.com/zendframework/zf-mkdoc-theme/pull/31) changes all
  links to use the https scheme where possible.

- [#31](https://github.com/zendframework/zf-mkdoc-theme/pull/31) updates all
  third-party UI libraries to the latest versions in the same major releases.

- [#31](https://github.com/zendframework/zf-mkdoc-theme/pull/31) updates the
  copyright link in the footer.

### Deprecated

- Nothing.

### Removed

- [#31](https://github.com/zendframework/zf-mkdoc-theme/pull/31) removes the
  link to IRC from the footer.

### Fixed

- [#30](https://github.com/zendframework/zf-mkdoc-theme/pull/30) provides a fix
  that ensures that escaped `|` characters in rendered tables remove the escape
  character.

- [#31](https://github.com/zendframework/zf-mkdoc-theme/pull/31) fixes several
  javascript errors.

## 0.5.2 - 2016-07-05

### Added

- [#13](https://github.com/zendframework/zf-mkdoc-theme/pull/13) adds an SVG
  version of the logo.

### Deprecated

- Nothing.

### Removed

- [#13](https://github.com/zendframework/zf-mkdoc-theme/pull/13) removes the png
  version of the logo, in favor of the new SVG version.

### Fixed

- [#14](https://github.com/zendframework/zf-mkdoc-theme/pull/14) updates the
  breadcrumbs to list the site name instead of "Docs" as the first element.

## 0.4.0 - 2016-04-12

### Added

- [#9](https://github.com/zendframework/zf-mkdoc-theme/pull/9) adds a component
  list "slide down", listing all components currently with docs on GitHub Pages,
  with a short description of each, and linking to each. The list itself is held
  in this repositories gh-pages branch, and fetched via XHR on first request,
  allowing updates to the list independent of when the documentation for a given
  component is published.

### Deprecated

- Nothing.

### Removed

- Nothing.

### Fixed

- Nothing.

## 0.3.3 - 2016-03-15

### Added

- Nothing.

### Deprecated

- Nothing.

### Removed

- Nothing.

### Fixed

- [#8](https://github.com/zendframework/zf-mkdoc-theme/pull/8) ensures that
  files are added to the doc tree when initialized, by adding the `--hard`
  flag to the `git reset` invocation. This is necessary in order to allow
  preserving files between builds.

## 0.3.2 - 2016-03-15

### Added

- [#7](https://github.com/zendframework/zf-mkdoc-theme/pull/7) adds the ability
  for projects to specify files to preserve between builds. This can be done by
  adding a `.zf-mkdoc-theme-preserve` file to your project root, listing the
  files to preserve.

### Deprecated

- Nothing.

### Removed

- Nothing.

### Fixed

- Nothing.

## 0.2.6 - 2016-01-29

### Added

- Nothing.

### Deprecated

- Nothing.

### Removed

- Nothing.

### Fixed

- `deploy.sh` was updated to provide the `-q` switch to the `git push` command;
  this was done to ensure the github token is not leaked in the Travis-CI log.

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
