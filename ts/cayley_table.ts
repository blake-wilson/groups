/// <reference path="group.ts"/>

module groups {

	// Graphical way to represent Cayley Table in HTML

	class CayleyTable {

		private g:Group;

		private table:HTMLElement;

		constructor(g:Group) {
			this.g = g;
			this.table = document.getElementById("cayley_table");
			this.updateTable(g.elements);
		}


		private updateTable(elements:Collection<Element>) {
			this.table.innerHTML = "";
			for (var i = 0; i < elements.size(); i++) {
				this.table.innerHTML += "<tr>";
				for (var j = 0; j < elements.size(); j++)
					this.table.innerHTML+="<td>" +
						this.g.operate(this.g.elements.get(j), this.g.elements.get(i)) +
					"</td>";
			}
			this.table.innerHTML += "</tr>"
		}
	}
}