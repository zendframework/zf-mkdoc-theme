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

# Update the mkdocs.yml
echo "Building documentation"
cp mkdocs.yml mkdocs.yml.orig
echo "site_url: ${SITE_URL}"
echo "markdown_extensions:" >> mkdocs.yml
echo "    - markdown.extensions.codehilite:" >> mkdocs.yml
echo "        use_pygments: False" >> mkdocs.yml
echo "    - pymdownx.superfences" >> mkdocs.yml
echo "theme_dir: zf-mkdoc-theme/theme" >> mkdocs.yml

mkdocs build --clean
mv mkdocs.yml.orig mkdocs.yml

# Make images responsive
echo "Making images responsive"
php ${SCRIPT_PATH}/img_responsive.php

# Replace landing page content
echo "Replacing landing page content"
php ${SCRIPT_PATH}/swap_index.php
