/// <reference path="group.ts"/>
/// <reference path="utils.ts" />

module groups {

	import Group = groups.Group;
	import Collection = utils.Collection;

	export class SubgroupHelper {

		private fullGroup:groups.Group;
		private subgroups:Collection<Group>;

		constructor(g:groups.Group) {
			this.fullGroup = g;
			this.subgroups = new Collection<Group>();
		}

		calcSubgroups() {
			if (this.fullGroup.isCyclic) {
				this.calcSubgroupsCyclic();
			}
			else {
				//todo: implement non-cyclic subgroup finding :/
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
					this.subgroups.add(new Group(this.fullGroup.identity, this.fullGroup.operate,
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

		private generateGroup(e:IElement) {
			var elements:Collection<IElement> = new Collection<IElement>();

			//todo: deep copy the element.
			var orig:ConcreteElement = new ConcreteElement(e.getValue());

			elements.add(this.fullGroup.identity);

			while (e.getValue() != this.fullGroup.identity.getValue()) {
				elements.add(e);
				e = this.fullGroup.operate(e, orig);
			}

			return new Group(this.fullGroup.identity, this.fullGroup.operate, elements);
		}
	}
}
