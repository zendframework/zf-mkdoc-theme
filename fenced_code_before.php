<?php
/**
 * @license   http://opensource.org/licenses/BSD-3-Clause BSD-3-Clause
 * @copyright Copyright (c) 2019 Zend Technologies USA Inc. (https://www.zend.com)
 */

$docPath = isset($argv[1]) ? $argv[1] : 'doc';
$docPath = sprintf('%s/%s', getcwd(), $docPath);
$docPath = realpath($docPath);

$rdi = new RecursiveDirectoryIterator($docPath . '/book');
$rii = new RecursiveIteratorIterator($rdi, RecursiveIteratorIterator::SELF_FIRST);
$files = new RegexIterator($rii, '/\.md/', RecursiveRegexIterator::GET_MATCH);
$replacements = [0];

$process = static function () use ($files, &$replacements) {
    $fileInfo = $files->getInnerIterator()->current();
    if (! $fileInfo->isFile()) {
        return true;
    }

    if ($fileInfo->getBasename('.md') === $fileInfo->getBasename()) {
        return true;
    }

    $file = $fileInfo->getRealPath();
    $md = file_get_contents($file);

    if (preg_match_all('#> ```(?P<lang>[a-z]+)(?P<code>\n.*?\n)> ```#s', $md, $matches)) {
        foreach ($matches[0] as $i => $content) {
            $placeholder = uniqid('$$$$FENCED_CODE_BLOCK_', true);

            $md = str_replace($content, '> ' . $placeholder, $md);

            $code = htmlspecialchars(preg_replace('/^>( |$)/m', '', $matches['code'][$i]));

            $replacements['html']['<p>'.$placeholder.'</p>'] = '<p><pre class=codehilite><code class=language-' . $matches['lang'][$i] . '>'
                . $code . '</code></pre></p>';
            $replacements['md']['> ' . $placeholder] = $content;
        }
    }

    file_put_contents($file, $md);

    return true;
};

iterator_apply($files, $process);

file_put_contents(__DIR__ . '/fenced-code-replacements.php', "<?php\nreturn ".var_export($replacements, true) . ';');
