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
$replacements = [
    'html' => [
        '<p> <pre ' => '<pre ',
        '<p><pre ' => '<pre ',
        '<p> <pre>' => '<pre>',
        '<p><pre>' => '<pre>',
        '</pre></p>' => '</pre>',
    ],
];

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

    if (preg_match_all('#(?P<before>^>[^\n]*?$\n)?^>(?P<spaces>\s+)```(?P<lang>[a-z]+)(?P<code>\n.*?\n)^>\\2```(?P<after>\n^>[^\n]*?$)?#sm', $md, $matches)) {
        foreach ($matches[0] as $i => $content) {
            $placeholder = uniqid('$$$$FENCED_CODE_BLOCK_', true);

            $before = $matches['before'][$i];
            if (trim($before) !== '>' && strpos(trim($before), '>') === 0) {
                $before .= '>' . "\n";
            }

            $after = $matches['after'][$i];
            if (trim($after) !== '>' && strpos(trim($after), '>') === 0) {
                $after = "\n" . '>' . $after;
            }

            $md = str_replace($content, $before . '> ' . $placeholder . $after, $md);

            $code = htmlspecialchars(preg_replace('/^>(' . $matches['spaces'][$i] . '|$)/m', '', $matches['code'][$i]));

            $replacements['html']['<p>' . $placeholder . '</p>'] = '<pre class=codehilite><code class=language-' . $matches['lang'][$i] . '>'
                . $code . '</code></pre>';
            $replacements['md'][$before . '> ' . $placeholder . $after] = $content;
        }
    }

    file_put_contents($file, $md);

    return true;
};

iterator_apply($files, $process);

file_put_contents(__DIR__ . '/fenced-code-replacements.php', "<?php\nreturn " . var_export($replacements, true) . ';');
