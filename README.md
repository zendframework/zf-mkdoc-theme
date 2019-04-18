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

## Redirects

If you want a page to redirect to another URL, and not appear in the navigation,
this theme supports that by allowing you to prefix the title of such a page with
`_` within the `mkdocs.yml` file:

```yaml
pages:
    - index.md
    - "_intro": intro.md
    - "Intro": v2/intro.md
```

In order to create the redirect, you will need to create two HTML artifacts in
your markdown file:

- A meta refresh tag, for when javascript is not present.
- A `DOMContentLoaded` listener.

In the example above, the contents of `intro.md` would then look like the
following:

```markdown
<noscript><meta http-equiv="refresh" content="0; url=v2/intro/"></noscript>
<script>
  document.addEventListener("DOMContentLoaded", function (event) {
    var uri = new URL(window.location.href);
    uri.pathname = 'v2/intro/';
    window.location = uri.href;
  });
</script>
```

When the pages are built, the path `/intro/` will still be present, but the page
will not be linked in the navigation. Additionally, that page will place the
fully rendered markdown contents _within the `<head>` tag of the document_.

This approach allows the legacy URL to still resolve, ensuring existing links
continue to work. The presence of the redirect ensures the user is redirected to
reasonable content, and that search engines will stop linking the old URL.

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
- markdown-fenced-code-tabs (`pip install --user markdown-fenced-code-tabs`)
- npm
- gulp (`npm install -g gulp`)
- perl

## CSS and JavaScript

Whenever changes to the CSS or JS are made in the `asset/` directory, you will
need to rebuild and commit the assets. This ensures that the build automation
does not need to do these steps, which can be problematic to debug; it also
greatly speeds build times!

To rebuild the assets:

```bash
$ git rm -rf theme/{css,js,img}/*
$ ./asset.sh
$ git add assets.yml theme/{css,js,img}
$ git commit -c 'Rebuilt assets'
```

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
- Markup templating
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
