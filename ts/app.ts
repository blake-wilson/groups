/// <reference path="group.ts"/>
/// <reference path="cayley_table.ts"/>
/// <reference path="../third_party/jquery.d.ts"/>

module group_app {
    class Background {

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
	        var g:groups.Group = new groups.Group(identity, operation, elements);

	        var table:groups.CayleyTable = new groups.CayleyTable(g);
        }
    }
	var bG:Background = new Background();
}
