using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using PH.DataTree;

namespace Groups
{
    /// <summary>
    /// Class of global variables usable throughout the program.
    /// </summary>
    internal sealed class Globals
    {
        private static CayleyTable _CayleyTable;
        private static DTreeNode<Group> _LatticeRoot;
        private static List<int> _PrimeNumbers;
        private static TreeViewController<Group> _Controller;


        internal static CayleyTable CayleyTable
        {
            get
            {
                return _CayleyTable;
            }

            set
            {
                _CayleyTable = value;
            }
        }

        internal static DTreeNode<Group> LatticeRoot
        {
            get
            {
                return _LatticeRoot;
            }
            set
            {
                _LatticeRoot = value;
            }
        }

        internal static List<int> PrimeNumbers
        {
            get
            {
                return _PrimeNumbers;
            }

            set
            {
                _PrimeNumbers = value;
            }
        }

        internal static TreeViewController<Group> Controller
        {
            get
            {
                return _Controller;
            }
            set
            {
                _Controller = value;
            }
        }
    }
}
