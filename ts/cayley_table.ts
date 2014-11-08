/// <reference path="group.ts"/>
/// <reference path="Signal.ts" />

module groups {

	// Graphical way to represent Cayley Table in HTML


	export class CayleyTable {

		private g:VisualGroup;

		private table:HTMLTableElement;

		toggleReprCheckbox:HTMLInputElement;

		nRows:number = 0;
		private elementsResults:Collection<VisualElement>;

		private showVisual:boolean = true;

		private refreshSignal:Signal;

	    private static operandBGHighlightColor:string = "#7777dd";
		private static sameRowColHighlightColor:string = "#ddddff";

		constructor(g:VisualGroup) {
			this.g = g;
			this.table = <HTMLTableElement>document.getElementById("cayley_table");
			this.elementsResults = new Collection<VisualElement>();
			this.updateTable(g.elements);

			//bind event listeners
			this.refreshSignal = new Signal();
			this.toggleReprCheckbox = <HTMLInputElement>document.getElementById("graphical_table");
			this.toggleReprCheckbox.checked = true;
			this.addListeners();
		}

		private addListeners() {
			this.refreshSignal.add( () => {
				this.toggleVisualization();
			});

			this.toggleReprCheckbox.addEventListener("click", () => {this.refreshSignal.dispatch()});
		}

		private toggleVisualization() {
			this.showVisual = (<HTMLInputElement>document.getElementById("graphical_table")).checked;
			this.displayGroup();
		}

		displayGroup() {
			var tableCell:HTMLElement;

			for (var i = 0; i < this.nRows; i++) {

				for (var j = 0; j < this.nRows; j++) {
					tableCell = <HTMLElement>this.table.childNodes[i].childNodes[j];

					//clear tablecell.
					tableCell.innerHTML = '';

					//todo: Get rid of these casts......
					if (i != 0 && j != 0) {
						tableCell.setAttribute("title", this.g.elements.get(i).getValue() + "*" + this.g.elements.get(j).getValue());
						tableCell.appendChild(this.drawTableCell(this.elementsResults.get(i * this.nRows + j)));
					}
					else {
						if (j == 0) {
							tableCell.setAttribute("title", this.g.elements.get(i).getValue());
							tableCell.appendChild(this.drawTableCell(<VisualElement>(this.g.elements.get(i))));
						}
						else {
							tableCell.setAttribute("title", this.g.elements.get(j).getValue());
							tableCell.appendChild(this.drawTableCell(<VisualElement>(this.g.elements.get(j))));
						}
					}
				}
			}
		}

		private drawTableCell(e:VisualElement):HTMLElement {
			if (this.showVisual) {
				return this.g.eltRepr(e);
			}
			else {
				var text:HTMLElement = document.createElement("span");
				var content:Text = document.createTextNode(e.toString());
				text.appendChild(content);
				return text;
			}
		}

		public toggleRepresentation() {
			this.showVisual = ! this.showVisual;

			// redraw table
			this.displayGroup();
		}


		private updateTable(elements:Elements) {
			this.table.innerHTML = "";
			this.table.border = "1px solid #000";

			var row:HTMLElement;
			var col:HTMLElement;

			this.nRows = elements.size();

			for (var i = 0; i < elements.size(); i++) {
				row = document.createElement('tr');
				row.style.height = "20px";
				this.table.appendChild(row);

				for (var j = 0; j < elements.size(); j++)
				{
					col = document.createElement('td');
					//col.style.width = "20px";
					col.style.textAlign = "center";

					col.setAttribute("row", i.toString());
					col.setAttribute("col", j.toString());

					col.onmouseover = function() {
						var col = this.getAttribute("col");
						var row = this.getAttribute("row");

						var tableNodes:NodeList = document.getElementById("cayley_table").childNodes;
						var child:HTMLElement;

						for (var i = 0; i < tableNodes.length; i++) {
							child = <HTMLElement>tableNodes[i].childNodes[col];
							if (child.getAttribute("col") == col)
							{
								if (child.getAttribute("row") == "0")
									child.style.backgroundColor = CayleyTable.operandBGHighlightColor;
								else
									child.style.backgroundColor = CayleyTable.sameRowColHighlightColor;
							}

							(<HTMLElement>tableNodes[row].childNodes[0]).style.backgroundColor = CayleyTable.operandBGHighlightColor;
						}

						// Color everything in the same row the specified color.
						for (var i = 1; i < tableNodes.length; i++) {
							(<HTMLElement>tableNodes[row].childNodes[i]).style.backgroundColor = CayleyTable.sameRowColHighlightColor;
						}

						this.style.backgroundColor = "transparent";
					};
					col.onmouseleave = function() {
						var col = this.getAttribute("col");
						var row = this.getAttribute("row");

						var tableNodes:NodeList = document.getElementById("cayley_table").childNodes;
						var child:HTMLElement;

						for (var i = 0; i < tableNodes.length; i++)
						{
							for (var j = 0; j < tableNodes.length; j++) {
								child = <HTMLElement>tableNodes[i].childNodes[j];
								child.style.backgroundColor = "transparent";
							}
						}
					};

					this.elementsResults.add(this.g.operate(<VisualElement>(this.g.elements.get(i)), <VisualElement>(this.g.elements.get(j))));

					row.appendChild(col);
				}
				this.table.appendChild(row);
			}

			this.displayGroup();
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