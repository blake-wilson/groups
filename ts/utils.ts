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

module utils {

	export class RGB {
		constructor(public red:number, public green:number, public blue:number) {

		}
	}

	export class OrderedPair {
		constructor(public x:number, public y:number) {}
		toString(): string {
			return "(" + this.x.toString() + ", " + this.y.toString() + ")";
		}
	}

	export class Value {
		private val:any;
		private valNames: string[];

		constructor(value: any = []) {
			this.val = value;
			this.valNames = [];
		}

		addProperty(name:string, value:any) {
			this.val[name] = value;
			this.valNames.push(name);
		}

		getProperty(name: string): any {
			if (this.val.hasOwnProperty(name)) {
				return this.val[name];
			}
			return null;
		}

		getValue() {
			return this.val;
		}

		toString(): string {
			var retstr:string = "";
			for (var i = 0; i < this.valNames.length; i++) {
				retstr += this.valNames[i] + ": " + this.val[this.valNames[i]] + ";";
			}
			return retstr;
		}
	}

	export class OrderedTriple {
		constructor(public x:number, public y:number, public z:number) {}
		toString():string {
			return "(" + this.x.toString() + ", " + this.y.toString() + ", " + this.z.toString() + ")";
		}

		toRGBHexString():string {
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
		}

		toRGBACSSHexString(alpha:number):string {
			return "rgba(" + this.x + "," + this.y + "," + this.z + "," + alpha + ")";
		}
	}

	export function isEqual(x, y) {
		if ( x === y ) return true;
		// if both x and y are null or undefined and exactly the same

		if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) return false;
		// if they are not strictly equal, they both need to be Objects

		if ( x.constructor !== y.constructor ) return false;
		// they must have the exact same prototype chain, the closest we can do is
		// test there constructor.

		for ( var p in x ) {
			if ( ! x.hasOwnProperty( p ) ) continue;
			// other properties were tested using x.constructor === y.constructor

			if ( ! y.hasOwnProperty( p ) ) return false;
			// allows to compare x[ p ] and y[ p ] when set to undefined

			if ( x[ p ] === y[ p ] ) continue;
			// if they have the same strict value or identity then they are equal

			if ( typeof( x[ p ] ) !== "object" ) return false;
			// Numbers, Strings, Functions, Booleans must be strictly equal

			if ( ! this.isEqual( x[ p ],  y[ p ] ) ) return false;
			// Objects and Arrays must be tested recursively
		}

		for ( p in y ) {
			if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) return false;
			// allows x[ p ] to be set to undefined
		}
		return true;
	}

	export interface Comparable {
		equals(other: Comparable): boolean;
	}

	export class Collection<T extends Comparable> {
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

		slice(start:number, end:number = this.items.length):Collection<T> {
			var temp:Collection<T> = new Collection<T>();
			temp.items = this.items.slice(start, end);
			return temp;
		}

		concat(other:Collection<T>):Collection<T> {
			var temp:Collection<T> = new Collection<T>();

			//todo: do I really have to copy the contents of the method's own object....
			for (var i = 0; i < this.items.length; i++)  {
				temp.add(this.items[i]);
			}
			for (var i = 0; i < other.size(); i++) {
				temp.add(other.get(i));
			}
			return temp;
		}

		equals(other: Collection<T>): boolean {
			if (this.size() != other.size())
				return false;

			for (var i = 0; i < this.size(); i++) {
				if (!this.contains(other.get(i)))
					return false;
			}
			return true;
		}

		contains(item: T): boolean {
			for (var i = 0; i < this.size(); i++) {
				if (this.get(i).equals(item))
					return true;
			}
			return false;
		}

		shift(): T {
			return this.items.shift();
		}

		unshift(item: T): number {
			return this.items.unshift(item);
		}
	}

	export class Combinations<T extends Comparable> {
		private collection:Collection<T>;
		private setSize:number;

		constructor(set:Collection<T>, setSize:number) {
			this.collection = set;
			this.setSize = setSize;
		}

		k_combinations(set:Collection<T>, k:number):Collection<Collection<T>> {
			var combs, tailcombs: Collection<Collection<T>>;
			var head:Collection<T>;

			var i, j: number;

			if (k > set.size() || k <= 0) {
				return new Collection<Collection<T>>();
			}

			if (k == set.size()) {
				var collection:Collection<Collection<T>> = new Collection<Collection<T>>();
				collection.add(set);
				return collection;
			}

			if (k == 1) {
				combs = new Collection<Collection<T>>();

				for (i = 0; i < set.size(); i++) {
					var tmp = new Collection<T>();
					tmp.add(set.get(i));
					combs.add(tmp);
				}
				return combs;
			}

			combs = new Collection<Collection<T>>();
			for (i = 0; i < set.size() - k + 1; i++) {
				head = set.slice(i, i+1);
				tailcombs = this.k_combinations(set.slice(i + 1), k - 1);
				for (j = 0; j < tailcombs.size(); j++) {
					combs.add(head.concat(tailcombs.get(j)));
				}
			}
			return combs;
		}
	}

	export class IdGen {
		private static id:number = 0;

		static getId() {
			return IdGen.id++;
		}
	}

}