/// <reference path="group.ts"/>

module groups {

	import Group = groups.Group;
	export class SubgroupHelper {

		private fullGroup:groups.Group;
		private subgroups:groups.Collection<Group>;

		constructor(g:groups.Group) {
			this.fullGroup = g;
			this.subgroups = new Collection<Group>();
		}

		calcSubgroups() {
			if (this.fullGroup.isCyclic) {
				this.calcSubgroupsCyclic();
			}
			return this.subgroups;
		}

		calcSubgroupsCyclic() {
			var divisors = SubgroupHelper.getDivisors(this.fullGroup.order);

			for (var i = 0; i < this.fullGroup.order; i++) {
				for (var j = 0; j < this.fullGroup.order; j++) {
					if (divisors[i] == this.fullGroup.eOrder(this.fullGroup.elements.get(j)))
						break;
				}
				if (j != this.fullGroup.order)
					this.subgroups.add(new Group(this.fullGroup.identity, this.fullGroup.operation,
						this.generateGroup(this.fullGroup.elements.get(j)).elements));
			}
			return this.subgroups;
		}

		static gcd(num1:number, num2:number) {
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
		}

		// Get array containing the divisors of num
		private static getDivisors(num:number) {
			var divisors = [];

			for (var i = 0; i * i <= num; i++) {
				if (this.gcd(i, num) > 1) {
					divisors.push(i);
					divisors.push(num / i);
				}
				if (i * i == num)
					divisors.push(i);
			}
			return divisors;
		}

		private generateGroup(e:Element) {
			var elements:Collection<Element> = new Collection<Element>();

			//todo: deep copy the element.
			var orig:Element = new Element(e.value);

			elements.add(this.fullGroup.identity);

			while (e.value != this.fullGroup.identity.value) {
				elements.add(e);
				e = this.fullGroup.operate(e, orig);
			}

			return new Group(this.fullGroup.identity, this.fullGroup.operation, elements);
		}
	}
}
