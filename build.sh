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

# Build assets
${SCRIPT_PATH}/asset.sh

# Update the mkdocs.yml
echo "Building documentation"
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
        cp doc/html/${PRESERVE} .preserve/
    done
fi

mkdocs build --clean

# Restore mkdocs.yml
mv mkdocs.yml.orig mkdocs.yml

# Restore files if necessary
if [ -e .zf-mkdoc-theme-preserve ]; then
    for PRESERVE in $(cat .zf-mkdoc-theme-preserve); do
        mv .preserve/${PRESERVE} doc/html/${PRESERVE}
    done
    rm -Rf ./preserve
fi

# Make images responsive
echo "Making images responsive"
php ${SCRIPT_PATH}/img_responsive.php

# Make tables responsive
echo "Making tables responsive"
php ${SCRIPT_PATH}/table_responsive.php

# Replace landing page content
echo "Replacing landing page content"
php ${SCRIPT_PATH}/swap_index.php
