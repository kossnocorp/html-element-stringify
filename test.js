var assert = require('power-assert')
var htmlElementStringify = require('.')

describe('htmlElementStringify', function() {
  context('for simple <div></div>', function() {
    it('stringifies tag name', function() {
      var div = document.createElement('div')
      var result = htmlElementStringify(div)
      assert(result == '<div></div>')
    })
  })

  context('for element with attributes', function() {
    it('stringifies attributes', function() {
      var div = document.createElement('div')
      div.id = 'test'
      div.dataset.test = true
      var result = htmlElementStringify(div)
      assert(result == '<div id="test" data-test="true"></div>')
    })
  })

  context('for element with inner text', function() {
    it('stringifies inner HTML', function() {
      var div = document.createElement('div')
      div.id = 'test'
      div.innerHTML = 'TEST'
      var result = htmlElementStringify(div)
      assert(result == '<div id="test">TEST</div>')
    })
  })

  context('when attr value has quotes inside', function() {
    it('stringifies inner HTML', function() {
      var div = document.createElement('div')
      div.id = "'\"quotes\"'"
      var result = htmlElementStringify(div)
      assert(result == '<div id="\'&quot;quotes&quot;\'"></div>')
    })
  })

  context('when attr has a boolean value', function() {
    it('simplifies boolean attrs', function() {
      var textarea = document.createElement('textarea')
      textarea.id = 'test'
      textarea.setAttribute('checked', true)
      textarea.setAttribute('disabled', false)
      var result = htmlElementStringify(textarea)
      assert(result == '<textarea id="test" checked disabled></textarea>')
    })
  })

  context('when tag can be self-closing', function() {
    it('simplifies self-closing tags', function() {
      var input = document.createElement('input')
      input.id = 'test'
      input.setAttribute('checked', true)
      input.setAttribute('disabled', false)
      var result = htmlElementStringify(input)
      assert(result == '<input id="test" checked disabled />')
    })
  })

  describe('options', function() {
    describe('attrBlacklist', function() {
      it('allows to exclude attributes', function() {
        var div = document.createElement('div')
        div.id = 'test'
        div.dataset.test = true
        div.dataset.lol = 'wut'
        var result = htmlElementStringify(div, {
          attrBlacklist: ['id', 'data-test']
        })
        assert(result == '<div data-lol="wut"></div>')
      })

      it('suppresses extra space', function() {
        var div = document.createElement('div')
        div.id = 'test'
        div.dataset.test = true
        var result = htmlElementStringify(div, {
          attrBlacklist: ['id', 'data-test']
        })
        assert(result == '<div></div>')
      })
    })

    describe('attrWhitelist', function() {
      it('allows to exclude attributes not listed in the whitelist', function() {
        var div = document.createElement('div')
        div.id = 'test'
        div.dataset.test = true
        div.dataset.lol = 'wut'
        var result = htmlElementStringify(div, {
          attrWhitelist: ['data-lol']
        })
        assert(result == '<div data-lol="wut"></div>')
      })

      it('suppresses extra space', function() {
        var div = document.createElement('div')
        div.id = 'test'
        div.dataset.test = true
        var result = htmlElementStringify(div, {attrWhitelist: []})
        assert(result == '<div></div>')
      })

      it('has higher priority than attrBlacklist', function() {
        var div = document.createElement('div')
        div.id = 'test'
        div.dataset.test = true
        div.dataset.lol = 'wut'
        var result = htmlElementStringify(div, {
          attrBlacklist: ['data-lol'],
          attrWhitelist: ['data-lol']
        })
        assert(result == '<div data-lol="wut"></div>')
      })
    })

    describe('truncateInnerHTML', function() {
      context('when innerHTML length is bigger than limit', function() {
        it('truncates innerHTML by specified number of symbols and adds ellipsis', function() {
          var div = document.createElement('div')
          div.id = 'test'
          div.innerHTML = 'html-element-stringify'
          var result = htmlElementStringify(div, {truncateInnerHTML: 5})
          assert(result == '<div id="test">html-…</div>')
        })
      })

      context('when innerHTML length is less than limit', function() {
        it('keeps innerHTML as is', function() {
          var div = document.createElement('div')
          div.id = 'test'
          div.innerHTML = 'html-element-stringify'
          var result = htmlElementStringify(div, {truncateInnerHTML: 99})
          assert(result == '<div id="test">html-element-stringify</div>')
        })
      })
    })

    describe('truncateAttrs', function() {
      it("truncates attr's values by specified number of symbols and adds ellipsis", function() {
        var div = document.createElement('div')
        div.id = 'qwerty'
        div.dataset.test = 'asd'
        div.dataset.lol = 'zxcvbb'
        var result = htmlElementStringify(div, {truncateAttrs: 3})
        assert(result == '<div id="qwe…" data-test="asd" data-lol="zxc…"></div>')
      })
    })
  })
})

