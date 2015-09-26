/**
 * Stringifies a HTML element.
 * @param {HTMLElement} el - an element to be stringified
 * @param {Object|undefined} options - a stringifier options object
 * @param {string[]} [options.attrBlacklist] - an attr name blacklist
 * @param {string[]} [options.attrWhitelist] - an attr name whitelist
 * @param {number} [options.truncateInnerHTML] - a maximum innerHTML length
 * @param {number} [options.truncateAttrs] - a maximum attr value length
 *
 * @returns {string} a stringified HTML element
 */
module.exports = function htmlElementStringify(el, options) {
  options = options || {}

  var tagName = el.tagName.toLowerCase()

  if (isSelfClosingTag(tagName)) {
    return '<' + tagName + stringifyAttrs(el.attributes, options) + ' />'
  } else {
    return '<' + tagName + stringifyAttrs(el.attributes, options) + '>'
      + truncateString(el.innerHTML, options.truncateInnerHTML)
      + '</' + tagName + '>'
  }
}

/**
 * @private
 *
 * Stringifies passed HTML element attrs.
 * @param {NamedNodeMap} attrs - HTML element attrs
 * @param {Object} options - a stringifier options object
 * @param {string[]} [options.attrBlacklist] - an attr name blacklist
 * @param {string[]} [options.attrWhitelist] - an attr name whitelist
 * @param {number} [options.truncateInnerHTML] - a maximum innerHTML length
 * @param {number} [options.truncateAttrs] - a maximum attr value length
 *
 * @returns {string} stringified HTML element attrs
 */
function stringifyAttrs(attrs, options) {
  var stringifiedAttrs = []
  var attrBlacklist = options.attrBlacklist || []
  var attrWhitelist = options.attrWhitelist

  /**
   * @private
   *
   * Stringifies and pushes passed attribute to the stringified attrs array.
   * @param {Attr} attr - element attr
   */
  function pushStringifiedAttr(attr) {
    if (isBooleanAttr(attr.name)) {
      stringifiedAttrs.push(attr.name)
    } else {
      stringifiedAttrs.push(
        attr.name
        + '='
        + '"'
        + truncateString(escapeAttrValue(attr.value), options.truncateAttrs)
        + '"'
      )
    }
  }

  /**
   * @private
   *
   * Checks passed attr to be included into white or black list and if it's
   * supposed to be stringified, pushes it to the stringified attrs array.
   * @param {Attr} attr - an element attr
   */
  function filterAndPushStringifiedAttr(attr) {
    if (attrWhitelist) {
      if (attrWhitelist.indexOf(attr.name) != -1) {
        pushStringifiedAttr(attr)
      }
    } else if (attrBlacklist.indexOf(attr.name) == -1) {
      pushStringifiedAttr(attr)
    }
  }

  for (var i = 0; i < attrs.length; i++) {
    filterAndPushStringifiedAttr(attrs[i])
  }

  return stringifiedAttrs.length ? ' ' + stringifiedAttrs.join(' ') : ''
}

/**
 * @private
 *
 * Truncates a passed string by specified number of symbols
 * and adds ellipsis to the end of the string.
 * @param {string} str - a string to be truncated
 * @param {number|undefined} length - a maximum string length
 *
 * @returns {string} a processed string
 */
function truncateString(str, length) {
  if (typeof length == 'number' && str.length > length) {
    return str.substr(0, length) + '…'
  } else {
    return str
  }
}

/**
 * @private
 *
 * Escapes an attr value.
 * @param {string} str - an attr value
 *
 * @returns {string} an escaped attr value
 */
function escapeAttrValue(str) {
  return str.replace(/"/g, '&quot;')
}

var booleanAttrPattern
  = /^(?:allowfullscreen|async|autofocus|autoplay|checked|compact|controls|declare|default|defaultchecked|defaultmuted|defaultselected|defer|disabled|draggable|enabled|formnovalidate|hidden|indeterminate|inert|ismap|itemscope|loop|multiple|muted|nohref|noresize|noshade|novalidate|nowrap|open|pauseonexit|readonly|required|reversed|scoped|seamless|selected|sortable|spellcheck|translate|truespeed|typemustmatch|visible)$/

/**
 * @private
 *
 * Returns true if passed attribute name is a boolean value.
 * @param {string} attrName - an attr name
 *
 * @returns {boolean} is a passed attr has a boolean value?
 */
function isBooleanAttr(attrName) {
  return booleanAttrPattern.test(attrName.toLowerCase())
}

var selfClosingTagPattern
  = /^(?:area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/

/**
 * @private
 *
 * Returns true if passed tag is self-closing
 * @param {string} tagName - a tag name
 *
 * @returns {boolean} is a passed tag self-closing?
 */
function isSelfClosingTag(tagName) {
  return selfClosingTagPattern.test(tagName.toLowerCase())
}

