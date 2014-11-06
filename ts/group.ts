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

	export class Elements extends Collection<IElement> {
	}

	export class ConcreteElement implements IElement {
		private _value:any;

		public getValue():any {
			return this._value;
		}

		public toString():string {
			return this._value.toString();
		}

		constructor(value:any) {
			this._value = value;
		}
	}

	export class VisualElement implements IVisualElement {
		private _value:any;

		public getValue():any {
			return this._value;
		}

		constructor(value:any) {
			this._value = value;
		}

		public visualize():HTMLElement {
			return null;
		}
	}

	export interface IElement {
		getValue():any;
		toString():string;
	}

	export interface IVisualElement extends IElement {
		visualize(): HTMLElement;
	}

	export interface GroupOperation {
		(left:IElement, right:IElement): IElement;
	}

	export interface ElementVisual {
		(elt:Element) : HTMLElement;
	}

	export interface ElementComparer {
		(e1: IElement, e2: IElement): boolean;
	}

	export interface IGroup<T> extends Collection<T> {
		operate(left:T, right:T):T;

		compare(left:T, right:T);

		toString();

		identity: T;

		elements: Collection<T>;
	}

	export class Group implements IGroup<IElement> {

		// Group properties
		private _isAbelian:boolean;
		private _isCyclic:boolean;
		private _elements:Elements;
		private _generatingSet:Elements;
		private _order:number;
		private _identity:IElement;

		//optional function for customizing the look of elements.
		private _elementVisual:ElementVisual;

		//function for comparing elements. Default: e1.value == e2.value
		private _elementCompare:ElementComparer;

		// collection object implementation
		add(e:IElement) {
			if (!contains(e)) {
				this._generatingSet.add(e);
				this.regenerate();
			}
		}

		public get isCyclic():boolean {
			return this._isCyclic;
		}
		public get isAbelian():boolean {
			return this._isAbelian;
		}
		public get order():number {
			return this._order;
		}
		public get identity():IElement {
			return this._identity;
		}
		public get elements():Elements {
			return this._elements;
		}

		public set elementVisual(elementVisual: ElementVisual) {
			this._elementVisual = elementVisual;
		}

		public set elementComparer(comparer: ElementComparer) {
			this._elementCompare = comparer;
		}

		private init() {
			this._isAbelian = this.checkAbelian();
			this._isCyclic = this.checkCyclic();
			this._order = this.elements.size();
		}

		// Order of an element within the group
		eOrder(element:IElement):number {
			var order:number;
			var current:IElement = new ConcreteElement(element.getValue());
			for (order = 1; !(current.getValue() == this.identity.getValue()) && order < this.elements.size(); order++)
			{
				current = this.operate(current, element);
			}
			return order;
		}

		private checkAbelian():boolean {
			for (var i = 0; i < this.elements.size(); i++)
			{
				for (var j = 0; j < this.elements.size(); j++)
				{
					if (!(this.operate(this.elements.get(i), this.elements.get(j)).getValue() == (this.operate(this.elements.get(j), this.elements.get(i)).getValue())))
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

		constructor(identity:IElement, operation:GroupOperation, elements:Elements) {

			this._identity = identity;
			this._elements = elements;
			this.operate = operation;

			// Find group properties
			this.init();
		}

		// Return null if the group cannot be generated.
		static createGroup(generatingSet:Elements, operation:GroupOperation):Group {
			var groupElements:Elements = new Elements();
			var identity:IElement = null;
			var temp:IElement;
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
					if (!groupElements.contains(temp))
						groupElements.add(temp);
				}
			}

			// Determine if identity element exists/ what it is.
			for (var i = 0; i < groupElements.size(); i++) {
				for (var j = 0; j < groupElements.size(); j++) {
					if (operation(groupElements.get(i), groupElements.get(j)).getValue() != groupElements.get(j).getValue())
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
					if (operation(groupElements.get(i), groupElements.get(j)).getValue() == identity.getValue())
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

		operate(left:IElement, right:IElement):IElement;

		// If elements are added or removed, group must be regenerated from the generating set.
		private regenerate() {

		}

		static getInverse(element:Element, G:Group) {

		}

		// Group events
		private onChanged() {
		}

		contains(e: IElement) {
			for (var i = 0; i < this.elements.size(); i++) {
				if (this.compare(e, this.elements.get(i))) {
					return true;
				}
			}
			return false;
		}

		compare (e1: IElement, e2: IElement): boolean {
			return this._elementCompare(e1,e2);
		}

		toString() {
			var retStr = "{";
			for (var i = 0; i < this.elements.size(); i++) {
				retStr += this.elements.get(i).getValue();
				if (i < this.elements.size() - 1)
					retStr += ", ";
			}
			retStr += "}";
			return retStr;
		}
	}

	 export class VisualGroup extends Group<VisualElement> {

		 private _elements:Collection<VisualElement>;

		 get elements():Collection<VisualElement> {
			 return this._elements;
		 }

		eltRepr(e:VisualElement) {
			return document.createElement("span").appendChild(document.createTextNode(e.getValue()));
		}

		operate(left:VisualElement, right:VisualElement):VisualElement;

		repr():HTMLElement {
			// div to store the contents of the HTML representations of each element. - no formatting applied.
			var aggregator:HTMLElement = document.createElement("div");

			for (var i = 0; i < this.elements.size(); i++) {
				// use element visualizing function if one was specified.
				aggregator.appendChild(this._elements.get(i).visualize());
			}

			return aggregator;
		}
	}
}