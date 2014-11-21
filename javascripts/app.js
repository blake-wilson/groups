// copyright info listed below for combinations.
/**
* Copyright 2012 Akseli Palén.
* Created 2012-07-15.
* Licensed under the MIT license.
*
* <license>
* Permission is hereby granted, free of charge, to any person obtaining
* a copy of this software and associated documentation files
* (the "Software"), to deal in the Software without restriction,
* including without limitation the rights to use, copy, modify, merge,
* publish, distribute, sublicense, and/or sell copies of the Software,
* and to permit persons to whom the Software is furnished to do so,
* subject to the following conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
* MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
* BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
* ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
* CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
* </lisence>
*
* Implements functions to calculate combinations of elements in JS Arrays.
*
* Functions:
*   k_combinations(set, k) -- Return all k-sized combinations in a set
*   combinations(set) -- Return all combinations of the set
*/
var utils;
(function (utils) {
    var RGB = (function () {
        function RGB(red, green, blue) {
            this.red = red;
            this.green = green;
            this.blue = blue;
        }
        return RGB;
    })();
    utils.RGB = RGB;

    var OrderedPair = (function () {
        function OrderedPair(x, y) {
            this.x = x;
            this.y = y;
        }
        OrderedPair.prototype.toString = function () {
            return "(" + this.x.toString() + ", " + this.y.toString() + ")";
        };
        return OrderedPair;
    })();
    utils.OrderedPair = OrderedPair;

    var Value = (function () {
        function Value(value) {
            if (typeof value === "undefined") { value = []; }
            this.val = value;
            this.valNames = [];
        }
        Value.prototype.addProperty = function (name, value) {
            this.val[name] = value;
            this.valNames.push(name);
        };

        Value.prototype.getProperty = function (name) {
            if (this.val.hasOwnProperty(name)) {
                return this.val[name];
            }
            return null;
        };

        Value.prototype.getValue = function () {
            return this.val;
        };

        Value.prototype.toString = function () {
            var retstr = "";
            for (var i = 0; i < this.valNames.length; i++) {
                retstr += this.valNames[i] + ": " + this.val[this.valNames[i]] + ";";
            }
            return retstr;
        };
        return Value;
    })();
    utils.Value = Value;

    var OrderedTriple = (function () {
        function OrderedTriple(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        OrderedTriple.prototype.toString = function () {
            return "(" + this.x.toString() + ", " + this.y.toString() + ", " + this.z.toString() + ")";
        };

        OrderedTriple.prototype.toRGBHexString = function () {
            var hex_alphabet = "0123456789ABCDEF";
            var hex = "#";
            var char1, char2;

            //red comp
            char1 = this.x / 16;
            char2 = this.x % 16;
            hex += hex_alphabet.charAt(char1) + hex_alphabet.charAt(char2);

            //green comp
            char1 = this.y / 16;
            char2 = this.y % 16;
            hex += hex_alphabet.charAt(char1) + hex_alphabet.charAt(char2);

            //blue comp
            char1 = this.z / 16;
            char2 = this.z % 16;
            hex += hex_alphabet.charAt(char1) + hex_alphabet.charAt(char2);

            return hex;
        };

        OrderedTriple.prototype.toRGBACSSHexString = function (alpha) {
            return "rgba(" + this.x + "," + this.y + "," + this.z + "," + alpha + ")";
        };
        return OrderedTriple;
    })();
    utils.OrderedTriple = OrderedTriple;

    function isEqual(x, y) {
        if (x === y)
            return true;

        // if both x and y are null or undefined and exactly the same
        if (!(x instanceof Object) || !(y instanceof Object))
            return false;

        // if they are not strictly equal, they both need to be Objects
        if (x.constructor !== y.constructor)
            return false;

        for (var p in x) {
            if (!x.hasOwnProperty(p))
                continue;

            // other properties were tested using x.constructor === y.constructor
            if (!y.hasOwnProperty(p))
                return false;

            // allows to compare x[ p ] and y[ p ] when set to undefined
            if (x[p] === y[p])
                continue;

            // if they have the same strict value or identity then they are equal
            if (typeof (x[p]) !== "object")
                return false;

            // Numbers, Strings, Functions, Booleans must be strictly equal
            if (!this.isEqual(x[p], y[p]))
                return false;
            // Objects and Arrays must be tested recursively
        }

        for (p in y) {
            if (y.hasOwnProperty(p) && !x.hasOwnProperty(p))
                return false;
            // allows x[ p ] to be set to undefined
        }
        return true;
    }
    utils.isEqual = isEqual;

    var Collection = (function () {
        function Collection() {
            this.items = [];
        }
        Collection.prototype.size = function () {
            return this.items.length;
        };

        Collection.prototype.add = function (value) {
            this.items.push(value);
        };

        Collection.prototype.remove = function (index) {
            this.items.splice(index, 1);
        };

        Collection.prototype.get = function (index) {
            return this.items[index];
        };

        Collection.prototype.slice = function (start, end) {
            if (typeof end === "undefined") { end = this.items.length; }
            var temp = new Collection();
            temp.items = this.items.slice(start, end);
            return temp;
        };

        Collection.prototype.concat = function (other) {
            var temp = new Collection();

            for (var i = 0; i < this.items.length; i++) {
                temp.add(this.items[i]);
            }
            for (var i = 0; i < other.size(); i++) {
                temp.add(other.get(i));
            }
            return temp;
        };

        Collection.prototype.equals = function (other) {
            if (this.size() != other.size())
                return false;

            for (var i = 0; i < this.size(); i++) {
                if (!this.contains(other.get(i)))
                    return false;
            }
            return true;
        };

        Collection.prototype.contains = function (item) {
            for (var i = 0; i < this.size(); i++) {
                if (this.get(i).equals(item))
                    return true;
            }
            return false;
        };

        Collection.prototype.shift = function () {
            return this.items.shift();
        };

        Collection.prototype.unshift = function (item) {
            return this.items.unshift(item);
        };
        return Collection;
    })();
    utils.Collection = Collection;

    var Combinations = (function () {
        function Combinations(set, setSize) {
            this.collection = set;
            this.setSize = setSize;
        }
        Combinations.prototype.k_combinations = function (set, k) {
            var combs, tailcombs;
            var head;

            var i, j;

            if (k > set.size() || k <= 0) {
                return new Collection();
            }

            if (k == set.size()) {
                var collection = new Collection();
                collection.add(set);
                return collection;
            }

            if (k == 1) {
                combs = new Collection();

                for (i = 0; i < set.size(); i++) {
                    var tmp = new Collection();
                    tmp.add(set.get(i));
                    combs.add(tmp);
                }
                return combs;
            }

            combs = new Collection();
            for (i = 0; i < set.size() - k + 1; i++) {
                head = set.slice(i, i + 1);
                tailcombs = this.k_combinations(set.slice(i + 1), k - 1);
                for (j = 0; j < tailcombs.size(); j++) {
                    combs.add(head.concat(tailcombs.get(j)));
                }
            }
            return combs;
        };
        return Combinations;
    })();
    utils.Combinations = Combinations;

    var IdGen = (function () {
        function IdGen() {
        }
        IdGen.getId = function () {
            return IdGen.id++;
        };
        IdGen.id = 0;
        return IdGen;
    })();
    utils.IdGen = IdGen;
})(utils || (utils = {}));
/// <reference path="utils.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var groups;
(function (groups) {
    var Collection = utils.Collection;
    var IdGen = utils.IdGen;

    var Elements = (function (_super) {
        __extends(Elements, _super);
        function Elements() {
            _super.apply(this, arguments);
        }
        Elements.prototype.equals = function (other) {
            var o = other;
            if (this.size() != o.size()) {
                return false;
            }
            for (var i = 0; i < this.size(); i++) {
                if (!o.contains(this.get(i)))
                    return false;
            }
        };
        return Elements;
    })(Collection);
    groups.Elements = Elements;

    var ConcreteElement = (function () {
        function ConcreteElement(value) {
            this._value = value;
            this.id = IdGen.getId();
        }
        ConcreteElement.prototype.getValue = function () {
            return this._value;
        };

        ConcreteElement.prototype.toString = function () {
            return this._value.toString();
        };

        ConcreteElement.prototype.getId = function () {
            return this.id;
        };

        ConcreteElement.prototype.equals = function (other) {
            return utils.isEqual(this._value, other.getValue());
        };
        return ConcreteElement;
    })();
    groups.ConcreteElement = ConcreteElement;

    var VisualElement = (function (_super) {
        __extends(VisualElement, _super);
        function VisualElement(value) {
            _super.call(this, value);
        }
        VisualElement.prototype.getValue = function () {
            return _super.prototype.getValue.call(this);
        };

        VisualElement.prototype.equals = function (other) {
            return utils.isEqual(_super.prototype.getValue.call(this), other);
        };

        VisualElement.prototype.getId = function () {
            return _super.prototype.getId.call(this);
        };

        VisualElement.prototype.toString = function () {
            return _super.prototype.getValue.call(this).toString();
        };
        return VisualElement;
    })(ConcreteElement);
    groups.VisualElement = VisualElement;

    var Group = (function () {
        function Group(identity, operation, elements) {
            this._identity = identity;
            this._elements = elements;
            this.operate = operation;

            this.inverseMap = this.findInverses(elements, operation, identity);

            // Find group properties
            this.init();
        }
        Group.prototype.operate = function (left, right) {
            // implementation provided by user.
            return null;
        };

        // collection object implementation
        Group.prototype.add = function (e) {
            if (!this.contains(e)) {
                this._generatingSet.add(e);
                this.regenerate();
            }
        };

        Object.defineProperty(Group.prototype, "isCyclic", {
            get: function () {
                return this._isCyclic;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Group.prototype, "isAbelian", {
            get: function () {
                return this._isAbelian;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Group.prototype, "order", {
            get: function () {
                return this._order;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Group.prototype, "identity", {
            get: function () {
                return this._identity;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Group.prototype, "elements", {
            get: function () {
                return this._elements;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Group.prototype, "inverseMap", {
            get: function () {
                return this._inverseMap;
            },
            set: function (map) {
                this._inverseMap = map;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Group.prototype, "elementVisual", {
            set: function (elementVisual) {
                this._elementVisual = elementVisual;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Group.prototype, "elementComparer", {
            set: function (comparer) {
                this._elementCompare = comparer;
            },
            enumerable: true,
            configurable: true
        });

        Group.prototype.init = function () {
            this._isAbelian = this.checkAbelian();
            this._isCyclic = this.checkCyclic();
            this._order = this.elements.size();
        };

        // Order of an element within the group
        Group.prototype.eOrder = function (element) {
            var order;
            var current = new ConcreteElement(element.getValue());
            for (order = 1; !(current.equals(this.identity)) && order < this.elements.size(); order++) {
                current = this.operate(current, element);
            }
            return order;
        };

        Group.prototype.checkAbelian = function () {
            for (var i = 0; i < this.elements.size(); i++) {
                for (var j = 0; j < this.elements.size(); j++) {
                    if (!this.operate(this.elements.get(i), this.elements.get(j)).equals(this.operate(this.elements.get(j), this.elements.get(i))))
                        return false;
                }
            }
            return true;
        };

        Group.prototype.checkCyclic = function () {
            for (var i = 0; i < this.elements.size(); i++) {
                if (this.eOrder(this.elements.get(i)) == this.elements.size())
                    return true;
            }
            return false;
        };

        Group.generateGroup = function (operation, generatingSet) {
            var temp;
            var newElts = new Elements();

            // if generation does not change the size of the generating set, return.
            var genSetSize = generatingSet.size();

            for (var i = 0; i < generatingSet.size(); i++) {
                for (var j = 0; j < generatingSet.size(); j++) {
                    temp = operation(generatingSet.get(i), generatingSet.get(j));
                    if (!generatingSet.contains(temp) && !newElts.contains(temp))
                        newElts.add(temp);
                }
            }

            for (var i = 0; i < newElts.size(); i++) {
                generatingSet.add(newElts.get(i));
            }

            if (generatingSet.size() != genSetSize) {
                generatingSet = this.generateGroup(operation, generatingSet);
            }
            return generatingSet;
        };

        // Return null if the group cannot be generated.
        Group.createGroup = function (generatingSet, operation) {
            var groupElements = new Elements();
            var identity = null;
            var temp;
            var g;

            for (var i = 0; i < generatingSet.size(); i++) {
                if (!groupElements.contains(generatingSet.get(i)))
                    groupElements.add(generatingSet.get(i));
            }

            this.generateGroup(operation, groupElements);

            for (var i = 0; i < groupElements.size(); i++) {
                for (var j = 0; j < groupElements.size(); j++) {
                    if (!utils.isEqual(operation(groupElements.get(i), groupElements.get(j)).getValue(), groupElements.get(j).getValue()) || !utils.isEqual(operation(groupElements.get(j), groupElements.get(i)).getValue(), groupElements.get(j).getValue()))
                        break;
                    if (j == groupElements.size() - 1)
                        if (!identity) {
                            identity = groupElements.get(i);

                            // put identity at the front of the elements for easier table display.
                            groupElements.remove(i);
                            groupElements.unshift(identity);
                        } else
                            return null;
                }
            }

            if (identity == null) {
                return null;
            }

            g = new Group(identity, operation, groupElements);

            g.inverseMap = g.findInverses(g.elements, g.operate, g.identity);

            return g;
        };

        // If elements are added or removed, group must be regenerated from the generating set.
        Group.prototype.regenerate = function () {
        };

        Group.prototype.getInverse = function (e) {
            return this._inverseMap[e.getId()];
        };

        // if element is invertible, add it to an inverses map.  If any element is non-invertible, return null. If all elements are invertible, return the inverse map.
        Group.prototype.findInverses = function (groupElements, operation, identity) {
            var inverseMap = {};
            var result;

            for (var i = 0; i < groupElements.size(); i++) {
                for (var j = 0; j < groupElements.size(); j++) {
                    result = operation(groupElements.get(i), groupElements.get(j));
                    if (utils.isEqual(result.getValue(), identity.getValue())) {
                        // Add inverse to the inverse map.
                        inverseMap[groupElements.get(i).getId()] = groupElements.get(j);
                        break;
                    }
                    if ((i == groupElements.size() - 1) && (j == groupElements.size() - 1))
                        return null;
                }
            }

            // every element was invertible - valid map should've been produced.
            return inverseMap;
        };

        // Group events
        Group.prototype.onChanged = function () {
        };

        Group.prototype.contains = function (e) {
            return this.elements.contains(e);
        };

        Group.prototype.equals = function (other) {
            if (this.operate != other.operate)
                return false;
            return this.elements.equals(other.elements);
        };

        Group.prototype.toString = function () {
            var retStr = "{";
            for (var i = 0; i < this.elements.size(); i++) {
                retStr += this.elements.get(i).getValue();
                if (i < this.elements.size() - 1)
                    retStr += ", ";
            }
            retStr += "}";
            return retStr;
        };
        return Group;
    })();
    groups.Group = Group;

    var VisualGroup = (function (_super) {
        __extends(VisualGroup, _super);
        function VisualGroup(identity, operation, elts) {
            _super.call(this, identity, operation, elts);
        }
        VisualGroup.prototype.operate = function (left, right) {
            // implementation provided by user.
            return null;
        };

        VisualGroup.prototype.eltRepr = function (e) {
            var htmlElement = this.visualize(e);
            return htmlElement;
        };

        VisualGroup.createGroup = function (generatingSet, operation) {
            var g = Group.createGroup(generatingSet, operation);

            return new VisualGroup(g.identity, g.operate, g.elements);
        };

        VisualGroup.prototype.visualize = function (e) {
            return null;
        };

        VisualGroup.prototype.repr = function () {
            // div to store the contents of the HTML representations of each element. - no formatting applied.
            var aggregator = document.createElement("div");

            for (var i = 0; i < this.elements.size(); i++) {
                // use element visualizing function if one was specified.
                aggregator.appendChild(this.visualize((this.elements.get(i))));
            }

            return aggregator;
        };
        return VisualGroup;
    })(Group);
    groups.VisualGroup = VisualGroup;
})(groups || (groups = {}));
/// <reference path="Signal.ts" />
/*
*	@desc   	An object that represents a binding between a Signal and a listener function.
*               Released under the MIT license
*				http://millermedeiros.github.com/js-signals/
*
*	@version	1.0 - 7th March 2013
*
*	@author 	Richard Davey, TypeScript conversion
*	@author		Miller Medeiros, JS Signals
*	@author		Robert Penner, AS Signals
*
*	@url		http://www.kiwijs.org
*
*/
var SignalBinding = (function () {
    /**
    * Object that represents a binding between a Signal and a listener function.
    * <br />- <strong>This is an internal constructor and shouldn't be called by regular users.</strong>
    * <br />- inspired by Joa Ebert AS3 SignalBinding and Robert Penner's Slot classes.
    * @author Miller Medeiros
    * @constructor
    * @internal
    * @name SignalBinding
    * @param {Signal} signal Reference to Signal object that listener is currently bound to.
    * @param {Function} listener Handler function bound to the signal.
    * @param {boolean} isOnce If binding should be executed just once.
    * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
    * @param {Number} [priority] The priority level of the event listener. (default = 0).
    */
    function SignalBinding(signal, listener, isOnce, listenerContext, priority) {
        /**
        * If binding is active and should be executed.
        * @type boolean
        */
        this.active = true;
        /**
        * Default parameters passed to listener during `Signal.dispatch` and `SignalBinding.execute`. (curried parameters)
        * @type Array|null
        */
        this.params = null;
        this._listener = listener;
        this._isOnce = isOnce;
        this.context = listenerContext;
        this._signal = signal;
        this.priority = priority || 0;
    }
    /**
    * Call listener passing arbitrary parameters.
    * <p>If binding was added using `Signal.addOnce()` it will be automatically removed from signal dispatch queue, this method is used internally for the signal dispatch.</p>
    * @param {Array} [paramsArr] Array of parameters that should be passed to the listener
    * @return {*} Value returned by the listener.
    */
    SignalBinding.prototype.execute = function (paramsArr) {
        var handlerReturn;
        var params;

        if (this.active && !!this._listener) {
            params = this.params ? this.params.concat(paramsArr) : paramsArr;

            handlerReturn = this._listener.apply(this.context, params);

            if (this._isOnce) {
                this.detach();
            }
        }

        return handlerReturn;
    };

    /**
    * Detach binding from signal.
    * - alias to: mySignal.remove(myBinding.getListener());
    * @return {Function|null} Handler function bound to the signal or `null` if binding was previously detached.
    */
    SignalBinding.prototype.detach = function () {
        return this.isBound() ? this._signal.remove(this._listener, this.context) : null;
    };

    /**
    * @return {Boolean} `true` if binding is still bound to the signal and have a listener.
    */
    SignalBinding.prototype.isBound = function () {
        return (!!this._signal && !!this._listener);
    };

    /**
    * @return {boolean} If SignalBinding will only be executed once.
    */
    SignalBinding.prototype.isOnce = function () {
        return this._isOnce;
    };

    /**
    * @return {Function} Handler function bound to the signal.
    */
    SignalBinding.prototype.getListener = function () {
        return this._listener;
    };

    /**
    * @return {Signal} Signal that listener is currently bound to.
    */
    SignalBinding.prototype.getSignal = function () {
        return this._signal;
    };

    /**
    * Delete instance properties
    * @private
    */
    SignalBinding.prototype._destroy = function () {
        delete this._signal;
        delete this._listener;
        delete this.context;
    };

    /**
    * @return {string} String representation of the object.
    */
    SignalBinding.prototype.toString = function () {
        return '[SignalBinding isOnce:' + this._isOnce + ', isBound:' + this.isBound() + ', active:' + this.active + ']';
    };
    return SignalBinding;
})();
/// <reference path="SignalBinding.ts" />
/**
*	@desc       A TypeScript conversion of JS Signals by Miller Medeiros
*               Released under the MIT license
*				http://millermedeiros.github.com/js-signals/
*
*	@version	1.0 - 7th March 2013
*
*	@author 	Richard Davey, TypeScript conversion
*	@author		Miller Medeiros, JS Signals
*	@author		Robert Penner, AS Signals
*
*	@url		http://www.photonstorm.com
*/
/**
* Custom event broadcaster
* <br />- inspired by Robert Penner's AS3 Signals.
* @name Signal
* @author Miller Medeiros
* @constructor
*/
var Signal = (function () {
    function Signal() {
        /**
        * @property _bindings
        * @type Array
        * @private
        */
        this._bindings = [];
        /**
        * @property _prevParams
        * @type Any
        * @private
        */
        this._prevParams = null;
        /**
        * If Signal should keep record of previously dispatched parameters and
        * automatically execute listener during `add()`/`addOnce()` if Signal was
        * already dispatched before.
        * @type boolean
        */
        this.memorize = false;
        /**
        * @type boolean
        * @private
        */
        this._shouldPropagate = true;
        /**
        * If Signal is active and should broadcast events.
        * <p><strong>IMPORTANT:</strong> Setting this property during a dispatch will only affect the next dispatch, if you want to stop the propagation of a signal use `halt()` instead.</p>
        * @type boolean
        */
        this.active = true;
    }
    /**
    * @method validateListener
    * @param {Any} listener
    * @param {Any} fnName
    */
    Signal.prototype.validateListener = function (listener, fnName) {
        if (typeof listener !== 'function') {
            throw new Error('listener is a required param of {fn}() and should be a Function.'.replace('{fn}', fnName));
        }
    };

    /**
    * @param {Function} listener
    * @param {boolean} isOnce
    * @param {Object} [listenerContext]
    * @param {Number} [priority]
    * @return {SignalBinding}
    * @private
    */
    Signal.prototype._registerListener = function (listener, isOnce, listenerContext, priority) {
        var prevIndex = this._indexOfListener(listener, listenerContext);
        var binding;

        if (prevIndex !== -1) {
            binding = this._bindings[prevIndex];

            if (binding.isOnce() !== isOnce) {
                throw new Error('You cannot add' + (isOnce ? '' : 'Once') + '() then add' + (!isOnce ? '' : 'Once') + '() the same listener without removing the relationship first.');
            }
        } else {
            binding = new SignalBinding(this, listener, isOnce, listenerContext, priority);

            this._addBinding(binding);
        }

        if (this.memorize && this._prevParams) {
            binding.execute(this._prevParams);
        }

        return binding;
    };

    /**
    * @method _addBinding
    * @param {SignalBinding} binding
    * @private
    */
    Signal.prototype._addBinding = function (binding) {
        //simplified insertion sort
        var n = this._bindings.length;

        do {
            --n;
        } while(this._bindings[n] && binding.priority <= this._bindings[n].priority);

        this._bindings.splice(n + 1, 0, binding);
    };

    /**
    * @method _indexOfListener
    * @param {Function} listener
    * @return {number}
    * @private
    */
    Signal.prototype._indexOfListener = function (listener, context) {
        var n = this._bindings.length;
        var cur;

        while (n--) {
            cur = this._bindings[n];

            if (cur.getListener() === listener && cur.context === context) {
                return n;
            }
        }

        return -1;
    };

    /**
    * Check if listener was attached to Signal.
    * @param {Function} listener
    * @param {Object} [context]
    * @return {boolean} if Signal has the specified listener.
    */
    Signal.prototype.has = function (listener, context) {
        return this._indexOfListener(listener, context) !== -1;
    };

    /**
    * Add a listener to the signal.
    * @param {Function} listener Signal handler function.
    * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
    * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
    * @return {SignalBinding} An Object representing the binding between the Signal and listener.
    */
    Signal.prototype.add = function (listener, listenerContext, priority) {
        this.validateListener(listener, 'add');

        return this._registerListener(listener, false, listenerContext, priority);
    };

    /**
    * Add listener to the signal that should be removed after first execution (will be executed only once).
    * @param {Function} listener Signal handler function.
    * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
    * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
    * @return {SignalBinding} An Object representing the binding between the Signal and listener.
    */
    Signal.prototype.addOnce = function (listener, listenerContext, priority) {
        this.validateListener(listener, 'addOnce');

        return this._registerListener(listener, true, listenerContext, priority);
    };

    /**
    * Remove a single listener from the dispatch queue.
    * @param {Function} listener Handler function that should be removed.
    * @param {Object} [context] Execution context (since you can add the same handler multiple times if executing in a different context).
    * @return {Function} Listener handler function.
    */
    Signal.prototype.remove = function (listener, context) {
        this.validateListener(listener, 'remove');

        var i = this._indexOfListener(listener, context);

        if (i !== -1) {
            this._bindings[i]._destroy(); //no reason to a SignalBinding exist if it isn't attached to a signal
            this._bindings.splice(i, 1);
        }

        return listener;
    };

    /**
    * Remove all listeners from the Signal.
    */
    Signal.prototype.removeAll = function () {
        var n = this._bindings.length;

        while (n--) {
            this._bindings[n]._destroy();
        }

        this._bindings.length = 0;
    };

    /**
    * @return {number} Number of listeners attached to the Signal.
    */
    Signal.prototype.getNumListeners = function () {
        return this._bindings.length;
    };

    /**
    * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
    * <p><strong>IMPORTANT:</strong> should be called only during signal dispatch, calling it before/after dispatch won't affect signal broadcast.</p>
    * @see Signal.prototype.disable
    */
    Signal.prototype.halt = function () {
        this._shouldPropagate = false;
    };

    /**
    * Dispatch/Broadcast Signal to all listeners added to the queue.
    * @param {...*} [params] Parameters that should be passed to each handler.
    */
    Signal.prototype.dispatch = function () {
        var paramsArr = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            paramsArr[_i] = arguments[_i + 0];
        }
        if (!this.active) {
            return;
        }

        var n = this._bindings.length;
        var bindings;

        if (this.memorize) {
            this._prevParams = paramsArr;
        }

        if (!n) {
            //should come after memorize
            return;
        }

        bindings = this._bindings.slice(0); //clone array in case add/remove items during dispatch

        this._shouldPropagate = true; //in case `halt` was called before dispatch or during the previous dispatch.

        do {
            n--;
        } while(bindings[n] && this._shouldPropagate && bindings[n].execute(paramsArr) !== false);
    };

    /**
    * Forget memorized arguments.
    * @see Signal.memorize
    */
    Signal.prototype.forget = function () {
        this._prevParams = null;
    };

    /**
    * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
    * <p><strong>IMPORTANT:</strong> calling any method on the signal instance after calling dispose will throw errors.</p>
    */
    Signal.prototype.dispose = function () {
        this.removeAll();

        delete this._bindings;
        delete this._prevParams;
    };

    /**
    * @return {string} String representation of the object.
    */
    Signal.prototype.toString = function () {
        return '[Signal active:' + this.active + ' numListeners:' + this.getNumListeners() + ']';
    };
    Signal.VERSION = '1.0.0';
    return Signal;
})();
/// <reference path="group.ts"/>
/// <reference path="Signal.ts" />
/// <reference path="utils.ts" />
/// <reference path="app.ts" />
var groups;
(function (groups) {
    // Graphical way to represent Cayley Table in HTML
    var Collection = utils.Collection;

    var CayleyTable = (function () {
        function CayleyTable(g) {
            this.nRows = 0;
            this.showVisual = true;
            this.g = g;
            this.table = document.getElementById("cayley_table");
            this.elementsResults = new Collection();
            this.showVisual = group_app.Background.showGraphicalCheckbox.checked;
            this.updateTable(g.elements);

            //bind event listeners
            this.refreshSignal = new Signal();
            this.opWindow = document.getElementById("op_window");
            this.addListeners();
        }
        CayleyTable.prototype.addListeners = function () {
            var _this = this;
            this.refreshSignal.add(function () {
                _this.toggleVisualization();
            });

            // todo: move checkbox state to settings.
            group_app.Background.showGraphicalCheckbox.addEventListener("click", function () {
                _this.refreshSignal.dispatch();
            });
        };

        CayleyTable.prototype.delete = function () {
            this.refreshSignal.removeAll();
        };

        CayleyTable.prototype.toggleVisualization = function () {
            this.showVisual = document.getElementById("graphical_table").checked;
            this.displayGroup();
        };

        CayleyTable.prototype.updateOpWindow = function (operand1, operand2, res) {
            this.opWindow.innerHTML = "";
            var cell = this.createCayleyCell();

            cell.appendChild(this.drawTableCell(operand1));
            this.opWindow.appendChild(cell);
            cell = this.createCayleyCell();

            cell.appendChild(document.createTextNode(" X "));
            this.opWindow.appendChild(cell);
            cell = this.createCayleyCell();

            cell.appendChild(this.drawTableCell(operand2));
            this.opWindow.appendChild(cell);
            cell = this.createCayleyCell();

            cell.appendChild(document.createTextNode(" = "));
            this.opWindow.appendChild(cell);
            cell = this.createCayleyCell();

            cell.appendChild(this.drawTableCell(res));
            this.opWindow.appendChild(cell);
        };

        CayleyTable.prototype.createCayleyCell = function () {
            var cell = document.createElement("td");
            cell.className = "cayleycell";
            return cell;
        };

        CayleyTable.prototype.displayGroup = function () {
            var tableCell;

            for (var i = 0; i < this.nRows; i++) {
                for (var j = 0; j < this.nRows; j++) {
                    tableCell = this.table.childNodes[i].childNodes[j];

                    //clear tablecell.
                    tableCell.innerHTML = '';

                    //todo: Get rid of these casts......
                    if (i != 0 && j != 0) {
                        tableCell.setAttribute("title", this.g.elements.get(i).getValue() + "*" + this.g.elements.get(j).getValue());
                        tableCell.appendChild(this.drawTableCell(this.elementsResults.get(i * this.nRows + j)));
                    } else {
                        if (j == 0) {
                            tableCell.setAttribute("title", this.g.elements.get(i).getValue());
                            tableCell.appendChild(this.drawTableCell((this.g.elements.get(i))));
                        } else {
                            tableCell.setAttribute("title", this.g.elements.get(j).getValue());
                            tableCell.appendChild(this.drawTableCell((this.g.elements.get(j))));
                        }
                    }
                }
            }
        };

        CayleyTable.prototype.drawTableCell = function (e) {
            if (this.showVisual) {
                return this.g.eltRepr(e);
            } else {
                var text = document.createElement("span");
                var content = document.createTextNode(e.toString());
                text.appendChild(content);
                return text;
            }
        };

        CayleyTable.prototype.toggleRepresentation = function () {
            this.showVisual = !this.showVisual;

            // redraw table
            this.displayGroup();
        };

        CayleyTable.prototype.updateTable = function (elements) {
            this.table.innerHTML = "";
            this.table.border = "1px solid #000";

            var row;
            var col;

            this.nRows = elements.size();

            for (var i = 0; i < elements.size(); i++) {
                row = document.createElement('tr');

                this.table.appendChild(row);

                for (var j = 0; j < elements.size(); j++) {
                    col = this.createCayleyCell();

                    //col.style.width = "20px";
                    col.style.textAlign = "center";

                    col.setAttribute("row", i.toString());
                    col.setAttribute("col", j.toString());

                    var self = this;

                    col.onmouseover = function () {
                        var col = this.getAttribute("col");
                        var row = this.getAttribute("row");

                        var tableNodes = document.getElementById("cayley_table").childNodes;

                        var child;

                        for (var i = 0; i < tableNodes.length; i++) {
                            child = tableNodes[i].childNodes[col];
                            if (child.getAttribute("col") == col) {
                                if (child.getAttribute("row") == "0")
                                    child.style.backgroundColor = CayleyTable.operandBGHighlightColor;
                                else
                                    child.style.backgroundColor = CayleyTable.sameRowColHighlightColor;
                            }

                            tableNodes[row].childNodes[0].style.backgroundColor = CayleyTable.operandBGHighlightColor;
                        }

                        for (var i = 1; i < tableNodes.length; i++) {
                            tableNodes[row].childNodes[i].style.backgroundColor = CayleyTable.sameRowColHighlightColor;
                        }

                        var operand1, operand2;
                        if (row != 0 && col != 0) {
                            operand1 = self.elementsResults.get(row * self.nRows);
                            operand2 = self.elementsResults.get(col);
                            var res = self.elementsResults.get((+row) * self.nRows + (+col));

                            self.updateOpWindow(operand1, operand2, res);
                        } else {
                            self.opWindow.innerHTML = "";
                        }

                        this.style.backgroundColor = "transparent";
                    };
                    col.onmouseleave = function () {
                        var col = this.getAttribute("col");
                        var row = this.getAttribute("row");

                        var tableNodes = document.getElementById("cayley_table").childNodes;
                        var child;

                        for (var i = 0; i < tableNodes.length; i++) {
                            for (var j = 0; j < tableNodes.length; j++) {
                                child = tableNodes[i].childNodes[j];
                                child.style.backgroundColor = "transparent";
                            }
                        }
                    };

                    if (i != 0 && j != 0)
                        this.elementsResults.add(this.g.operate((this.g.elements.get(i)), (this.g.elements.get(j))));
                    else if (i == 0)
                        this.elementsResults.add((this.g.elements.get(j)));
                    else
                        this.elementsResults.add((this.g.elements.get(i)));

                    row.appendChild(col);
                }
                this.table.appendChild(row);
            }

            this.displayGroup();
        };
        CayleyTable.operandBGHighlightColor = "#7777dd";
        CayleyTable.sameRowColHighlightColor = "#ddddff";
        return CayleyTable;
    })();
    groups.CayleyTable = CayleyTable;
})(groups || (groups = {}));
/// <reference path="group.ts"/>
/// <reference path="utils.ts" />
var groups;
(function (groups) {
    var Collection = utils.Collection;
    var Combinations = utils.Combinations;

    var SubgroupHelper = (function () {
        function SubgroupHelper(g) {
            this.fullGroup = g;
            this.subgroups = new Collection();
        }
        SubgroupHelper.prototype.calcSubgroups = function () {
            var subgroupSets = new Collection();
            if (this.fullGroup.isCyclic) {
                subgroupSets = this.calcSubgroupsCyclic();
            } else {
                subgroupSets = this.calcSubgroupsByBruteForce(this.fullGroup);
            }
            if (!subgroupSets) {
                //subgroups could not be found - group could be too large error could have occurred.
                return null;
            }
            for (var i = 0; i < subgroupSets.size(); i++) {
                this.subgroups.add(new groups.Group(this.fullGroup.identity, this.fullGroup.operate, subgroupSets.get(i)));
            }
            return this.subgroups;
        };

        SubgroupHelper.prototype.calcSubgroupsCyclic = function () {
            var subgroupSets = new Collection();
            var divisors = SubgroupHelper.getDivisors(this.fullGroup.order);
            var order;
            var ordersUsed = [];

            for (var i = 0; i < this.fullGroup.order; i++) {
                for (var j = 0; j < this.fullGroup.order; j++) {
                    order = this.fullGroup.eOrder(this.fullGroup.elements.get(j));
                    if (divisors[i] == order && ordersUsed.indexOf(order) == -1) {
                        ordersUsed.push(order);
                        break;
                    }
                }
                if (j != this.fullGroup.order)
                    subgroupSets.add(this.generateGroup(this.fullGroup.elements.get(j)).elements);
            }
            return subgroupSets;
        };

        SubgroupHelper.gcd = function (num1, num2) {
            var t;

            if (num1 < num2) {
                t = num1;
                num1 = num2;
                num2 = t;
            }

            if (num2 == 0)
                return 0;

            if (num1 == 0)
                return 0;

            while (num2 != 0) {
                t = num2;
                num2 = num1 % num2;
                num1 = t;
            }
            return num1;
        };

        // Get array containing the divisors of num
        SubgroupHelper.getDivisors = function (num) {
            var divisors = [1];

            for (var i = 0; i * i <= num; i++) {
                if (this.gcd(i, num) > 1) {
                    divisors.push(i);
                    divisors.push(num / i);
                }
                if (i * i == num)
                    divisors.push(i);
            }
            return divisors;
        };

        SubgroupHelper.prototype.generateGroup = function (e) {
            var elements = new groups.Elements();

            //todo: deep copy the element.
            var orig = new groups.ConcreteElement(e.getValue());

            elements.add(this.fullGroup.identity);

            while (e.getValue() != this.fullGroup.identity.getValue()) {
                elements.add(e);
                e = this.fullGroup.operate(e, orig);
            }

            return new groups.Group(this.fullGroup.identity, this.fullGroup.operate, elements);
        };

        SubgroupHelper.prototype.calcSubgroupsByBruteForce = function (g) {
            if (g.elements.size() > 22)
                return null;

            var combos = new Combinations(g.elements, g.elements.size());
            var res = new Collection();
            var subgroupSets = new Collection();

            for (var i = 0; i < g.elements.size(); i++) {
                if (g.elements.size() % i == 0) {
                    res = combos.k_combinations(g.elements, i);

                    for (var j = 0; j < res.size(); j++) {
                        if (!res.get(j).contains(g.identity))
                            continue;
                        if (!subgroupSets.contains(res.get(j))) {
                            if (SubgroupHelper.oneStepSubgroupTest(g, res.get(j))) {
                                subgroupSets.add(res.get(j));
                            }
                        }
                    }
                }
            }

            return subgroupSets;
        };

        // test ab^-1 in G for all a,b in G.
        SubgroupHelper.oneStepSubgroupTest = function (g, candidateSet) {
            for (var i = 0; i < candidateSet.size(); i++) {
                for (var j = 0; j < candidateSet.size(); j++) {
                    if (!candidateSet.contains(g.operate(candidateSet.get(i), g.getInverse(candidateSet.get(j))))) {
                        return false;
                    }
                }
            }
            return true;
        };
        return SubgroupHelper;
    })();
    groups.SubgroupHelper = SubgroupHelper;
})(groups || (groups = {}));
/// <reference path="group.ts"/>
/// <reference path="cayley_table.ts"/>
/// <reference path="subgroup_helper.ts"/>
/// <reference path="utils.ts"/>
var group_app;
(function (group_app) {
    var VisualGroup = groups.VisualGroup;

    var ConcreteElement = groups.ConcreteElement;
    var Elements = groups.Elements;
    var SubgroupHelper = groups.SubgroupHelper;
    var Value = utils.Value;

    var UserParameters = (function () {
        function UserParameters() {
            this.userParameters = [];
            this.paramDescriptions = [];
        }
        UserParameters.prototype.set = function (index, value) {
            this.userParameters[index].value = value;
        };
        UserParameters.prototype.get = function (index) {
            return this.userParameters[index].value;
        };

        UserParameters.prototype.add = function (input, message) {
            // set attribute before adding for CSS styling.
            input.setAttribute("class", "param");
            this.userParameters.push(input);
            this.paramDescriptions.push(message);
        };

        UserParameters.prototype.getHtml = function (index) {
            var span = document.createElement("span");
            span.appendChild(this.userParameters[index]);
            span.appendChild(Background.createTextSpan(this.paramDescriptions[index]));
            return span;
        };

        UserParameters.prototype.length = function () {
            return this.userParameters.length;
        };

        UserParameters.prototype.clear = function () {
            this.userParameters = [];
            this.paramDescriptions = [];
        };
        return UserParameters;
    })();

    var Background = (function () {
        function Background() {
            var _this = this;
            this.showGraphics = true;
            this.userOperation = document.getElementById("operation");
            this.userElements = document.getElementById("userElts");
            this.predefinedGroups = document.getElementById("pre_def_groups");

            var _self = this;
            this.predefinedGroups.addEventListener("change", function () {
                _self.switchGroups();
            });

            this.subgroupsList = document.getElementById("subgroupsList");
            this.propertiesList = document.getElementById("propertiesList");

            this.params = new UserParameters();

            this.prompts = document.getElementById("prompts");

            var input = document.createElement("input");

            Background.showGraphicalCheckbox.checked = true;
            Background.showGraphicalCheckbox.addEventListener("click", function () {
                _self.showGraphics = Background.showGraphicalCheckbox.checked;
                _this.refreshGroupPropsDisplay();
            });

            this.userOperation.addEventListener("change", function () {
                _self.updateGroup();
            });
            this.userElements.addEventListener("change", function () {
                _self.updateGroup();
            });

            this.switchGroups();
        }
        Background.prototype.switchGroups = function () {
            var selectedVal = this.predefinedGroups.value;
            this.prompts.innerHTML = "";
            this.params.clear();
            if (this.table)
                this.table.delete();
            this.table = null;

            switch (selectedVal) {
                case "1":
                    this.prepPromptIntModN();
                    var modulus = 12;
                    this.g = this.intModNExample(+modulus);
                    this.table = new groups.CayleyTable(this.g);
                    break;
                case "2":
                    this.prepPromptColor();
                    this.g = this.colorGroupSample(3, 3, 3); // initial values for the color group.
                    this.table = new groups.CayleyTable(this.g);
                    break;
                case "3":
                    this.prepPromptDihedral();
                    this.g = this.dihedralExample(3); // initial values for order of group / 2.
                    this.table = new groups.CayleyTable(this.g);
                    break;
                case "4":
                    this.g = this.customGroup();
                    this.table = new groups.CayleyTable(this.g);
                    break;
                default:
                    break;
            }

            // common for all groups
            this.helper = new SubgroupHelper(this.g);
            this.subgroups = this.helper.calcSubgroups();
            this.displaySubgroups();
            this.displayGroupProperties();
        };

        Background.prototype.updateGroup = function () {
            var selectedVal = this.predefinedGroups.value;
            if (this.table)
                this.table.delete();
            this.table = null;
            switch (selectedVal) {
                case "1":
                    var modulus = this.params.get(0);
                    this.g = this.intModNExample(+modulus);
                    this.table = new groups.CayleyTable(this.g);
                    break;

                case "2":
                    var rLevels = this.params.get(0);
                    var gLevels = this.params.get(1);
                    var bLevels = this.params.get(2);
                    this.g = this.colorGroupSample(+rLevels, +gLevels, +bLevels);
                    this.table = new groups.CayleyTable(this.g);
                    break;

                case "3":
                    var order = +(this.params.get(0));
                    if (order < 3) {
                        alert("Order must be > 2 for dihedral group.");
                        break;
                    }
                    this.g = this.dihedralExample(+order);
                    this.table = new groups.CayleyTable(this.g);
                    break;

                case "4":
                    this.g = this.customGroup();
                    this.table = new groups.CayleyTable(this.g);
                    break;
                default:
                    break;
            }
            this.helper = new SubgroupHelper(this.g);
            this.subgroups = this.helper.calcSubgroups();
            this.displaySubgroups();
            this.displayGroupProperties();
        };

        Background.prototype.refreshGroupPropsDisplay = function () {
            this.displaySubgroups();
            this.displayGroupProperties();
        };

        Background.prototype.prepPromptIntModN = function () {
            var _self = this;

            var input = document.createElement("input");
            input.addEventListener("change", function () {
                _self.updateGroup();
            });
            this.params.add(input, "Modulus");
            this.prompts.appendChild(this.params.getHtml(0));
        };

        Background.prototype.prepPromptColor = function () {
            var _self = this;
            var input = document.createElement("input");

            // put an input for R, G, and B levels.
            input.addEventListener("change", function () {
                _self.updateGroup();
            });
            this.params.add(input, "Red levels");
            this.params.set(0, "3");

            input = document.createElement("input");
            input.addEventListener("change", function () {
                _self.updateGroup();
            });
            this.params.add(input, "Green levels");
            this.params.set(1, "3");

            input = document.createElement("input");
            input.addEventListener("change", function () {
                _self.updateGroup();
            });
            this.params.add(input, "Blue levels");
            this.params.set(2, "3");

            for (var i = 0; i < this.params.length(); i++) {
                this.prompts.appendChild(this.params.getHtml(i));
                this.prompts.appendChild(document.createElement("br"));
            }
        };

        Background.prototype.prepPromptDihedral = function () {
            var _self = this;
            var input = document.createElement("input");

            // put an input for R, G, and B levels.
            input.addEventListener("change", function () {
                _self.updateGroup();
            });
            this.params.add(input, "Order of group / 2");
            this.params.set(0, "3");

            this.prompts.appendChild(this.params.getHtml(0));
        };

        Background.prototype.intModNExample = function (modulus) {
            var modulus = modulus;

            var g;

            var identity = new groups.ConcreteElement(0);

            var operation = function (left, right) {
                return new groups.ConcreteElement((left.getValue() + right.getValue()) % modulus);
            };

            var elements = new Elements();
            for (var i = 0; i < modulus; i++)
                elements.add(new ConcreteElement(i));

            g = new VisualGroup(identity, operation, elements);

            g.visualize = function (e) {
                var text = document.createElement("span");
                var content = document.createTextNode(e.toString());
                text.appendChild(content);
                return text;
            };

            return g;
        };

        Background.prototype.colorGroupSample = function (rLevels, gLevels, bLevels) {
            var g;

            var elements = new Elements();

            elements.add(new ConcreteElement(new utils.OrderedTriple(1, 0, 0)));
            elements.add(new ConcreteElement(new utils.OrderedTriple(0, 1, 0)));
            elements.add(new ConcreteElement(new utils.OrderedTriple(0, 0, 1)));

            var operation = function (left, right) {
                var red = (left.getValue().x + right.getValue().x) % rLevels;
                var green = (left.getValue().y + right.getValue().y) % gLevels;
                var blue = (left.getValue().z + right.getValue().z) % bLevels;

                return new groups.ConcreteElement(new utils.OrderedTriple(red, green, blue));
            };

            g = VisualGroup.createGroup(elements, operation);
            g.visualize = function (e) {
                var rIntensities = [];
                for (var i = 0; i < rLevels; i++) {
                    rIntensities.push(i * (255 / (rLevels - 1)));
                }

                var gIntensities = [];
                for (var i = 0; i < gLevels; i++) {
                    gIntensities.push(i * (255 / (gLevels - 1)));
                }

                var bIntensities = [];
                for (var i = 0; i < bLevels; i++) {
                    bIntensities.push(i * (255 / (bLevels - 1)));
                }

                var repr = document.createElement("div");

                repr.style.width = "20px";
                repr.style.height = "20px";
                repr.style.margin = "2px";

                var rVal = rIntensities[e.getValue().x];
                var gVal = gIntensities[e.getValue().y];
                var bVal = bIntensities[e.getValue().z];

                repr.style.backgroundColor = new utils.OrderedTriple(rVal, gVal, bVal).toRGBHexString();

                return repr;
            };

            return g;
        };

        Background.prototype.dihedralExample = function (order) {
            var g;

            var elements = new Elements();

            var val = new Value();
            val.addProperty("rotation", 1);
            elements.add(new ConcreteElement(val));
            val = new Value();
            val.addProperty("reflection", 1);
            elements.add(new ConcreteElement(val));

            var operation = function (left, right) {
                var rotL = left.getValue().getProperty("rotation") != null;
                var rotR = right.getValue().getProperty("rotation") != null;

                var rotationL = left.getValue().getProperty("rotation");
                var rotationR = right.getValue().getProperty("rotation");
                var reflectionL = left.getValue().getProperty("reflection");
                var reflectionR = right.getValue().getProperty("reflection");

                var newVal = new Value();

                if (rotL && rotR) {
                    newVal.addProperty("rotation", (rotationL + rotationR) % order);
                } else if (rotL && !rotR) {
                    newVal.addProperty("reflection", (rotationL + reflectionR) % order);
                } else if (!rotL && rotR) {
                    newVal.addProperty("reflection", ((reflectionL - rotationR) + order) % order);
                } else if (!rotL && !rotR) {
                    newVal.addProperty("rotation", ((reflectionL - reflectionR) + order) % order);
                }

                return new groups.ConcreteElement(newVal);
            };
            g = VisualGroup.createGroup(elements, operation);

            g.visualize = function (e) {
                var repr = document.createElement("div");
                var symbolText;
                var subText = document.createElement("sub");

                repr.style.width = "20px";
                repr.style.height = "20px";
                repr.style.margin = "2px";

                var rot = e.getValue().getProperty("rotation") != null;
                var rotations = e.getValue().getProperty("rotation");
                var reflections = e.getValue().getProperty("reflection");

                if (rot) {
                    symbolText = Background.createTextSpan("R");
                    subText.innerHTML = rotations.toString();
                } else {
                    symbolText = Background.createTextSpan("S");
                    subText.innerHTML = reflections.toString();
                }
                symbolText.appendChild(subText);
                repr.appendChild(symbolText);

                return repr;
            };
            return g;
        };

        Background.prototype.customGroup = function () {
            var opRes = "new ConcreteElement(";
            var userOperation = this.userOperation.value.replace("left", "left.getValue()");
            userOperation = userOperation.replace("right", "right.getValue()");
            opRes += userOperation + ")";
            var operation = function (left, right) {
                return eval(opRes);
            };

            var elements = new Elements();
            var userElementStrings = this.userElements.value.split(",");
            for (var i = 0; i < userElementStrings.length; i++) {
                var value;
                value = (!isNaN(+userElementStrings[i])) ? +userElementStrings[i] : userElementStrings[i];
                elements.add(new ConcreteElement(value));
            }
            var g = VisualGroup.createGroup(elements, operation);

            g.visualize = function (e) {
                return Background.createTextSpan(e.getValue());
            };
            return g;
        };

        Background.prototype.displaySubgroups = function () {
            this.subgroupsList.innerHTML = "";
            var listItem;

            if (this.subgroups == null) {
                listItem = document.createElement("li");
                listItem.innerHTML = "Could not compute subgroups - group may be too large";
                this.subgroupsList.appendChild(listItem);
                return;
            }

            for (var i = 0; i < this.subgroups.size(); i++) {
                listItem = document.createElement("li");
                listItem.className = "subgroup";

                var table = document.createElement("table");
                var groupRow = document.createElement("tr");

                for (var j = 0; j < this.subgroups.get(i).elements.size(); j++) {
                    var groupRowEntry = document.createElement("td");
                    if (j == 0 && !this.showGraphics)
                        groupRowEntry.appendChild(Background.createTextSpan("{ "));

                    groupRowEntry.appendChild(this.drawTableCell(this.subgroups.get(i).elements.get(j)));

                    if (j != this.subgroups.get(i).elements.size() - 1 && !this.showGraphics)
                        groupRowEntry.appendChild(Background.createTextSpan(", "));
                    else if (!this.showGraphics)
                        groupRowEntry.appendChild(Background.createTextSpan(" }"));

                    groupRow.appendChild(groupRowEntry);
                }
                table.appendChild(groupRow);
                listItem.appendChild(table);
                this.subgroupsList.appendChild(listItem);
            }
        };

        Background.createTextSpan = function (text) {
            var span = document.createElement("span");
            span.innerHTML = text;
            return span;
        };

        Background.prototype.drawTableCell = function (e) {
            if (this.showGraphics) {
                return this.g.eltRepr(e);
            } else {
                return Background.createTextSpan(e.toString());
            }
        };

        Background.prototype.displayGroupProperties = function () {
            this.propertiesList.innerHTML = "";

            var propertyItem;
            var propertyText;

            propertyItem = document.createElement("li");
            propertyText = Background.createTextSpan("Group is ");
            if (!this.g.isAbelian)
                propertyText.innerHTML += "not ";
            propertyText.innerHTML += "Abelian.";
            propertyItem.appendChild(propertyText);
            this.propertiesList.appendChild(propertyItem);

            propertyItem = document.createElement("li");
            propertyText = Background.createTextSpan("Group is ");
            if (!this.g.isCyclic)
                propertyText.innerHTML += "not ";
            propertyText.innerHTML += "Cyclic.";
            propertyItem.appendChild(propertyText);
            this.propertiesList.appendChild(propertyItem);
        };
        Background.showGraphicalCheckbox = document.getElementById("graphical_table");
        return Background;
    })();
    group_app.Background = Background;
    var bG = new Background();
})(group_app || (group_app = {}));
//# sourceMappingURL=app.js.map
