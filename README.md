# html-element-stringify

HTMLElement stringifier.

## Installation

```
npm install html-element-stringify --save
```

## Example

``` js
var htmlElementStringify = require('html-element-stringify')

var div = document.createElement('div')
div.id = 'test'
div.innerHTML = 'TEST'

htmlElementStringify(div)
//=> '<div id="test">TEST</div>'
```

## License

MIT

