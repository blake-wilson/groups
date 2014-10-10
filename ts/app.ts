/// <reference path="group.ts"/>
/// <reference path="cayley_table.ts"/>
/// <reference path="subgroup_helper.ts"/>

module group_app {

	import Group = groups.Group;
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
            var modulus:number = 15;
	        var identity:groups.Element = new groups.Element(0);

	        console.log("ident set");

	        var operation:groups.GroupOperation = function(left:groups.Element, right:groups.Element) {
		        return new groups.Element((left.value + right.value) % modulus);
	        };

	        var elements:groups.Collection<groups.Element> = new groups.Collection<groups.Element>();
	        for (var i = 0; i < 15; i++)
	            elements.add(new groups.Element(i));

	        console.log(elements.size());
	        this.g = new Group(identity, operation, elements);

	        var table:groups.CayleyTable = new groups.CayleyTable(this.g);

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
    }
	var bG:Background = new Background();
}
