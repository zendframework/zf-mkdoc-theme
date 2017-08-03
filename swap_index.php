<?php
/**
 * Swaps the generated HTML for hand-crafted HTML in the landing page.
 *
 * @license   http://opensource.org/licenses/BSD-3-Clause BSD-3-Clause
 * @copyright Copyright (c) 2016 Zend Technologies USA Inc. (http://www.zend.com)
 */

$docPath = isset($argv[1]) ? $argv[1] : 'doc';
$docPath = sprintf('%s/%s', getcwd(), $docPath);
$docPath = realpath($docPath);

$target = file_get_contents($docPath . '/html/index.html');
$source = file_get_contents($docPath . '/book/index.html');

file_put_contents(
    $docPath . '/html/index.html',
    preg_replace('#\<\!-- content:begin --\>.*\<\!-- content:end --\>#s', $source, $target)
);
