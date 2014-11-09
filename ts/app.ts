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

	class Background {

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
		private promptText:HTMLInputElement;
		private promptHidden:boolean = true;

		private prompts:HTMLElement;

        constructor() {
	        this.predefinedGroups = <HTMLSelectElement>document.getElementById("pre_def_groups");

	        var _self = this;
	        this.predefinedGroups.addEventListener("change", () => {
		        _self.switchGroups();
	        });

	        //this.table = new groups.CayleyTable(this.colorGroupSample());

	        //this.helper = new SubgroupHelper(this.g);

	        //this.subgroups = this.helper.calcSubgroups();

	        this.subgroupsList = document.getElementById("subgroupsList");
	        this.propertiesList = document.getElementById("propertiesList");

	        //this.displaySubgroups();
	       // this.displayGroupProperties();
	        this.prompts = document.getElementById("prompts");
	        this.promptText = document.createElement("input");

	        this.promptText.addEventListener("change", () => {
		        _self.switchGroups();
	        });

	        this.switchGroups();
        }

		private switchGroups() {
			var selectedVal = this.predefinedGroups.value;

			switch(selectedVal) {
				case "1":
					this.prepPromptIntModN();
					var modulus = this.promptText.value;
					this.g = this.intModNExample(+modulus);
					this.table = new groups.CayleyTable(this.g);
					break;
				case "2":
					this.prepPromptColor();
					this.g = this.colorGroupSample();
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

		private prepPromptIntModN() {
			if (this.promptHidden) {
				this.prompts.appendChild(this.promptText);
				this.promptText.value = "10";
				this.promptHidden = false;
			}
		}

		private prepPromptColor() {
			if (!this.promptHidden) {
				this.prompts.innerHTML = "";
				this.promptHidden = true;
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
			var listItem:HTMLElement;
			var groupText:Text;

			for (var i = 0; i < this.subgroups.size(); i++) {
				listItem = document.createElement("li");
				groupText = document.createTextNode(this.subgroups.get(i).toString());

				listItem.appendChild(groupText);
				this.subgroupsList.appendChild(listItem);
			}
		}

		private displayGroupProperties() {
			this.propertiesList.innerHTML = "";

			var propertyItem:HTMLElement;
			var propertyText:Text;


			propertyItem = document.createElement("li");
			propertyText = document.createTextNode("Group is ");
			if (!this.g.isAbelian)
				propertyText.appendData("not ");
			propertyText.appendData("Abelian.");
			propertyItem.appendChild(propertyText);
			this.propertiesList.appendChild(propertyItem);

			propertyItem = document.createElement("li");
			propertyText = document.createTextNode("Group is ");
			if (!this.g.isCyclic)
				propertyText.appendData("not ");
			propertyText.appendData("Cyclic.");
			propertyItem.appendChild(propertyText);
			this.propertiesList.appendChild(propertyItem);
		}

		private colorGroupSample(): VisualGroup {
			var g:VisualGroup;

			var steps = [0,1,2];
			var elements:Elements = new Elements();
			var pointsArray = [];

			elements.add(new ConcreteElement(new utils.OrderedTriple(1, 0, 0)));
			elements.add(new ConcreteElement(new utils.OrderedTriple(0, 1, 0)));
			elements.add(new ConcreteElement(new utils.OrderedTriple(0,0,1)));

			var operation = function(left:groups.ConcreteElement, right:groups.ConcreteElement) {
				var red = ((<utils.OrderedTriple>left.getValue()).x + (<utils.OrderedTriple>right.getValue()).x) % 3;
				var green = ((<utils.OrderedTriple>left.getValue()).y + (<utils.OrderedTriple>right.getValue()).y) % 3;
				var blue = ((<utils.OrderedTriple>left.getValue()).z + (<utils.OrderedTriple>right.getValue()).z) % 3;

				return new groups.ConcreteElement(new utils.OrderedTriple(red, green, blue));
			};

			g = VisualGroup.createGroup(elements, operation);
			g.visualize = function (e:VisualElement) {
				var colorIntensities = [0,100,255];
				//<div style="width:500px;height:100px
				var repr = document.createElement("div");

				repr.style.width = "20px";
				repr.style.height = "20px";
				repr.style.margin = "2px";

				var rVal = colorIntensities[e.getValue().x];
				var gVal = colorIntensities[e.getValue().y];
				var bVal = colorIntensities[e.getValue().z];

				repr.style.backgroundColor =  new utils.OrderedTriple(rVal, gVal, bVal).toRGBHexString();

				return repr;
			};

			return g;
		}
    }
	var bG:Background = new Background();
}
