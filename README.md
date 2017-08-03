# Zend Framework MkDocs Theme

This repository contains the MkDocs theme proposed for Zend Framework
documentation.

It is forked from the dist-build of the [Cinder](tps://github.com/chrissimpkins/cinder)
theme, by Chris Simpkins, with a number of modifications, including:

- Footer modifications to link to the ZF project.
- Some CSS modifications for navbar color, default text size and line spacing,
  etc.
- Updates to use a [prismjs](http://prismjs.com) build for syntax highlighting.
- Addition of navigation pager at bottom of page, but also at top when the menu
  is collapsed.
- CSS for landing pages.

The theme itself resides in `theme/`. Also included are tools for building and
deploying documentation.

## gh-pages automation

We formerly used Travis-CI for building documentation. However, this meant
updating the `.travis.yml` for every single repository whenever there were
changes to the build process, or whenever we needed to revoke an OAuth token. As
of July 2017, we are moving to a system whereby builds are triggered by
successful build status events.

### 1. Setup a personal access token

You'll need to setup a personal access token on GitHub. You can do this
from your `Settings` page; access the `Personal access tokens` screen, generate
a new token, and copy it once generated; this will be the only time GitHub will
show it to you! When you create it, give it only the `public_repo` scope.

This token will be used with the `deploy.sh` script.

### 2. Clone the repository for which to build documentation

Usually something like:

```bash
$ git clone -b master git://github.com/zendframework/<repo>.git
```

### 3. Clone this repo into the component repository

```bash
$ cd <repo>
$ git clone git://github.com/zendframework/zf-mkdoc-theme.git
```

### 4. Run the deploy script

```bash
$ ./zf-mkdoc-theme/deploy.sh \
> -n "your github username" \
> -e "email associated with your username" \
> -t "personal access token" \
> -r "github.com/zendframework/<repo>.git"
> -u "https://docs.zendframework.com/<repo>"
```

This will build the docs in one of `doc/html/` or `docs/html/` (depending on
which tree is present in the component) and push the build to the gh-pages
branch of the repository.

## Build requirements

You will need the following in order to build documentation:

- Python
- PIP
- mkdocs (`pip install --user mkdocs`)
- pymdown-extensions (`pip install --user pymdown-extensions`)
- yarn
- gulp (`yarn global add gulp`)
- perl

## CSS and JavaScript

CSS and JS are minified and concatenated during the build process. CSS is found
in the `asset/sass/` directory (we use SASS for defining our CSS), and JS is
found in the `asset/js/` directory.

## Images

Images deployed with the documentation are found in the `asset/img/`
subdirectory.

## prism.js

Documentation utilizes prism.js for code snippets. The following options were
selected when creating the CSS/JS used by the documentation via the
http://prismjs.com/download.html page:

- Minified version
- Okaida theme
- Markup
- CSS
- C-like
- JavaScript
- Apache Configuration
- Bash
- Batch
- CSS Extras
- Diff
- Docker
- Git
- Handlebars
- HTTP
- Ini
- JSON
- Less
- Makefile
- Markdown
- nginx
- PHP
- PHP Extras
- PowerShell
- Puppet
- Sass (Sass)
- Sass (Scss)
- Smarty
- SQL
- Twig
- vim
- YAML
