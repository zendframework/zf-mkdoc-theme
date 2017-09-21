<?php
/**
 * Replace \| to | in table cells.
 *
 * @license   http://opensource.org/licenses/BSD-3-Clause BSD-3-Clause
 * @copyright Copyright (c) 2017 Zend Technologies USA Inc. (http://www.zend.com)
 */

$docPath = isset($argv[1]) ? $argv[1] : 'doc';
$docPath = sprintf('%s/%s', getcwd(), $docPath);
$docPath = realpath($docPath);

$rdi = new RecursiveDirectoryIterator($docPath . '/html');
$rii = new RecursiveIteratorIterator($rdi, RecursiveIteratorIterator::SELF_FIRST);
$files = new RegexIterator($rii, '/\.html$/', RecursiveRegexIterator::GET_MATCH);

$process = function () use ($files) {
    $fileInfo = $files->getInnerIterator()->current();
    if (! $fileInfo->isFile()) {
        return true;
    }

    if ($fileInfo->getBasename('.html') === $fileInfo->getBasename()) {
        return true;
    }

    $file = $fileInfo->getRealPath();
    $html = file_get_contents($file);
    if (! preg_match('#<table[^>]*>.*?(<\/table>)#s', $html)) {
        return true;
    }
    $matches = [];
    if (preg_match_all('/<table[^>]*>.*?<\/table>/s', $html, $matches)) {
        foreach ($matches[0] as $origin) {
            $count = 0;
            $content = str_replace('\|', '|', $origin, $count);
            if ($count) {
                $html = str_replace($origin, $content, $html);
            }
        }
    }
    file_put_contents($file, $html);

    return true;
};

iterator_apply($files, $process);
