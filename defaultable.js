// Defaultable APIs
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

module.exports = defaultable;
module.exports.merge = merge_obj;

function defaultable(_Mod, _Defs, _Definer) {
  var args = Array.prototype.slice.call(arguments);
  var m0dule = { 'exports': {} };

  if(args.length == 1)
    return defaultize(m0dule, {}, args[0]);
  else if(args.length == 2)
    return defaultize(m0dule, args[0], args[1]);
  else if(args.length > 2)
    return defaultize.apply(this, args);
  else
    throw new Error('Unknown arguments: ' + JSON.stringify(args));
}

function defaultize(real_module, initial_defs, definer) {
  if(!real_module || !real_module.exports)
    throw new Error('Need to provide the module, with .exports object');

  if(!initial_defs || Array.isArray(initial_defs) || typeof initial_defs != 'object')
    throw new Error('Defaults must be an object');

  var defaulter = make_defaulter({});
  real_module.exports = defaulter(initial_defs);
  return real_module.exports;

  function make_defaulter(old_defs) {
    return defaulter;

    function defaulter(new_defs) {
      var faux_exports = {};
      var faux_module = {"exports":faux_exports};
      var final_defs = merge_obj(new_defs || {}, old_defs);

      definer(faux_module, faux_exports, final_defs);

      var api = faux_module.exports;

      if('defaults' in api)
        throw new Error('defaultable modules may not export a label called "defaults"');
      else
        api.defaults = make_defaulter(final_defs);

      return api;
    }
  }
}

function is_obj(val) {
  return val && !Array.isArray(val) && (typeof val === 'object')
}

// Recursively merge higher-priority values into previously-set lower-priority ones.
function merge_obj(high, low) {
  if(!is_obj(high))
    throw new Error('Bad merge high-priority');
  if(!is_obj(low))
    throw new Error('Bad merge low-priority');

  var keys = [];
  function add_key(k) {
    if(!~ keys.indexOf(k))
      keys.push(k);
  }

  Object.keys(high).forEach(add_key);
  Object.keys(low).forEach(add_key);

  var result = {};
  keys.forEach(function(key) {
    var high_val = high[key];
    var low_val = low[key];

    if(is_obj(high_val) && is_obj(low_val))
      result[key] = merge_obj(high_val, low_val);
    else if (key in high)
      result[key] = high[key];
    else if (key in low)
      result[key] = low[key];
    else
      throw new Error('Unknown key type: ' + key);
  })

  return result;
}
