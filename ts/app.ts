/// <reference path="group.ts"/>
/// <reference path="cayley_table.ts"/>
/// <reference path="subgroup_helper.ts"/>
/// <reference path="utils.ts"/>

module group_app {

	import Group = groups.Group;
	import Element = groups.Element;
	import Elements = groups.Elements;
	import Collection = groups.Collection;
	import SubgroupHelper = groups.SubgroupHelper;

	class Background {

		private g:Group;

		//HTML Elements
		private subgroupsList:HTMLElement;
		private propertiesList:HTMLElement;

		//subgroups
		private subgroups: Collection<Group>;
		private helper:SubgroupHelper;

        constructor() {
            // create a group
            var modulus:number = 12;
	        var identity:groups.Element = new groups.Element(0);

	        console.log("ident set");

	        var operation:groups.GroupOperation = function(left:groups.Element, right:groups.Element) {
		        return new groups.Element((left.value + right.value) % modulus);
	        };

	        var elements:groups.Collection<groups.Element> = new groups.Collection<groups.Element>();
	        for (var i = 0; i < 12; i++)
	            elements.add(new groups.Element(i));

	        console.log(elements.size());
	        this.g = new Group(identity, operation, elements);

	        //var table:groups.CayleyTable = new groups.CayleyTable(this.g);
			var table:groups.CayleyTable = new groups.CayleyTable(this.colorGroupSample());

	        this.helper = new SubgroupHelper(this.g);

	        this.subgroups = this.helper.calcSubgroups();

	        this.subgroupsList = document.getElementById("subgroupsList");
	        this.propertiesList = document.getElementById("propertiesList");

	        this.displaySubgroups();
	        this.displayGroupProperties();
        }

		private displaySubgroups() {
			this.subgroupsList.innerHTML = "";
			var listItem:HTMLElement;
			var groupText:Text;

			for (var i = 0; i < this.subgroups.size(); i++) {
				listItem = document.createElement("li");
				groupText = document.createTextNode(this.subgroups.get(i).repr());

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

		private colorGroupSample(): Group {
			var g: Group;
			var steps = [100,200,255];
			var elements:Elements = new Elements();
			var pointsArray = [];

			for (var i = 0; i < 3; i++) {
				for (var j = 0; j < 3; j++) {
					if (j == 0)
						elements.add(new Element(new utils.RGB(steps[j], 0, 0)));
					else if (j == 1)
						elements.add(new Element(new utils.RGB(0, steps[j], 0)));
					else if (j == 2)
						elements.add(new Element(new utils.RGB(0,0,steps[j])));
				}
			}

			var operation = function(left:groups.Element, right:groups.Element) {
				var red = (<utils.RGB>left.value).red + (<utils.RGB>right.value).red % 255;
				var green = (<utils.RGB>left.value).green + (<utils.RGB>right.value).green % 255;
				var blue = (<utils.RGB>left.value).blue + (<utils.RGB>right.value).blue % 255;

				return new groups.Element(new utils.RGB(red, green, blue));
			};

			g = Group.createGroup(elements, operation);
			g.elementVisual = function (e:Element) {
				//<div style="width:500px;height:100px
				var repr = document.createElement("div");
				repr.setAttribute("width", "20px");
				repr.setAttribute("height", "20px");
				repr.style.backgroundColor = "#" + this.red.toString(16) +
					this.green.toString(16) + this.blue.toString(16);

				return repr;
			};

			return g;
		}
    }
	var bG:Background = new Background();
}
