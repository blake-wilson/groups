/// <reference path="utils.ts" />

module groups {

	import Collection = utils.Collection;
	import IdGen = utils.IdGen;
	import Comparable = utils.Comparable;

	export class Elements extends Collection<IElement> {
		equals(other: Comparable): boolean {
			var o:Elements = <Elements>other;
			if (this.size() != o.size()) {
				return false;
			}
			for (var i = 0; i < this.size(); i++) {
				if (!o.contains(this.get(i)))
					return false;
			}
		}
	}

	export class ConcreteElement implements IElement {
		private _value:any;
		private id:number;

		public getValue():any {
			return this._value;
		}

		public toString():string {
			return this._value.toString();
		}

		public getId():number {
			return this.id;
		}

		public equals(other: Comparable) {
			return utils.isEqual(this._value, (<IElement>other).getValue());
		}

		constructor(value:any) {
			this._value = value;
			this.id = IdGen.getId();
		}
	}

	export class VisualElement extends ConcreteElement implements IVisualElement {

		public getValue():any {
			return super.getValue();
		}

		constructor(value:any) {
			super(value);
		}

		public equals(other: Comparable) {
			return utils.isEqual(super.getValue(), other);
		}

		public getId():number {
			return super.getId();
		}

		public toString():string {
			return super.getValue().toString();
		}
	}

	export interface IElement extends Comparable {
		getValue():any;
		getId():number;
		toString():string;
		equals(other: Comparable):boolean;
	}

	export interface IVisualElement extends IElement {
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

	export interface IGroup<T> {
		operate(left:T, right:T):T;

		equals(other: IGroup<T>);

		toString();

		identity: T;

		elements: Collection<Comparable>;
	}

	export class Group implements IGroup<IElement> {

		// Group properties
		private _isAbelian:boolean;
		private _isCyclic:boolean;
		private _elements:Elements;

		private _inverseMap:{[id:number]: IElement;};

		private _generatingSet:Elements;
		private _order:number;
		private _identity:IElement;

		//optional function for customizing the look of elements.
		private _elementVisual:ElementVisual;

		//function for comparing elements. Default: e1.value == e2.value
		private _elementCompare:ElementComparer;

		operate(left:IElement, right:IElement) {
			// implementation provided by user.
			return null;
		}

		// collection object implementation
		add(e:IElement) {
			if (!this.contains(e)) {
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

		public get inverseMap(): {[id:number]: IElement;} {
			return this._inverseMap;
		}
		public set inverseMap(map: {[id:number]: IElement;}) {
			this._inverseMap = map;
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
			for (order = 1; !(current.equals(this.identity)) && order < this.elements.size(); order++)
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
					if (!this.operate(this.elements.get(i), this.elements.get(j)).equals(this.operate(this.elements.get(j), this.elements.get(i))))
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

			this.inverseMap = this.findInverses(elements, operation, identity);

			// Find group properties
			this.init();
		}

		static generateGroup(operation:GroupOperation, generatingSet:Elements) {
			var temp:IElement;
			var newElts:Elements = new Elements();

			// if generation does not change the size of the generating set, return.
			var genSetSize = generatingSet.size();

			for (var i = 0; i < generatingSet.size(); i++) {
				for (var j = 0; j < generatingSet.size(); j++) {
					temp = operation(generatingSet.get(i), generatingSet.get(j));
					if (!generatingSet.contains(temp) && !newElts.contains(temp))
						newElts.add(temp);
				}
			}

			// Add the new elements to the generating set and re-generate.
			for (var i = 0; i < newElts.size(); i++) {
				generatingSet.add(newElts.get(i));
			}

			if (generatingSet.size() != genSetSize) {
				generatingSet = this.generateGroup(operation, generatingSet);
			}
			return generatingSet;
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

			this.generateGroup(operation, groupElements);

			// Determine if identity element exists/ what it is.
			for (var i = 0; i < groupElements.size(); i++) {
				for (var j = 0; j < groupElements.size(); j++) {
					if (!utils.isEqual(operation(groupElements.get(i), groupElements.get(j)).getValue(), groupElements.get(j).getValue()) ||
						!utils.isEqual(operation(groupElements.get(j), groupElements.get(i)).getValue(), groupElements.get(j).getValue()))
						break;
					if (j == groupElements.size() - 1)
						if (!identity) {
							identity = groupElements.get(i);
							// put identity at the front of the elements for easier table display.
							groupElements.remove(i);
							groupElements.unshift(identity);
						}
						else
							return null;  // more than one identity found.
				}
			}

			if (identity == null) {
				return null;  //identity not found.
			}

			g = new Group(identity, operation, groupElements);

			g.inverseMap =  g.findInverses(g.elements, g.operate, g.identity);

			return g;
		}

		// If elements are added or removed, group must be regenerated from the generating set.
		private regenerate() {

		}

		public getInverse(e:IElement) {
			return this._inverseMap[e.getId()];
		}

		// if element is invertible, add it to an inverses map.  If any element is non-invertible, return null. If all elements are invertible, return the inverse map.
		private findInverses(groupElements:Elements, operation:GroupOperation, identity:IElement): {[id:number]: IElement;} {

			var inverseMap:{[id:number]: IElement;} = {};
			var result:IElement;

			for (var i = 0; i < groupElements.size(); i++) {
				for (var j = 0; j < groupElements.size(); j++) {
					result = operation(groupElements.get(i), groupElements.get(j));
					if (utils.isEqual(result.getValue(), identity.getValue())) {
						// Add inverse to the inverse map.
						inverseMap[groupElements.get(i).getId()] = groupElements.get(j);
						break; // inverse found for element i.
					}
					if ((i == groupElements.size() - 1) && (j == groupElements.size() - 1))
						return null; // inverse not found for element i -> not a valid group.
				}
			}

			// every element was invertible - valid map should've been produced.
			return inverseMap;
		}

		// Group events
		private onChanged() {
		}

		contains(e: IElement) {
			return this.elements.contains(e);
		}

		equals (other: Group): boolean {
			if (this.operate != other.operate)
				return false;
			return this.elements.equals(other.elements);
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

	 export class VisualGroup extends Group {

		 public constructor(identity:IElement, operation:GroupOperation, elts:Elements) {
				super(identity, operation, elts);
		 }

		 operate(left:IElement, right:IElement) {
			 // implementation provided by user.
			 return null;
		 }

		 eltRepr(e:IElement):HTMLElement {
			var htmlElement:HTMLElement = this.visualize(e);
			 return htmlElement;
		}

		static createGroup(generatingSet:Elements, operation:GroupOperation): VisualGroup {
			var g:Group = Group.createGroup(generatingSet, operation);

			return new VisualGroup(g.identity, g.operate, g.elements);
		}

		public visualize(e:IElement):HTMLElement {
			 return null;
		}

		repr():HTMLElement {
			// div to store the contents of the HTML representations of each element. - no formatting applied.
			var aggregator:HTMLElement = document.createElement("div");

			for (var i = 0; i < this.elements.size(); i++) {
				// use element visualizing function if one was specified.
				aggregator.appendChild(this.visualize((this.elements.get(i))));
			}

			return aggregator;
		}
	}
}