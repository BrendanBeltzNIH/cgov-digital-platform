<?php

namespace Drupal\cgov_embed\Plugin\Filter;

use Drupal\filter\Plugin\FilterBase;
use Drupal\Component\Utility\Html;
use Drupal\filter\FilterProcessResult;

/**
 * Display cgov-pullquote elements as html elements in CKEditor.
 *
 * This does the work of replacing all <cgov-pullquote/>
 * elements in the document with actual HTML markup in the
 * rendered webpage.
 *
 * @Filter(
 *   id = "pullquote_filter",
 *   title = @Translation("Pullquote Filter"),
 *   description = @Translation("Render custom pullquote elements in CKEditor view."),
 *   type = Drupal\filter\Plugin\FilterInterface::TYPE_MARKUP_LANGUAGE,
 * )
 */
class PullquoteFilter extends FilterBase {

  /**
   * Generate HTML for pullquote.
   *
   * Https://github.com/Lullabot/ckeditor_embed_code
   * /blob/master/src/Plugin/Filter/EmbedCodeFilter.php
   * for reference.
   *
   * @param string $text
   *   Raw text of editor content.
   */
  public function insertHtml(string $text) {
    $dom = Html::load($text);
    $xpath = new \DOMXPath($dom);
    /** @var \DOMNodeList $pullquoteDOMNNodes */
    $pullquoteDOMNodes = $xpath->query('//cgov-pullquote');
    /** @var \DOMElement $node */
    foreach ($pullquoteDOMNodes as $node) {
      /** @var \DOMNamedNodeMap $attributes */
      $attributes = $node->attributes;
      $node->nodeValue = '';
      $div = $this->buildNodes($dom, $attributes);
      if ($div) {
        $node->appendChild($div);
      }
      else {
        $node->parentNode->removeChild($node);
      }
    }
    $serialized = Html::serialize($dom);
    return $serialized;
  }

  /**
   * Create pullquote markup elements.
   *
   * @param \DOMDocument $dom
   *   The text as an html document.
   * @param \DOMNamedNodeMap $attributes
   *   The attributes of the custom pullquote element.
   */
  public function buildNodes(DOMDocument $dom, DOMNamedNodeMap $attributes) {
    $settings = [];
    /** @var \DOMAttr $attribute */
    foreach ($attributes as $attribute) {
      $propType = $attribute->name;
      $value = $attribute->value;
      $settings[$propType] = $value;
    }
    $containerclass = $settings['containerclass'];
    $authortext = $settings['authortext'];
    $bodytext = $settings['bodytext'];
    // Template:
    // "<div class='$containerclass'>
    // <p class='pullquote-text'>$bodytext</p>
    // <p class='author'>$authortext</p><
    // /div>".
    /** @var \DOMElement $node */
    $container = $dom->createElement('div');
    $container->setAttribute('class', "pullquote $containerclass");
    /** @var \DOMElement $node */
    $body = $dom->createElement('p', $bodytext);
    $body->setAttribute('class', 'pullquote-text');
    $container->appendChild($body);
    /** @var \DOMElement $node */
    $author = $dom->createElement('p', $authortext);
    $author->setAttribute('class', 'author');
    $container->appendChild($author);
    return $container;
  }

  /**
   * {@inheritdoc}
   */
  public function process($text, $langcode) {
    $result = new FilterProcessResult($text);
    if (strpos($text, '<cgov-pullquote') !== FALSE) {
      $processedText = $this->insertHtml($text);
      $result->setProcessedText($processedText);
    }
    return $result;
  }

}
