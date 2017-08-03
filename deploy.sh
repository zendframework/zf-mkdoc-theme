#!/usr/bin/env bash
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

function help() {
    echo "Usage:"
    echo "  ${0} [options]"
    echo "Options:"
    echo "  -h           Usage help; this message."
    echo "  -n <name>    GitHub username to commit under"
    echo "  -e <email>   Email address associated with GitHub username"
    echo "  -t <token>   Personal Access Token associated with GitHub username"
    echo "  -r <ref>     SHA1 of commit against which docs will be built"
    echo "  -u <url>     Deplyment URL of documentation (to ensure search works)"
}

while getopts hn:e:t:r:u: option;do
    case "${option}" in
        h) help && exit 0;;
        n) GH_USER_NAME=${OPTARG};;
        e) GH_USER_EMAIL=${OPTARG};;
        t) GH_TOKEN=${OPTARG};;
        r) GH_REF=${OPTARG};;
        u) SITE_URL=${OPTARG};;
    esac
done

if [[ -z ${GH_USER_NAME} || -z ${GH_USER_EMAIL} || -z ${GH_TOKEN} || -z ${GH_REF} ]]; then
    echo "Missing one or more required variables. Aborting." ;
    help;
    exit 1;
fi

DOC_DIR=doc
if [ -d "docs" ];then
    DOC_DIR=docs
fi

echo "Preparing to build and deploy documentation in ${DOC_DIR}"

SCRIPT_PATH="$(cd "$(dirname "$0")" && pwd -P)"

# Get curent commit revision
rev=$(git rev-parse --short HEAD)

# Initialize gh-pages checkout
mkdir -p ${DOC_DIR}/html
(
    cd ${DOC_DIR}/html
    git init
    git config user.name "${GH_USER_NAME}"
    git config user.email "${GH_USER_EMAIL}"
    git remote add upstream "https://${GH_TOKEN}@${GH_REF}"
    git fetch upstream
    git reset --hard upstream/gh-pages
)

# Build the documentation
${SCRIPT_PATH}/build.sh -u ${SITE_URL}

# Commit and push the documentation to gh-pages
(
    cd ${DOC_DIR}/html
    touch .
    git add -A .
    git commit -m "Rebuild pages at ${rev}"
    git push -q upstream HEAD:gh-pages
)

echo "Completed deploying documentation"
