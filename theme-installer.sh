#!/usr/bin/env bash
# Download and install requirements for documentation auto-deployment.
#
# This script does the following:
#
# - Installs mkdocs under the current user.
# - Installs pymdown-extensions under the current user.
# - If the zf-mkdoc-theme is not present under the current directory, downloads
#   and installs the latest tarball.
#
# In order to work, it needs the following environment variables defined:
#
# This script should be fetched from the master branch by any project opting
# into the documentation auto-deployment workflow.
#
# @license   http://opensource.org/licenses/BSD-3-Clause BSD-3-Clause
# @copyright Copyright (c) 2016 Zend Technologies USA Inc. (http://www.zend.com)

SCRIPT_PATH="$(pwd)"

# Install mkdocs and required extensions.
pip install --user mkdocs
pip install --user pymdown-extensions
pip install --user markdown-fenced-code-tabs

# Conditionally install zf-mkdoc-theme.
if [[ ! -d "zf-mkdoc-theme/theme" ]];then
    echo "Downloading zf-mkdoc-theme..." ;
    mkdir -p zf-mkdoc-theme ;
    curl -s -L https://github.com/zendframework/zf-mkdoc-theme/releases/latest | egrep -o '/zendframework/zf-mkdoc-theme/archive/[0-9]*\.[0-9]*\.[0-9]*\.tar\.gz' | head -n1 | wget -O zf-mkdoc-theme.tgz --base=https://github.com/ -i - ;
    (
        cd zf-mkdoc-theme ;
        tar xzf ../zf-mkdoc-theme.tgz --strip-components=1 ;
    );
    echo "Finished downloading and installing zf-mkdoc-theme" ;
fi

exit 0;
