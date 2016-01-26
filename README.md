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

First, you'll need to setup a personal access token on GitHub. You can do this
from your `Settings` page; access the `Personal access tokens` screen, generate
a new token, and copy it once generated; this will be the only time GitHub will
show it to you! When you create it, give it only the `public_repo` scope.

Second, we'll encrypt that token for use with Travis. You'll need to install the
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

Third, we'll setup some additional environment variables, including the following:

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
    - SITE_URL: https://zendframework.github.io/zend-expressive
    - GH_USER_NAME: "Matthew Weier O'Phinney"
    - GH_USER_EMAIL: matthew@<domain>.<tld>
    - GH_REF: github.com/zendframework/zend-expressive.git
    - secure: "..."
```

Fourth, we'll add an environment variable to a single build; on success, that
build will then build and deploy the documentation. We usually use the latest
PHP 5 version for this:

```yaml
matrix:
  fast_finish: true
  include:
    - php: 5.5
      env:
        - EXECUTE_CS_CHECK=true
    - php: 5.6
      env:
        - EXECUTE_TEST_COVERALLS=true
        - DEPLOY_DOCS=true
    - php: 7
    - php: hhvm
  allow_failures:
    - php: hhv
```

Note the `DEPLOY_DOCS` declaration under PHP 5.6; we'll use this to determine
whether or not to deploy on success.

Fifth, we'll add an `after_success` section to our `.travis.yml`. In it, we'll
do the following:

- Install mkdocs
- Install pymdown-extensions (required to provide better fenced code block
  support)
- Fetch and install this theme
- Build and deploy the documentation.

It looks like this:

```yaml
after_success:
  - export DEPLOY=$(if [[ $DEPLOY_DOCS == 'true' && $TRAVIS_BRANCH == 'master' && $TRAVIS_PULL_REQUEST == 'false' ]]; then echo -n "true" ; else echo -n "false" ; fi)
  - export NEEDS_THEME=$([ -d zf-mkdoc-theme/theme ] ; result=$? ; if (( result == 0 )); then echo -n "false"; else echo -n "true" ; fi)
  - if [[ $DEPLOY == "true" ]]; then pip install --user mkdocs ; fi
  - if [[ $DEPLOY == "true" ]]; then pip install --user pymdown-extensions ; fi
  - if [[ $DEPLOY == "true" && $NEEDS_THEME == "true" ]]; then echo "Downloading zf-mkdoc-theme" ; $(if [[ ! -d zf-mkdoc-theme ]];then mkdir zf-mkdoc-theme ; fi) ; $(curl -s -L https://github.com/weierophinney/zf-mkdoc-theme/releases/latest | egrep -o '/weierophinney/zf-mkdoc-theme/archive/[0-9]*\.[0-9]*\.[0-9]*.tar.gz' | head -n1 | wget -O zf-mkdoc-theme.tgz --base=https://github.com/ -i -) ; $(cd zf-mkdoc-theme ; tar xzf ../zf-mkdoc-theme.tgz --strip-components=1) ; echo "Finished downloading and installing zf-mkdoc-theme" ; fi
  - export CAN_DEPLOY=$([ -f zf-mkdoc-theme/deploy.sh ] ; result=$? ; if (( result == 0 )); then echo -n "true"; else echo -n "false" ; fi)
  - if [[ $DEPLOY == "true" && $CAN_DEPLOY == "true" ]]; then echo "Preparing to build and deploy documentation" ; ./zf-mkdoc-theme/deploy.sh ; echo "Completed deploying documentation" ; else echo "Missing deployment script" ; fi
```

The above check that `DEPLOY_DOCS` is enabled, and then also limits builds to
non-pull requests, and to the master branch only. The sixth item downloads and
extracts this repository's latest release if the zf-mkdoc-theme directory is
empty, and the last item executes the deployment, but only if the deployment
script is available.

Sixth, so that you can actually *execute* mkdocs, you need to export a new
`PATH` environment; add the following in your `before_install` section (or
create that section if it doesn't exist):

```yaml
  - export PATH="$HOME/.local/bin:$PATH"
```

Finally, we recommend caching the `$HOME/.local` directory, which is where
mkdocs and pymdown-extensions are installed, and the `zf-mkdoc-theme` directory;
that way, on subsequent builds, these are already present and don't need to be
downloaded:

```yaml
cache:
  directories:
    - $HOME/.composer/cache
    - $HOME/.local
    - vendor
    - zf-mkdoc-theme
```
