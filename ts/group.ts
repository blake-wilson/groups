module groups {

	export class Collection<T> {
		private items: Array<T>;

		constructor() {
			this.items = [];
		}

		size(): number {
			return this.items.length;
		}

		add(value: T): void {
			this.items.push(value);
	    }

		remove(index: number): void {
			this.items.splice(index, 1);
		}

		get(index: number): T {
			return this.items[index];
		}

		contains(value: T):boolean {
			return this.items.indexOf(value) > -1;
		}
	}

	export class Element {
		private _value:any;

		public get value():any {
			return this._value;
		}

		constructor(value:any) {
			this._value = value;
		}
	}

	export interface GroupOperation {
		(left:Element, right:Element): Element;
	}

	export class Group {

		// Group properties
		private _isAbelian:boolean;
		private _isCyclic:boolean;
		private _elements:Collection<Element>;
		private _order:number;
		private _operation:GroupOperation;
		private _identity:Element;

		public get isCyclic():boolean {
			return this._isCyclic;
		}
		public get isAbelian():boolean {
			return this._isAbelian;
		}
		public get order():number {
			return this._order;
		}
		public get identity():Element {
			return this._identity;
		}
		public get elements():Collection<Element> {
			return this._elements;
		}
		public get operation():GroupOperation {
			return this._operation;
		}

		private init() {
			this._isAbelian = this.checkAbelian();
			this._isCyclic = this.checkCyclic();
			this._order = this.elements.size();
		}

		// Order of an element within the group
		eOrder(element:Element):number {
			var order:number;
			var current:Element = new Element(element.value);
			for (order = 1; !(current.value == this.identity.value) && order < this.elements.size(); order++)
			{
				current = this._operation(current, element);
			}
			return order;
		}

		private checkAbelian():boolean {
			for (var i = 0; i < this.elements.size(); i++)
			{
				for (var j = 0; j < this.elements.size(); j++)
				{
					if (!(this._operation(this.elements.get(i), this.elements.get(j)).value == (this._operation(this.elements.get(j), this.elements.get(i)).value)))
						return false;
				}
			}
			return true;
		}

		private checkCyclic():boolean {
			for (var i = 0; i < this.elements.size(); i++)
			{
				if (this.eOrder(this.elements.get(i)) == this.elements.size())
					return true;
			}
			return false;
		}

		constructor(identity:Element, operation:GroupOperation, elements:Collection<Element>) {

			this._identity = identity;
			this._operation = operation;
			this._elements = elements;

			// Find group properties
			this.init();

		}

		// Return null if the group cannot be generated.
		static createGroup(generatingSet:Collection<Element>, operation:GroupOperation):Group {
			var groupElements:Collection<Element> = new Collection<Element>();
			var identity:Element = null;
			var temp:Element;
			var g:Group;

			// Enforce unique elements in set.
			for (var i = 0; i < generatingSet.size(); i++)
			{
				if (!groupElements.contains(generatingSet.get(i)))
					groupElements.add(generatingSet.get(i));
			}

			// todo: ???
			for (var i = 0; i < generatingSet.size(); i++) {
				for (var j = 0; j < generatingSet.size(); j++) {
					temp = operation(generatingSet.get(i), generatingSet.get(j));
					groupElements.add(temp);
				}
			}

			// Determine if identity element exists/ what it is.
			for (var i = 0; i < groupElements.size(); i++) {
				for (var j = 0; j < groupElements.size(); j++) {
					if (operation(groupElements.get(i), groupElements.get(j)) != groupElements.get(j))
						break;
					if (j == groupElements.size() - 1)
						if (!identity)
							identity = groupElements.get(i);
						else
							return null; // more than one identity found.
				}
			}

			// Determine if every element of the group is invertible.
			for (var i = 0; i < groupElements.size(); i++) {
				for (var j = 0; j < groupElements.size(); j++) {
					if (operation(groupElements.get(i), groupElements.get(j)) == identity)
						break; // inverse found for element i.
					if (i == groupElements.size() - 1)
						return null; // inverse not found for element i -> not a valid group.
				}
			}

			g = new Group(identity, operation, groupElements);

			// Find group properties.
			g.init();

			return g;
		}

		operate(left:Element, right:Element):Element {
				return this._operation(left, right);
		}

		static getInverse(element:Element, G:Group) {

		}

		// Group events
		private onChanged() {
		}

		toString(): string {
			var retStr = "{";
			for (var i = 0; i < this.elements.size(); i++) {
				retStr += this.elements.get(i).value;
				if (i < this.elements.size() - 1)
					retStr += ", ";
			}
			retStr += "}"

			return retStr;
		}
	}
}