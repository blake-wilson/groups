/// <reference path="group.ts"/>
/// <reference path="cayley_table.ts"/>
/// <reference path="subgroup_helper.ts"/>
/// <reference path="utils.ts"/>

module group_app {

	import Group = groups.Group;
	import VisualGroup = groups.VisualGroup;
	import IElement = groups.IElement;
	import VisualElement = groups.VisualElement;
	import ConcreteElement = groups.ConcreteElement;
	import Elements = groups.Elements;
	import SubgroupHelper = groups.SubgroupHelper;

	import Collection = utils.Collection;

	class UserParameters {
		private userParameters: HTMLInputElement[];
		private paramDescriptions: string[];

		constructor() {
			this.userParameters = [];
			this.paramDescriptions = [];
		}

		set(index: number, value: string) {
			this.userParameters[index].value = value;
		}
		get(index:number): string {
			return this.userParameters[index].value;
		}

		add(input: HTMLInputElement, message: string) {
			// set attribute before adding for CSS styling.
			input.setAttribute("class", "param");
			this.userParameters.push(input);
			this.paramDescriptions.push(message);
		}

		getHtml(index: number):HTMLElement {
			var span = document.createElement("span");
			span.appendChild(this.userParameters[index]);
			span.appendChild(Background.createTextSpan(this.paramDescriptions[index]));
			return span;
		}

		length(): number {
			return this.userParameters.length;
		}

		clear() {
			this.userParameters = [];
			this.paramDescriptions = [];
		}
	}

	export class Background {

		private g:VisualGroup;

		//HTML Elements
		private subgroupsList:HTMLElement;
		private propertiesList:HTMLElement;

		//subgroups
		private subgroups: Collection<Group>;
		private helper:SubgroupHelper;

		private predefinedGroups:HTMLSelectElement;

		private table:groups.CayleyTable;

		// textbox for user input - not visible by default.
		private params: UserParameters;

		private prompts:HTMLElement;

		static showGraphicalCheckbox:HTMLInputElement = <HTMLInputElement>document.getElementById("graphical_table");
		private showGraphics:boolean = true;

        constructor() {
	        this.predefinedGroups = <HTMLSelectElement>document.getElementById("pre_def_groups");

	        var _self = this;
	        this.predefinedGroups.addEventListener("change", () => {
		        _self.switchGroups();
	        });

	        this.subgroupsList = document.getElementById("subgroupsList");
	        this.propertiesList = document.getElementById("propertiesList");

	        this.params = new UserParameters();

	        this.prompts = document.getElementById("prompts");

	        var input: HTMLInputElement = document.createElement("input");

	        Background.showGraphicalCheckbox.checked = true;
	        Background.showGraphicalCheckbox.addEventListener("click", () => {_self.showGraphics = Background.showGraphicalCheckbox.checked; this.refreshGroupPropsDisplay();});

	        this.switchGroups();
        }

		private switchGroups() {
			var selectedVal = this.predefinedGroups.value;
			this.prompts.innerHTML = "";
			if (this.table)
				this.table.delete();
			this.table = null;

			switch(selectedVal) {
				case "1":
					this.prepPromptIntModN();
					var modulus = 12; // initial value for the group.
					this.g = this.intModNExample(+modulus);
					this.table = new groups.CayleyTable(this.g);
					break;
				case "2":
					this.prepPromptColor();
					this.g = this.colorGroupSample(3, 3, 3);  // initial values for the color group.
					this.table = new groups.CayleyTable(this.g);
					break;
				default:
					break;
			}

			// common for all groups
			this.helper = new SubgroupHelper(this.g);
			this.subgroups = this.helper.calcSubgroups();
			this.displaySubgroups();
			this.displayGroupProperties();
		}

		private updateGroup() {
			var selectedVal = this.predefinedGroups.value;
			if (this.table)
				this.table.delete();
			this.table = null;
			switch(selectedVal) {
				// int's mod n
				case "1":
					var modulus = this.params.get(0);
					this.g = this.intModNExample(+modulus);
					this.table = new groups.CayleyTable(this.g);
					break;
				// color group
				case "2":
					var rLevels = this.params.get(0);
					var gLevels = this.params.get(1);
					var bLevels = this.params.get(2);
					this.g = this.colorGroupSample(+rLevels, +gLevels, +bLevels);
					this.table = new groups.CayleyTable(this.g);
					break;
				default:
					break;
			}
			this.helper = new SubgroupHelper(this.g);
			this.subgroups = this.helper.calcSubgroups();
			this.displaySubgroups();
			this.displayGroupProperties();
		}

		private refreshGroupPropsDisplay() {
			this.displaySubgroups();
			this.displayGroupProperties();
		}

		private prepPromptIntModN() {
			this.params.clear();
			var _self = this;

			var input = document.createElement("input");
			input.addEventListener("change", () => {
				_self.updateGroup();
			});
			this.params.add(input, "Modulus");
			this.prompts.appendChild(this.params.getHtml(0));
		}

		private prepPromptColor() {
			this.params.clear();
			var _self = this;
			var input = document.createElement("input");

			// put an input for R, G, and B levels.
			input.addEventListener("change", () => {
				_self.updateGroup();
			});
			this.params.add(input, "Red levels");
			this.params.set(0, "3");

			input = document.createElement("input");
			input.addEventListener("change", () => {
				_self.updateGroup();
			});
			this.params.add(input, "Green levels");
			this.params.set(1, "3");

			input = document.createElement("input");
			input.addEventListener("change", () => {
				_self.updateGroup();
			});
			this.params.add(input, "Blue levels");
			this.params.set(2, "3");

			for (var i = 0; i < this.params.length(); i++) {
				this.prompts.appendChild(this.params.getHtml(i));
				this.prompts.appendChild(document.createElement("br"));
			}
		}

		private intModNExample(modulus:number):VisualGroup {
			var modulus:number = modulus;

			var g:VisualGroup;

			var identity:groups.ConcreteElement = new groups.ConcreteElement(0);

			var operation:groups.GroupOperation = function(left:groups.ConcreteElement, right:groups.ConcreteElement) {
				return new groups.ConcreteElement((left.getValue() + right.getValue()) % modulus);
			};

			var elements:Collection<ConcreteElement> = new Collection<ConcreteElement>();
			for (var i = 0; i < modulus; i++)
				elements.add(new ConcreteElement(i));

			g = new VisualGroup(identity, operation, elements);

			g.visualize = function (e:VisualElement) {
				var text:HTMLElement = document.createElement("span");
				var content:Text = document.createTextNode(e.toString());
				text.appendChild(content);
				return text;
			};

			return g;
		}

		private displaySubgroups() {
			this.subgroupsList.innerHTML = "";

			if (this.subgroups == null)
				return;

			var listItem:HTMLElement;
			var groupText:Text;

			for (var i = 0; i < this.subgroups.size(); i++) {
				listItem = document.createElement("li");

				var table:HTMLElement = document.createElement("table");
				var groupRow:HTMLElement = document.createElement("tr");

				for (var j = 0; j < this.subgroups.get(i).elements.size(); j++) {
					var groupRowEntry = document.createElement("td");
					if (j == 0 && !this.showGraphics)
						groupRowEntry.appendChild(Background.createTextSpan("{ "));

					groupRowEntry.appendChild(this.drawTableCell(this.subgroups.get(i).elements.get(j)));

					if (j != this.subgroups.get(i).elements.size() - 1 && !this.showGraphics)
						groupRowEntry.appendChild(Background.createTextSpan(", "));
					else if (!this.showGraphics)
						groupRowEntry.appendChild(Background.createTextSpan(" }"));

					groupRow.appendChild(groupRowEntry);
				}
				table.appendChild(groupRow);
				listItem.appendChild(table);
				this.subgroupsList.appendChild(listItem);
			}

		}

		static createTextSpan(text: string): HTMLElement {
			var span = document.createElement("span");
			span.innerHTML = text;
			return span;
		}

		private drawTableCell(e:IElement):HTMLElement {
			if (this.showGraphics) {
				return this.g.eltRepr(e);
			}
			else {
				return Background.createTextSpan(e.toString());
			}
		}

		private displayGroupProperties() {
			this.propertiesList.innerHTML = "";

			var propertyItem:HTMLElement;
			var propertyText:HTMLElement;


			propertyItem = document.createElement("li");
			propertyText = Background.createTextSpan("Group is ");
			if (!this.g.isAbelian)
				propertyText.innerHTML += "not ";
			propertyText.innerHTML += "Abelian.";
			propertyItem.appendChild(propertyText);
			this.propertiesList.appendChild(propertyItem);

			propertyItem = document.createElement("li");
			propertyText = Background.createTextSpan("Group is ");
			if (!this.g.isCyclic)
				propertyText.innerHTML += "not ";
			propertyText.innerHTML += "Cyclic.";
			propertyItem.appendChild(propertyText);
			this.propertiesList.appendChild(propertyItem);
		}

		private colorGroupSample(rLevels:number, gLevels:number, bLevels:number): VisualGroup {
			var g:VisualGroup;

			var elements:Elements = new Elements();

			elements.add(new ConcreteElement(new utils.OrderedTriple(1, 0, 0)));
			elements.add(new ConcreteElement(new utils.OrderedTriple(0, 1, 0)));
			elements.add(new ConcreteElement(new utils.OrderedTriple(0,0,1)));

			var operation = function(left:groups.ConcreteElement, right:groups.ConcreteElement) {
				var red = ((<utils.OrderedTriple>left.getValue()).x + (<utils.OrderedTriple>right.getValue()).x) % rLevels;
				var green = ((<utils.OrderedTriple>left.getValue()).y + (<utils.OrderedTriple>right.getValue()).y) % gLevels;
				var blue = ((<utils.OrderedTriple>left.getValue()).z + (<utils.OrderedTriple>right.getValue()).z) % bLevels;

				return new groups.ConcreteElement(new utils.OrderedTriple(red, green, blue));
			};

			g = VisualGroup.createGroup(elements, operation);
			g.visualize = function (e:VisualElement) {

				var rIntensities = [];
				for (var i = 0; i < rLevels; i++) {
					rIntensities.push(i * (255 / (rLevels - 1)));
				}

				var gIntensities = [];
				for (var i = 0; i < gLevels; i++) {
					gIntensities.push(i * (255 / (gLevels - 1)));
				}

				var bIntensities = [];
				for (var i = 0; i < bLevels; i++) {
					bIntensities.push(i * (255 / (bLevels - 1)));
				}

				var repr = document.createElement("div");

				repr.style.width = "20px";
				repr.style.height = "20px";
				repr.style.margin = "2px";

				var rVal = rIntensities[e.getValue().x];
				var gVal = gIntensities[e.getValue().y];
				var bVal = bIntensities[e.getValue().z];

				repr.style.backgroundColor =  new utils.OrderedTriple(rVal, gVal, bVal).toRGBHexString();

				return repr;
			};

			return g;
		}
    }
	var bG:Background = new Background();
}
