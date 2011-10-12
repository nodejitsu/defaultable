// defaultable require() wrapper tests
//
// Copyright 2011 Iris Couch
//
//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
//
//        http://www.apache.org/licenses/LICENSE-2.0
//
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.

var test = require('tap').test
  , defaultable = require('../defaultable')
  , D = defaultable
  ;

var m0dule = module;

test('require function', function(t) {
  var _require = require;
  defaultable({}, function(mod, exp, DEFS, require) {
    t.ok(require, 'Defaultable provides a require paramenter')
    t.type(require, 'function', 'provided require is a function')
    t.equal(require.length, _require.length, 'Proved require() has the correct arity')
    t.equal(require.name, _require.name, 'Provided require() is named correctly')
    t.isNot(require, _require, 'Provided require() is not the normal require()')
  })

  t.end();
})

test('requiring defaultable modules passes defaults to them', function(t) {
  function i_require_stuff(_mod, exps, _DEF, require) {
    exps.is = require('./mod/is_defaultable');
    exps.is_not = require('./mod/is_not_defaultable');
  }

  var mod;
  var defs = { 'should': 'first' };

  t.doesNotThrow(function() { mod = D(m0dule, defs, i_require_stuff) }, 'Defaultable and non-defaultable modules are usable')

  check_mod('first');
  mod = mod.defaults({should:'second'});
  check_mod('second');
  mod = mod.defaults({should:'third'});
  check_mod('third');

  t.end();

  function check_mod(should_val) {
    t.type(mod.is_not.get, 'function', 'Normal modules still export normally')
    t.equal(mod.is_not.get(), 'normal', 'Normal modules export normal stuff')
    t.notOk(mod.is_not.defaults, 'Normal modules do not have a defaults() function')
    t.equal(Object.keys(mod.is_not).length, 2, 'Normal modules export the same exact stuff')
    t.notOk(mod.is_not.req._defaultable, 'Normal modules require is not special')

    t.type(mod.is.get, 'function', 'Defaultable modules export normally')
    t.equal(mod.is.get('original'), 'value', 'Defaultable module still has its defaults')
    t.equal(mod.is.get('should'), should_val, 'Defaultable module inherits defaults with require() ' + should_val)
    t.type(mod.is.defaults, 'function', 'Defaultable modules still have defaults() functions')
    t.equal(Object.keys(mod.is).length, 2+1, 'Defaultable modules export the same stuff, plus defaults()')
    t.ok(mod.is.req._defaultable, 'Defaultable modules get the special require')
  }
})
