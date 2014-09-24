using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Groups
{
    /// <summary>
    /// Class to calculate and store the Cayley Table for a group.
    /// </summary>
    class CayleyTable
    {
        //private IElement[][] cayleyTable;
        private int row;
        private List<List<IElement>> cayleyTable;

        /// <summary>
        /// The class constructor.
        /// </summary>
        public CayleyTable()
        {
        }

        /// <summary>
        /// The class constructor.
        /// </summary>
        /// <param name="g"></param>
        public CayleyTable(Group g)
        {
            /*
            cayleyTable = new IElement[g.Elements.Count][];          
            for (int i = 0; i < g.Elements.Count; i++)
            {
                cayleyTable[i] = new Element[g.Elements.Count];
                cayleyTable[i] = new List<IElement>();
                for (int j = 0; j < g.Elements.Count; j++)
                    cayleyTable[i][j] = new Element("0");
            }
            for (int i = 0; i < g.Elements.Count; i++)
            {
                cayleyTable[i] = new Element[g.Elements.Count];      
                
                for (int j = 0; j < g.Elements.Count; j++)
                {
                    cayleyTable[i][0] = g.Elements[i];
                    cayleyTable[0][j] = g.Elements[j];
                }
            }
            */
            cayleyTable = new List<List<IElement>>(g.Elements.Count);

            //Add as many lists as there are elements to the Cayley table.
            for (int i = 0; i < g.Elements.Count; i++)
            {
                cayleyTable.Add(new List<IElement>());
            }
            GenerateTable(g);
            row = 0;
        }

        //TODO: Make sure elements have been added to cayley table
        /// <summary>
        /// Generates a Cayley Table in the class for the given group.
        /// </summary>
        /// <param name="g"></param>
        public void GenerateTable(Group g)
        {
            for (int i = 0; i < g.Elements.Count; i++)
            {
                cayleyTable.Add(new List<IElement>());
                for (int j = 0; j < g.Elements.Count; j++)
                {
                    //Fix so that groups must inheirit operate method
                    //cayleyTable[i][j] = g.Operate(g.Elements[i], g.Elements[j]);
                    cayleyTable[i].Add(g.Operate(g.Elements[i], g.Elements[j]));
                }
            }
        }

        /// <summary>
        /// Gets the next row from the Cayley Table (Row is kept track of).
        /// </summary>
        /// <returns></returns>
        public string[] GetNextRow()
        {
            int row2 = row;
            row++;
            string[] cTVals = new string[cayleyTable[row2].Count];
            for (int i = 0; i < cayleyTable[row2].Count; i++)
            {
                cTVals[i] = cayleyTable[row2][i].ToString();
            }
            //return cayleyTable[row2];
            return cTVals;
        }
    }
}
