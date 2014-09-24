using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Groups
{
    /// <summary>
    /// Class for generating a group from the given elements.
    /// </summary>
    class GroupGenerator
    {

        List<IElement> elements;
        Group.GroupOperate operation;
        IElement identity;
        Group generatedGroup;

        /// <summary>
        /// The class constructor.  The constructor creates the necessary components of the group.
        /// </summary>
        /// <param name="elements"></param>
        /// <param name="operation"></param>
        /// <param name="identity"></param>
        public GroupGenerator(List<IElement> elements, Group.GroupOperate operation, IElement identity)
        {
            this.elements = new List<IElement>();
            this.elements.Add(identity);

            for (int i = 0; i < elements.Count; i++)
                this.elements.Add(elements[i]);
            
            this.operation = operation;
            this.identity = identity;

            generatedGroup = new Group(identity, operation, elements);

            //Remove duplicate-valued elements
            for (int i = 0; i < elements.Count; i++)
            {
                for (int j = 1; j < elements.Count; j++)
                {
                    if (elements[i] == elements[j] && i != j)
                    {
                        elements.RemoveAt(j);
                        j--;
                    }
                }
            }

            ElementEqualityComparer eeq = new ElementEqualityComparer();

            for (int i = 0; i < generatedGroup.Elements.Count; i++)
            {
                for (int j = 0; j < generatedGroup.Elements.Count; j++)
                {
                    if (!(generatedGroup.Elements.Contains(generatedGroup.Operate(generatedGroup.Elements[j], generatedGroup.Elements[i]), eeq)))
                    {
                        generatedGroup.AddElement(operation(generatedGroup.Elements[j], generatedGroup.Elements[i]));
                    }
                }
            }
        }


        /// <summary>
        /// Returns a group generated in the constructor.
        /// </summary>
        /// <returns></returns>
        public Group CreateGroup()
        {
            //return new Group(identity, operation, elements);
            return generatedGroup;
        }
    }
}
