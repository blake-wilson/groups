var groups;
(function (groups) {
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

        Collection.prototype.contains = function (value) {
            return this.items.indexOf(value) > -1;
        };
        return Collection;
    })();
    groups.Collection = Collection;

    var Element = (function () {
        function Element(value) {
            this._value = value;
        }
        Object.defineProperty(Element.prototype, "value", {
            get: function () {
                return this._value;
            },
            enumerable: true,
            configurable: true
        });
        return Element;
    })();
    groups.Element = Element;

    var Group = (function () {
        function Group(identity, operation, elements) {
            this._identity = identity;
            this.operation = operation;
            this._elements = elements;

            // Find group properties
            this.init();
        }
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

        Group.prototype.init = function () {
            this._isAbelian = this.checkAbelian();
            this._isCyclic = this.checkCyclic();
            this._order = this.elements.size();
        };

        // Order of an element within the group
        Group.prototype.eOrder = function (element) {
            var order;
            var current = element;
            for (order = 1; !(current == this.identity) && order < this.elements.size(); order++) {
                current = this.operation(current, element);
            }
            return order;
        };

        Group.prototype.checkAbelian = function () {
            for (var i = 0; i < this.elements.size(); i++) {
                for (var j = 0; j < this.elements.size(); j++) {
                    if (!(this.operation(this.elements.get(i), this.elements.get(j)) == (this.operation(this.elements.get(j), this.elements.get(i)))))
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

        // Return null if the group cannot be generated.
        Group.createGroup = function (generatingSet, operation) {
            var groupElements = new Collection();
            var identity = null;
            var temp;
            var g;

            for (var i = 0; i < generatingSet.size(); i++) {
                if (!groupElements.contains(generatingSet.get(i)))
                    groupElements.add(generatingSet.get(i));
            }

            for (var i = 0; i < generatingSet.size(); i++) {
                for (var j = 0; j < generatingSet.size(); j++) {
                    temp = operation(generatingSet.get(i), generatingSet.get(j));
                    groupElements.add(temp);
                }
            }

            for (var i = 0; i < groupElements.size(); i++) {
                for (var j = 0; j < groupElements.size(); j++) {
                    if (operation(groupElements.get(i), groupElements.get(j)) != groupElements.get(j))
                        break;
                    if (j == groupElements.size() - 1)
                        if (!identity)
                            identity = groupElements.get(i);
                        else
                            return null;
                }
            }

            for (var i = 0; i < groupElements.size(); i++) {
                for (var j = 0; j < groupElements.size(); j++) {
                    if (operation(groupElements.get(i), groupElements.get(j)) == identity)
                        break;
                    if (i == groupElements.size() - 1)
                        return null;
                }
            }

            g = new Group(identity, operation, groupElements);

            // Find group properties.
            g.init();

            return g;
        };

        Group.prototype.operate = function (left, right) {
            return this.operation(left, right);
        };

        Group.getInverse = function (element, G) {
        };

        // Group events
        Group.prototype.onChanged = function () {
        };
        return Group;
    })();
    groups.Group = Group;
})(groups || (groups = {}));
/// <reference path="group.ts"/>
var groups;
(function (groups) {
    // Graphical way to represent Cayley Table in HTML
    var CayleyTable = (function () {
        function CayleyTable(g) {
            this.g = g;
            this.table = document.getElementById("cayley_table");
            this.updateTable(g.elements);
        }
        CayleyTable.prototype.updateTable = function (elements) {
            this.table.innerHTML = "";
            this.table.border = "1px solid #000";

            var row;
            var col;

            for (var i = 0; i < elements.size(); i++) {
                row = document.createElement('tr');
                row.style.height = "20px";
                this.table.appendChild(row);
                for (var j = 0; j < elements.size(); j++) {
                    col = document.createElement('td');
                    col.style.width = "20px";
                    col.style.textAlign = "center";
                    if ((j + i) % 2 == 0)
                        col.style.backgroundColor = "#dfdfdf";
                    else
                        col.style.backgroundColor = "#ffffff";
                    col.appendChild(document.createTextNode(this.g.operate(this.g.elements.get(j), this.g.elements.get(i)).value));
                    row.appendChild(col);
                }
                this.table.appendChild(row);
            }
        };
        return CayleyTable;
    })();
    groups.CayleyTable = CayleyTable;
})(groups || (groups = {}));
/// <reference path="group.ts"/>
/// <reference path="cayley_table.ts"/>
var group_app;
(function (group_app) {
    var Background = (function () {
        function Background() {
            // create a group
            var modulus = 10;
            var identity = new groups.Element(0);

            console.log("ident set");

            var operation = function (left, right) {
                return new groups.Element((left.value + right.value) % modulus);
            };

            var elements = new groups.Collection();
            for (var i = 0; i < 10; i++)
                elements.add(new groups.Element(i));

            console.log(elements.size());
            var g = new groups.Group(identity, operation, elements);

            var table = new groups.CayleyTable(g);
        }
        return Background;
    })();

    var bG = new Background();
})(group_app || (group_app = {}));
//# sourceMappingURL=app.js.map
