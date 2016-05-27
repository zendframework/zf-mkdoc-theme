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

To automate GitHub Pages builds, you will need to update the `.travis.yml` file.

### 1. Setup a personal access token

You'll need to setup a personal access token on GitHub. You can do this
from your `Settings` page; access the `Personal access tokens` screen, generate
a new token, and copy it once generated; this will be the only time GitHub will
show it to you! When you create it, give it only the `public_repo` scope.

### 2. Encrypt the token for use with Travis

Next, we'll encrypt that token for use with Travis. You'll need to install the
Travis CLI tool, which is detailed on their [Environment Variables page](https://docs.travis-ci.com/user/environment-variables/#Encrypted-Variables).
Once you have installed the tool and logged in for the first time, run the
following:

```console
$ travis encrypt -r <org>/<repo> GH_TOKEN=<token>
```

Copy and paste the output into the `env` section of your `.travis.yml`:

```yaml
env:
  global:
    - secure: "..."
```

### 3. Setup global environment variables

These scripts require a few environment variables in order to work:

- `SITE_URL`
- `GH_USER_NAME` (Full name of user associated with GitHub token used to push
  documentation)
- `GH_USER_EMAIL` (Email address associated with GitHub token used to push
  documentation)
- `GH_REF` The host and path, minus the scheme, to the git repository; e.g.
  `github.com/zendframework/zend-expressive.git`

As an example:

```yaml
env:
  global:
    - SITE_URL="https://zendframework.github.io/zend-expressive"
    - GH_USER_NAME="Matthew Weier O'Phinney"
    - GH_USER_EMAIL="matthew@<domain>.<tld>"
    - GH_REF="github.com/zendframework/zend-expressive.git"
    - secure: "..."
```

**Note:** all environment variables use the `KEY=VALUE` format, while the `secure` key (which is not an actual environment variable) uses the `KEY: VALUE` format. 

### 4. Choose a build for deployment

You should only deploy documentation from a single build job. To do that, we'll
add an environment variable to a single build; on success, that build will then
build and deploy the documentation. We usually use the latest PHP 5 version for
this.

When determining when to build, we only want to build when:

- on the master branch
- if it's not a pull request

Finally, MkDocs and its extensions are installed under the user, in
`$HOME/.local/bin`, so we want to add that to the path when we're on a build
that deploys.

Thefollowing shows an example of the changes necessary, under the 5.6 build:

```yaml
matrix:
  fast_finish: true
  include:
    - php: 5.6
      env:
        - DEPLOY_DOCS="$(if [[ $TRAVIS_BRANCH == 'master' && $TRAVIS_PULL_REQUEST == 'false' ]]; then echo -n 'true' ; else echo -n 'false' ; fi)"
        - PATH="$HOME/.local/bin:$PATH"
    - php: 7
    - php: hhvm
  allow_failures:
    - php: hhvm
```

We'll use the `DEPLOY_DOCS` environment variable to determine if we need to
download the them and build the documentation later.

### 5. Conditionally download the theme and build tools

If the build is successful, we will want to make sure the theme and build tools
are present. To do this, and ensure the assets downloaded can be cached, we need
to do this as the last step of our `script`, but *only* if the rest of the build
has succeeded. We can test that with the `$TRAVIS_TEST_RESULT` variable.

This repository has a script for installing the repository itself; we'll fetch
that and execute it.

The results look like this:

```yaml
script:
  - <do something ...>
  - if [[ $DEPLOY_DOCS == "true" && "$TRAVIS_TEST_RESULT" == "0" ]]; then travis_retry curl -sSL https://raw.githubusercontent.com/zendframework/zf-mkdoc-theme/master/theme-installer.sh | bash ; fi
```

This will run the code to install MkDocs and its extensions, and, if the
zf-mkdoc-theme is not yet installed, download the latest version and install it.

### 6. Build and deploy the documentation on success

Now we'll add the `after_success` script:

```yaml
after_success:
  - if [[ $DEPLOY_DOCS == "true" ]]; then ./zf-mkdoc-theme/deploy.sh ; fi
```

The above runs *only* if the build has been a success, and will not change the
success status.

### 7. Add caching

Chances are that the component you're using is already caching Composer
dependencies, so you'll likely already have a `cache` section to your
`.travis.yml`. Regardless, you'll need entries for `$HOME/.local` and
`zf-mkdoc-theme` to speed up your builds:

```yaml
cache:
  directories:
    - $HOME/.local
    - zf-mkdoc-theme
```

## A note on caching

If you followed the steps above, you're caching the MkDocs installation and
zf-mkdoc-theme installation between requests. What if it changes, and you want
to pick up those changes?

You have two ways to clear the cache.

First, you can go to the project's page on Travis-CI (e.g.,
https://travis-ci.org/zendframework/zend-expressive). Once there, click the
"Settings" dropdown on the right side of the screen, and select the "Caches"
item; this takes you to the page detailing all caches. Locate the one for the
"master" branch, and hit the little rubbish bin icon to remove the cache.

Second, you can do it through the Travis-CI API, which is most easily accessed
via the [`travis` CLI tool](https://github.com/travis-ci/travis.rb#readme). Once
you've installed it and setup your credentials, you can list the caches for the
master branch with:

```console
$ travis cache -b master
```

You can remove the caches for master using:

```console
$ travis cache -b master --delete
```

It will prompt you to make certain that's what you want to do, and then list all
caches it deleted when complete.

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
