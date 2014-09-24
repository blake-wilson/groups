using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Groups
{
    public class Group : IOperable
    {
        public delegate IElement GroupOperate(IElement element1, IElement element2);

        private List<IElement> elements;
        IElement identity;
        GroupOperate operation;
        private bool isAbelian;
        private bool isCyclic;

        public Group(IElement identity, GroupOperate groupOperation)
        {
            this.isAbelian = false;
            this.isCyclic = false;
            this.Identity = identity;
            elements = new List<IElement>();
            AddElement(identity);
            this.operation = groupOperation;
        }

        /// <summary>
        /// The class constructor.  Sets the parent property of the identity element to the instance of the group.
        /// </summary>
        /// <param name="identity"></param>
        /// <param name="groupOperation"></param>
        /// <param name="elements"></param>
        public Group(IElement identity, GroupOperate groupOperation, List<IElement> elements)
        {
            this.isAbelian = false;
            this.isCyclic = false;
            this.identity = identity;
            this.elements = new List<IElement>();
            AddElement(identity);
            foreach (IElement e in elements)
            {
                if (!this.Elements.Contains(e))
                    AddElement(e);
            }
            this.operation = groupOperation;
        }

        //Will not assign crucial properties of group
        public Group()
        {
            this.elements = new List<IElement>();
            this.isAbelian = false;
            this.isCyclic = false;
        }

        public List<IElement> Elements
        {
            get
            {
                return elements;
            }
            set
            {
                elements = value;
            }
        }

        public IElement Identity
        {
            get
            {
                return identity;
            }
            set
            {
                identity = value;
                identity.Parent = this;
            }
        }

        public GroupOperate Operation
        {
            get
            {
                return operation;
            }
            set
            {
                operation = value;
            }
        }

        public bool IsAbelian
        {
            get
            {
                return isAbelian;
            }
        }

        public bool IsCyclic
        {
            get
            {
                return isCyclic;
            }
        }

        public void AddElement(IElement element)
        {
            element.Parent = this;
            for (int i = 0; i < Elements.Count; i++)
            {
                if (element.Value == identity.Value)
                    return;
            }

            //most recent change -- not tested
            Elements.Add(element);
        }

        public IElement Operate(IElement e1, IElement e2)
        {
            IElement e = operation(e1, e2);
            e.Parent = this;
            return e;
        }

        public int GetOrder(IElement element)
        {
            int order = 1;
            IElement elementCurr = element;
            while (!elementCurr.Equals(identity))
            {
                elementCurr = Operate(elementCurr, element);
                order++;
            }
            return order;
        }

        public IElement GetInverse(IElement element)
        {
            for (int i = 0; i < this.Elements.Count; i++)
            {
                if (Operate(element, Elements[i]).Equals(identity))
                    return Elements[i];
            }

            //Temporary - Should show warning
            return identity;
        }

        public void CalculateGroupProperties()
        {
            if (CheckIfAbelian())
                isAbelian = true;
            else
                isAbelian = false;

            if (CheckIfCyclic())
                isCyclic = true;
            else
                isCyclic = false;
        }

        private bool CheckIfAbelian()
        {
            for (int i = 0; i < Elements.Count; i++)
            {
                for (int j = 0; j < Elements.Count; j++)
                {
                    if (!Operate(Elements[i], Elements[j]).Equals(Operate(Elements[j], Elements[i])))
                        return false;
                }
            }
            return true;
        }

        private bool CheckIfCyclic()
        {
            for (int i = 0; i < Elements.Count; i++)
            {
                if (GetOrder(Elements[i]) == Elements.Count)
                    return true;
            }
            return false;
        }

        public override string ToString()
        {
            if (isCyclic)
                for (int i = 0; i < Elements.Count; i++)
                    if (GetOrder(Elements[i]) == Elements.Count)
                        return "<" + Elements[i].ToString() + ">";
            string returnString = "{";
            for (int i = 0; i < Elements.Count; i++)
            {
                returnString += Elements[i].ToString();
                if (i != Elements.Count - 1)
                    returnString += ", ";
            }
            returnString += "}";
            return returnString;
        }

        public override bool Equals(object obj)
        {
            if (obj == null)
                return false;
            Group g = (Group)obj;

            if (g.Elements.Count != this.Elements.Count)
                return false;

            for (int i = 0; i < Elements.Count; i++)
                if (!(this.Elements.Contains(g.Elements[i])))
                    return false;
            return true;
        }

        #region Events

        public EventHandler OnElementAdded = null;
        public EventHandler OnElementAccessed = null;
        public EventHandler OnElementChanged = null;

        internal void SendElementAdded(IElement element)
        {
            if (OnElementAdded != null)
                OnElementAdded(this, new GroupEventArgs(element, EElementEvent.ElementAdded)); 
        }

        internal void SendElementAccessed(IElement element)
        {
            if (OnElementAccessed != null)
                OnElementAccessed(this, new GroupEventArgs(element, EElementEvent.ElementAccessed));
        }

        internal void SendElementChanged(IElement element)
        {
            if (OnElementChanged != null)
                OnElementChanged(this, new GroupEventArgs(element, EElementEvent.ElementChanged));
        }

        #endregion  //  Events
    }
}

