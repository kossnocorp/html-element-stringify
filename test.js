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
      assert(result == "<div id='test' data-test='true'></div>")
    })
  })

  context('for element with inner text', function() {
    it('stringifies inner HTML', function() {
      var div = document.createElement('div')
      div.id = 'test'
      div.innerHTML = 'TEST'
      var result = htmlElementStringify(div)
      assert(result == "<div id='test'>TEST</div>")
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
        assert(result == "<div data-lol='wut'></div>")
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
        assert(result == "<div data-lol='wut'></div>")
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
        assert(result == "<div data-lol='wut'></div>")
      })
    })
  })
})

