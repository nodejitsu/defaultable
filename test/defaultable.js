// defaultable main API tests
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

function E(msg) { return new Error(msg) }
function noop() {}

test('Input validation', function(t) {
  var er = E('Defaults must be an object');

  function bad_defs(defs) {
    return make_bad_defs;
    function make_bad_defs() {
      return defaultable(defs, function(module, exports, DEFS) {});
    }
  }

  t.throws(bad_defs()     , er, 'Throws for undefined defs');
  t.throws(bad_defs(null) , er, 'Throws for null defs');
  t.throws(bad_defs([1,2]), er, 'Throws for array defs');
  t.throws(bad_defs(noop) , er, 'Throws for function defs');

  t.doesNotThrow(bad_defs({}), 'Empty defaults is no problem');

  t.end();
})

test('Flexible parameter order', function(t) {
  var api;
  function forward () { api = D({dir:'forward'}, my_mod) }
  function backward() { api = D(my_mod, {dir:'backward'}) }
  function my_mod(_mod, exp, defs) {
    exp.dir = function() { return defs.dir };
  }

  api = null;
  t.doesNotThrow(forward, 'Defaults first is ok');
  t.ok(api, 'Defaults first returns the API');
  t.equal('forward', api.dir(), 'Defaults first works');

  api = null;
  t.doesNotThrow(backward, 'Defaults second is ok');
  t.ok(api, 'Defaults second returns the API');
  t.equal('backward', api.dir(), 'Defaults second works');

  t.end();
})

test('Just using exports', function(t) {
  var api = defaultable({}, my_mod);
  function my_mod(module, exports) {
    function exports_func(input) { return input || true }
    exports.func = exports_func;
    exports.val = 23;
  }

  t.ok(api.func, 'Export functions via `exports`');
  t.ok(api.val, 'Export values via `exports`');

  t.isa(api.func, 'function', 'Export function via `exports`');
  t.equal(api.func.name, 'exports_func', 'Nothing wrapped in `exports`');
  t.equal(api.func.length, 1, 'Exported function in `exports` length');
  t.equal(api.func('hi'), 'hi', 'Export function via `exports` works');

  t.isa(api.val, 'number', 'Export values via `exports`');
  t.equal(api.val, 23, 'Export values work via `exports`');

  t.end();
})
