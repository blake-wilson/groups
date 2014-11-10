/// <reference path="group.ts"/>
/// <reference path="utils.ts" />

module groups {

	import Collection = utils.Collection;
	import Combinations = utils.Combinations;
	import contains = utils.contains;

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
				this.subgroups = this.calcSubgroupsByBruteForce(this.fullGroup);
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
		}

		private generateGroup(e:IElement) {
			var elements:Elements = new Elements();

			//todo: deep copy the element.
			var orig:ConcreteElement = new ConcreteElement(e.getValue());

			elements.add(this.fullGroup.identity);

			while (e.getValue() != this.fullGroup.identity.getValue()) {
				elements.add(e);
				e = this.fullGroup.operate(e, orig);
			}

			return new Group(this.fullGroup.identity, this.fullGroup.operate, elements);
		}

		private calcSubgroupsByBruteForce(g:Group):Collection<Group> {

			if (g.elements.size() > 22) {
				alert("Group too large to attempt brute force subgroup calculation");
				return null;
			}

			var combos:Combinations<IElement> = new Combinations<IElement>(g.elements, g.elements.size());
			var res:Collection<Collection<IElement>> = new Collection<Elements>();
			var subgroups:Collection<Group> = new Collection<Group>();

			for (var i = 0; i < g.elements.size(); i++) {
				if (g.elements.size() % i == 0) {
					res = combos.k_combinations(<Collection<IElement>>g.elements, i);

					for (var j = 0; j < res.size(); j++) {
						if (SubgroupHelper.oneStepSubgroupTest(g, <Elements>res.get(j))) {
							subgroups.add(new Group(g.identity, g.operate, <Elements>res.get(j)));
						}
					}
				}
			}
			return subgroups;
		}

		// test ab^-1 in G for all a,b in G.
		private static oneStepSubgroupTest(g:Group, candidateSet:Elements):boolean {

			for (var i = 0; i < candidateSet.size(); i++) {

				for (var j = 0; j < candidateSet.size(); j++)  {

					if (!contains(candidateSet, (g.operate(candidateSet.get(i), g.getInverse(candidateSet.get(j)))))) {
						return false;
					}
				}
			}
			return true;
		}
	}
}
