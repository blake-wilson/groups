/// <reference path="group.ts"/>

module groups {

	// Graphical way to represent Cayley Table in HTML

	export class CayleyTable {

		private g:Group;

		private table:HTMLTableElement;

		constructor(g:Group) {
			this.g = g;
			this.table = <HTMLTableElement>document.getElementById("cayley_table");
			this.updateTable(g.elements);
		}


		private updateTable(elements:Collection<Element>) {
			this.table.innerHTML = "";
			this.table.border = "1px solid #000";

			var row:HTMLElement;
			var col:HTMLElement;

			for (var i = 0; i < elements.size(); i++) {
				row = document.createElement('tr');
				row.style.height = "20px";
				this.table.appendChild(row);
				for (var j = 0; j < elements.size(); j++) {
					col = document.createElement('td');
					col.style.width = "20px";
					col.style.textAlign = "center";
					if ((j + i) % 2 == 0)
						col.style.backgroundColor = "#dfdfdf";
					else
						col.style.backgroundColor = "#ffffff";
					col.appendChild(document.createTextNode(this.g.operate(this.g.elements.get(j), this.g.elements.get(i)).value));
					row.appendChild(col);
				}
				this.table.appendChild(row);
			}
		}
	}
}