using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Groups
{
    /// <summary>
    /// Class for elements of a dihedral group.
    /// </summary>
    class DihedralElement : IElement
    {

        private int numRotations;

        private Group parent;

        DihedralProperties value;

        private bool isRotation;
        private bool isReflection;

        /// <summary>
        /// The class constructor.
        /// </summary>
        /// <param name="groupOrder"></param>
        /// <param name="isRotation"></param>
        public DihedralElement(int groupOrder, bool isRotation, int rotrefl)
        {
            if (groupOrder % 2 == 0)
                numRotations = groupOrder / 2;
            else
                Console.WriteLine("Dihedral group must have even order");
            this.isReflection = !isRotation;
            this.isRotation = isRotation;

            if (isRotation)
                this.Value = new DihedralProperties { rot = rotrefl, refl = 0 };
            else
                this.value = new DihedralProperties { rot = 0, refl = rotrefl };
        }


        public bool IsReflection
        {
            get
            {
                return isReflection;
            }
            set
            {
                isReflection = value;
                isRotation = !value;
            }
        }

        public bool IsRotation
        {
            get
            {
                return isRotation;
            }
            set
            {
                isRotation = value;
                isReflection = !value;
            }
        }

        public int NumRotations
        {
            get
            {
                return numRotations;
            }
            set
            {
                numRotations = value;
            }
        }
        public object Value
        {
            get
            {
                return value;
            }
            set
            {
                this.value = (DihedralProperties)value;
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

        public override bool Equals(object obj)
        {
            if (obj == null)
                return false;
            DihedralElement dE = (DihedralElement)obj;
            if (dE.IsRotation != this.IsRotation)
                return false;
            if ((dE.value.rot == this.value.rot) && (dE.value.refl == this.value.refl))
                return true;
            return false;
        }

        public struct DihedralProperties
        {
            public int rot;
            public int refl;
        }

        public override string ToString()
        {
            if (isRotation)
                return "R" + value.rot.ToString();
            else 
                return "S" + value.refl.ToString();
        }

    }
}
