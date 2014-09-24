using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Groups
{
    class IntegerElement : IElement
    {
        private int modulus;
        private string value;
        private Group parent;

        public IntegerElement(int value)
        {
            this.value = value.ToString();
        }

        public IElement Operate(IElement e1, IElement e2)
        {
            IntegerElement returnVal = new IntegerElement(this.modulus);
            returnVal.value = (Int32.Parse(e1.ToString()) + Int32.Parse(e2.ToString()) % modulus).ToString();
            return null;
        }

        public object Value
        {
            get
            {
                return value;
            }
            set
            {
                this.value = (string)value;
            }
        }

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

        public IElement GetNewInstance()
        {
            return new IntegerElement(0);
        }
    }
}
