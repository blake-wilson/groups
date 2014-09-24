using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Groups
{

    /// <summary>
    /// A basic element class which stores the value of the element as a string.
    /// </summary>
    public class Element : IElement
    {
        private string value;
        private Group parent;

        /// <summary>
        /// Value property.
        /// </summary>
        public object Value
        {
            get
            {
                parent.SendElementAccessed(this);
                return value;
            }
            set
            {
                this.value = (string)value;
            }
        }

        /// <summary>
        /// Parent Property
        /// </summary>
        public Group Parent
        {
            get
            {
                return parent;
            }
            set
            {
                parent = value;
            }
        }

        /// <summary>
        /// The class constructor.
        /// </summary>
        /// <param name="value"></param>
        public Element(string value)
        {
            this.value = value;
        }

        public Element(string value, Group parent)
        {
            this.value = value;
            this.parent = parent;
        }

        public static bool operator == (Element e1, Element e2)
        {
            if ((object)e2 == null)
                return false;

            string val1 = (string)e1.value;
            string val2 = (string)e2.value;

            if (val1.Equals(val2))
                return true;

            return false;
        }

        public static bool operator != (Element e1, Element e2)
        {
            return !(e1 == e2);
        }
        public override bool Equals(object obj)
        {
            Element e = obj as Element;
            if (e != null)
            {
                string val1 = (string)this.value;
                string val2 = (string)e.value;

                if (val1.Equals(val2))
                    return true;
            }
            return false;
            //return base.Equals(obj);
        }

        public override int GetHashCode()
        {
            return base.GetHashCode();
        }

        public override string ToString()
        {
            return value;       
        }
    }

    /// <summary>
    /// An interface to use for comparing elements.
    /// </summary>
    class ElementEqualityComparer : IEqualityComparer<IElement>
    {
        public bool Equals(IElement e1, IElement e2)
        {
            if (e1.Equals(e2))
                return true;
            return false;
        }

        public int GetHashCode(IElement e)
        {
            return base.GetHashCode();
        }
    }

    public enum EElementEvent
    {
        ElementAccessed,
        ElementChanged,
        ElementAdded,
    }

    public class GroupEventArgs : EventArgs
    {

        /// <summary>
        /// The element for which the event was raised.
        /// </summary>
        public IElement element;

        /// <summary>
        /// <list>
        ///     <item>ElementAccessed: the get - accessor for the element.Value was called.</item>
        ///     <item>ElementChanged: A new value was assigned to the element.Value property.</item>
        /// </list>
        /// </summary>
        public EElementEvent eltEvent;

        public GroupEventArgs(IElement element, EElementEvent eltEvent)
        {
            this.element = element;
            this.eltEvent = eltEvent;
        }

    }
}
