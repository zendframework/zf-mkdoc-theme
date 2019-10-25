<?php
/**
 * @license   http://opensource.org/licenses/BSD-3-Clause BSD-3-Clause
 * @copyright Copyright (c) 2019 Zend Technologies USA Inc. (https://www.zend.com)
 */

$docPath = isset($argv[1]) ? $argv[1] : 'doc';
$docPath = sprintf('%s/%s', getcwd(), $docPath);
$docPath = realpath($docPath);

$fencedCodeReplacements = include __DIR__ . '/fenced-code-replacements.php';

$process = static function (RegexIterator $files, $type) use ($fencedCodeReplacements) {
    $fileInfo = $files->getInnerIterator()->current();
    if (! $fileInfo->isFile()) {
        return true;
    }

    if ($fileInfo->getBasename('.' . $type) === $fileInfo->getBasename()) {
        return true;
    }

    $file = $fileInfo->getRealPath();

    $content = file_get_contents($file);
    $content = strtr($content, $fencedCodeReplacements[$type]);
    file_put_contents($file, $content);

    return true;
};

// Process HTML files
if (isset($fencedCodeReplacements['html'])) {
    $rdi = new RecursiveDirectoryIterator($docPath . '/html');
    $rii = new RecursiveIteratorIterator($rdi, RecursiveIteratorIterator::SELF_FIRST);
    $files = new RegexIterator($rii, '/\.html$/', RecursiveRegexIterator::GET_MATCH);

    iterator_apply($files, $process, [$files, 'html']);
}

// Process md files
if (isset($fencedCodeReplacements['md'])) {
    $rdi = new RecursiveDirectoryIterator($docPath . '/book');
    $rii = new RecursiveIteratorIterator($rdi, RecursiveIteratorIterator::SELF_FIRST);
    $files = new RegexIterator($rii, '/\.md/', RecursiveRegexIterator::GET_MATCH);

    iterator_apply($files, $process, [$files, 'md']);
}

unlink(__DIR__ . '/fenced-code-replacements.php');
