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

  t.doesNotThrow(bad_defs({}), 'Empty defaults is no problem');

  t.end();
})
