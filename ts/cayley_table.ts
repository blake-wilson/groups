/// <reference path="group.ts"/>

module groups {

	// Graphical way to represent Cayley Table in HTML

	export class CayleyTable {

		private g:VisualGroup;

		private table:HTMLTableElement;

		constructor(g:VisualGroup) {
			this.g = g;
			this.table = <HTMLTableElement>document.getElementById("cayley_table");
			this.updateTable(g.elements);
		}


		private updateTable(elements:Elements) {
			this.table.innerHTML = "";
			this.table.border = "1px solid #000";

			var row:HTMLElement;
			var col:HTMLElement;

			for (var i = 0; i < elements.size(); i++) {
				row = document.createElement('tr');
				row.style.height = "20px";
				this.table.appendChild(row);

				for (var j = 0; j < elements.size(); j++)
				{
					if ((i == 0 && j == 0) || j == 0) {
						row.onmouseover = function () {
							this.style.backgroundColor = "#ddffdd"
						};
						row.onmouseleave = function () {
							this.style.backgroundColor = "#ffffff"
						};
					}


					col = document.createElement('td');
					col.style.width = "20px";
					col.style.textAlign = "center";
					col.setAttribute("col", j.toString());
					col.onmouseover = function() {
						var col = this.getAttribute("col");
						var tableNodes:NodeList = document.getElementById("cayley_table").childNodes;
						var child:HTMLElement;

						for (var i = 0; i < tableNodes.length; i++) {
							child = <HTMLElement>tableNodes[i].childNodes[col];
							if (child.getAttribute("col") == col)
							{
								child.style.backgroundColor = "#ddffdd";
							}
						}
						this.style.backgroundColor = "#ddddff";
					};
					col.onmouseleave = function() {
						var col = this.getAttribute("col");
						var tableNodes:NodeList = document.getElementById("cayley_table").childNodes;
						var child:HTMLElement;

						for (var i = 0; i < tableNodes.length; i++)
						{
							child = <HTMLElement>tableNodes[i].childNodes[col];
							if (child.getAttribute("col") == col)
								child.style.backgroundColor = "transparent";
						}
					};
					col.setAttribute("title", this.g.elements.get(i).getValue() + "*" + this.g.elements.get(j).getValue());
					col.appendChild(this.g.eltRepr(this.g.operate(this.g.elements.get(i), this.g.elements.get(j))));
					row.appendChild(col);
				}
				this.table.appendChild(row);
			}
		}

//		private highlightColumn() {
//			var col = this.getAttribute("col");
//			var tableNodes:NodeList = this.table.childNodes;
//			var child:HTMLElement;
//
//			for (var i = 0; i < tableNodes.length; i++)
//			{
//				child = tableNodes[i];
//				if (child.col == col)
//					child.style.backgroundColor = "#ddffdd"
//			}
//		}
	}
}