

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

		get(index: number): T {
			return this.items[index];
		}

		public contains(value:T) {
			for (var i = 0; i < this.size(); i++) {
				for (var j = 0; j < this.size(); j++) {
					if (this.get(i) == this.get(j))
						return true;
				}
			}
			return false;
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

	interface GroupOperation {
		(left:Element, right:Element): Element;
	}

	export class Group {

		// Group properties
		private _isAbelian:boolean;
		private _isCyclic:boolean;
		private _elements:Collection<Element>;
		private _order:number;
		private operation:GroupOperation;
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

		private init() {
			this._isAbelian = this.isAbelian();
			this._isCyclic = this.isCyclic();
			this._order = this.order ();
		}

		// Order of an element within the group
		private order(element:Element):number {
			var order:number;
			var current:Element = element;
			for (order = 1; !current.Equals(this.identity); order++)
			{
				current = this.operation(current, element);
			}
			return order;
		}

		private isAbelian():boolean {
			for (var i = 0; i < this.elements.size(); i++)
			{
				for (var j = 0; j < this.elements.size(); j++)
				{
					if (!this.operation(this.elements.get(i), this.elements.get(j)).Equals(this.operation(elements[j], elements[i])))
						return false;
				}
			}
			return true;
		}

		private isCyclic() {
			for (var i = 0; i < this.elements.size(); i++)
			{
				if (GetOrder(this.elements.get(i)) == this.elements.size())
					return true;
			}
			return false;
		}

		constructor(identity:Element, operation:GroupOperation, elements:Collection<Element>) {

			this._identity = identity;
			this.operation = operation;
			this._elements = elements;

			// Find group properties


		}

		// Return null if the group cannot be generated.
		constructor(generatingSet:Collection<Element>, operation:GroupOperation) {
			var groupElements:Collection<Element> = new Collection()<Element>;
			var identity:Element;
			var temp:Element;

			// todo: ???
			for (var i = 0; i < generatingSet.size(); i++) {
				for (var j = 0; j < generatingSet.size(); j++) {
					temp = operation(generatingSet.get(i), generatingSet.get(j));
						groupElements.add(temp);
				}
			}

			// Determine if identity element exists/ what it is.
			var identityFound:boolean = false;
			for (var i = 0; i < groupElements.size(); i++) {
				for (var j = 0; j < groupElements.size(); j++) {
					if (operation(groupElements.get(i), groupElements.get(j)) != groupElements.get(j))
						break;
				}
				if (identityFound != true) {
					identity = groupElements.get()
					identityFound = true;
				}
				else
					return null; // more than one identity found.
			}

			// Determine if every element of the group is invertible.
			var inverseFound:boolean = false;

			for (var i = 0; i < groupElements.size(); i++) {
				for (var j = 0; j < groupElements.size(); j++) {
					if (operation(groupElements.get(i), groupElements.get(j)))
				}
			}
		}

		operate(left:Element, right:Element):Element {
				return this.operation(left, right);
			}

		static getInverse(element:Element, G:Group) {

		}

		// Group events
		private onChanged() {
		}
	}
}