# ractive-adaptors-stapes

Use Stapes objects in your **[Ractive](http://www.ractivejs.org/)** components.  

## Installation

This adaptor is available through bower and npm:
  
```
bower install ractive-adaptors-stapes --save
```

```
npm install ractive-adaptors-stapes --save
```

Else, just download the repo and place it wherever you prefer...

## Loading the Adaptor

You may use the adapter via AMD, CommonJS or browser globals

### Browser globals usage

Include dependencies and the adaptor's browser build:

```
<script src="/bower_components/stapes/stapes.js"></script>
<script src="/bower_components/ractive/ractive.js"></script>
<script src="/bower_components/ractive-adaptors-stapes/dist/ractive-adaptors-stapes.browser.js"></script>
```

### CommonJS / browserify usage

Require dependencies and adaptor's module:

```
var Stapes = require('stapes');
var Ractive = require('ractive');

//no need to assign it to a local variable
require('ractive-adaptors-stapes');
```

See `demo/browserify` for a Browserify demo application and `browserify` task in `gulpfile.js` for barebone build setup.

### AMD Usage

Configure dependencies and the adaptor's browser build. Then require them in your modules:

```
require.config({
    paths: {
        // vendor
        stapes: '/bower_components/stapes/stapes',
        ractive: '/bower_components/ractive/ractive',
        'ractive-stapes': '/bower_components/ractive-adaptors-stapes/dist/ractive-adaptors-stapes.browser'
    }
});

require(['ractive', 'stapes', 'ractive-stapes'], function (Ractive, Stapes) {

    // ... code here

});
```


## Basic Usage

Whatever the environment in use, pass a Stapes object as `data` option and set  `adapt` to `['Stapes']`:

```
var User = Stapes.subclass({});

var user = new User();

user.set('name', 'John');

var view = new Ractive({
    el: document.getElementById('container'),
    template: '<h1>Hello {{user.name}}!</h1>',
    data: {
        user: user
    },
    adapt: ['Stapes']
});

//update the view
user.set('name', 'Jack');
```
 
## Stapes UI usage
 
If **[Stapes UI](https://github.com/dwightjack/stapes-ui)** is detected its `Stapes.Ui.Module` render and destroy methods 
get overloaded to automagically use Ractive as view engine:

```
var user = new Stapes.Ui.Module({
    $el: $('#container'),
    template: '<h1>Hello {{data.name}}!</h1>',
    data: {
        name: 'John'
    }
});

//render to the container
user.render();

//interact with ractive instance
user._view.toHTML(); // outputs: '<h1>Hello John!</h1>'

//destroy everything
user.destroy(); //also runs user._view.teardown();
```

## Release History

0.1.0 First release