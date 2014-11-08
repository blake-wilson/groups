module utils {

	export class RGB {
		constructor(public red:number, public green:number, public blue:number) {

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
}