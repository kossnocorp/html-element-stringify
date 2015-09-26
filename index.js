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

  return '<' + tagName + stringifyAttrs(el.attributes, options) + '>'
    + truncateString(el.innerHTML, options.truncateInnerHTML)
    + '</' + tagName + '>'
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
    stringifiedAttrs.push(
      attr.name + '='
      + "'" + truncateString(attr.value, options.truncateAttrs) + "'"
    )
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

