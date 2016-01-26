#!/bin/bash
# Deploy documentation to gh-pages
#
# Environment variables that may be of use:
#
# - SITE_URL indicates the URL to the site, to ensure search works;
# - GH_USER_NAME indicates the GitHub author name to use;
# - GH_USER_EMAIL indicates the email address for that author;
# - GH_REF indicates the URI, without scheme or user-info, to the repository;
# - GH_TOKEN is the personal security token to use for commits.
#
# All of the above are exported via the project .travis.yml file (with
# GH_TOKEN being encrypted and present in the `secure` key). The user details
# need to match the token used for this to work.
#
# The script should be run from the project root.
#
# @license   http://opensource.org/licenses/BSD-3-Clause BSD-3-Clause
# @copyright Copyright (c) 2016 Zend Technologies USA Inc. (http://www.zend.com)

set -o errexit -o nounset

SCRIPT_PATH=$(dirname $(readlink -f $0))

# Get curent commit revision
rev=$(git rev-parse --short HEAD)

# Initialize gh-pages checkout
mkdir -p doc/html
(
    cd doc/html
    git init
    git remote add upstream "https://${GH_TOKEN}@${GH_REF}"
    git fetch upstream
    git reset upstream/gh-pages
)

# Build the documentation
${SCRIPT_PATH}/build.sh

# Commit and push the documentation to gh-pages
(
    cd doc/html
    touch .
    git add -A .
    git commit -m "Rebuild pages at ${rev}"
    git push upstream HEAD:gh-pages
)
