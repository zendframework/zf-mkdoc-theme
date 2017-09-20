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

DOC_DIR=doc
if [ -d "docs" ];then
    DOC_DIR=docs
fi

# Build assets
echo "Building assets"
${SCRIPT_PATH}/asset.sh

# Update the mkdocs.yml
echo "Building documentation in ${DOC_DIR}"
cp mkdocs.yml mkdocs.yml.orig
echo "site_url: ${SITE_URL}"
echo "extra:" >> mkdocs.yml
cat zf-mkdoc-theme/assets.yml >> mkdocs.yml
echo "markdown_extensions:" >> mkdocs.yml
echo "    - markdown.extensions.codehilite:" >> mkdocs.yml
echo "        use_pygments: False" >> mkdocs.yml
echo "    - pymdownx.superfences" >> mkdocs.yml
echo "theme_dir: zf-mkdoc-theme/theme" >> mkdocs.yml

# Preserve files if necessary (as mkdocs build --clean removes all files)
if [ -e .zf-mkdoc-theme-preserve ]; then
    mkdir .preserve
    for PRESERVE in $(cat .zf-mkdoc-theme-preserve); do
        cp ${DOC_DIR}/html/${PRESERVE} .preserve/
    done
fi

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

# Replace landing page content
echo "Replacing landing page content"
php ${SCRIPT_PATH}/swap_index.php ${DOC_DIR}
