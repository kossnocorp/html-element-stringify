module.exports = function htmlElementStringify(el, options) {
  options = options || {}

  var tagName = el.tagName.toLowerCase()

  return '<' + tagName + stringifyAttrs(el.attributes, options) + '>'
    + el.innerHTML
    + '</' + tagName + '>'
}

function stringifyAttrs(attrs, options) {
  var stringifiedAttrs = []
  var attrBlacklist = options.attrBlacklist || []
  var attrWhitelist = options.attrWhitelist

  function pushStringifiedAttr(attr) {
    stringifiedAttrs.push(attr.name + '=' + "'" + attr.value + "'")
  }

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

