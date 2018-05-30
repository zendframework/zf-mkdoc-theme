<?php
/**
 * Determine the documentation directory from the mkdocs.yml
 *
 * @license   http://opensource.org/licenses/BSD-3-Clause BSD-3-Clause
 * @copyright Copyright (c) 2018 Zend Technologies USA Inc. (http://www.zend.com)
 */

$projectPath = realpath(getcwd());
$mkdocsYmlPath = $projectPath . '/mkdocs.yml';
$yaml = file_get_contents($mkdocsYmlPath);

if (preg_match('#^docs_dir:\s*(?P<path>.*?)$#m', $yaml, $matches)) {
    echo trim($matches['path']);
    exit(0);
}

if (is_dir($projectPath . '/docs')) {
    echo 'docs/book';
    exit(0);
}

echo 'doc/book';
exit(0);
