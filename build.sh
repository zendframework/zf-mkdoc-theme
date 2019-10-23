#!/usr/bin/env bash
# Build the documentation.
#
# This script does the following:
#
# - Updates the mkdocs.yml to add:
#   - site_url
#   - markdown extension directives
#   - theme directory
# - Builds the documentation.
# - Restores mkdocs.yml to its original state.
#
# The script should be copied to the `doc/` directory of your project,
# and run from the project root.
#
# @license   http://opensource.org/licenses/BSD-3-Clause BSD-3-Clause
# @copyright Copyright (c) 2016 Zend Technologies USA Inc. (http://www.zend.com)

SCRIPT_PATH="$(cd "$(dirname "$0")" && pwd -P)"

function help() {
    echo "Usage:"
    echo "  ${0} [options]"
    echo "Options:"
    echo "  -h           Usage help; this message."
    echo "  -u <url>     Deplyment URL of documentation (to ensure search works)"
}

while getopts hu: option;do
    case "${option}" in
        h) help && exit 0;;
        u) SITE_URL=${OPTARG};;
    esac
done

cp mkdocs.yml mkdocs.yml.orig

DOCS_DIR=$(php ${SCRIPT_PATH}/discover_doc_dir.php)
DOC_DIR=$(dirname ${DOCS_DIR})

# Update the mkdocs.yml
echo "Building documentation in ${DOC_DIR}"
${SCRIPT_PATH}/update_mkdocs_yml.py ${SITE_URL} ${DOCS_DIR}

# Preserve files if necessary (as mkdocs build --clean removes all files)
if [ -e .zf-mkdoc-theme-preserve ]; then
    mkdir .preserve
    for PRESERVE in $(cat .zf-mkdoc-theme-preserve); do
        cp ${DOC_DIR}/html/${PRESERVE} .preserve/
    done
fi

# Find all fenced code blocks
echo "Find all fenced code blocks"
php ${SCRIPT_PATH}/fenced_code_before.php ${DOC_DIR}

mkdocs build --clean

# Restore mkdocs.yml
mv mkdocs.yml.orig mkdocs.yml

# Restore files if necessary
if [ -e .zf-mkdoc-theme-preserve ]; then
    for PRESERVE in $(cat .zf-mkdoc-theme-preserve); do
        mv .preserve/${PRESERVE} ${DOC_DIR}/html/${PRESERVE}
    done
    rm -Rf ./preserve
fi

# Make images responsive
echo "Making images responsive"
php ${SCRIPT_PATH}/img_responsive.php ${DOC_DIR}

# Make tables responsive
echo "Making tables responsive"
php ${SCRIPT_PATH}/table_responsive.php ${DOC_DIR}

# Fix pipes in tables
echo "Fixing pipes in tables"
php ${SCRIPT_PATH}/table_fix_pipes.php ${DOC_DIR}

# Fix fenced code blocks
echo "Fixing fenced code blocks"
php ${SCRIPT_PATH}/fenced_code.php ${DOC_DIR}

# Replace landing page content
if [ -e .zf-mkdoc-theme-landing ]; then
    echo "Replacing landing page content"
    php ${SCRIPT_PATH}/swap_index.php ${DOC_DIR}
fi
