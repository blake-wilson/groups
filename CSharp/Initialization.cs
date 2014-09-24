using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Groups
{

    /// <summary>
    /// A static class for initializing global variables.
    /// </summary>
    public static class Initialization
    {
        /// <summary>
        /// Sets the maximum number of prime numbers to be calculated and stored.
        /// </summary>
        const int MAX_PRIME_NUMBER_SIZE = 500;

        
        /// <summary>
        /// Function to initializing globals.
        /// </summary>
        public static void Init()
        {
            InitGlobals();
            PopulatePrimeNumbers();
        }

        private static void InitGlobals()
        {
            Globals.CayleyTable = new CayleyTable();
            Globals.LatticeRoot = new PH.DataTree.DTreeNode<Group>();
            Globals.PrimeNumbers = new List<int>();
        }

        private static void PopulatePrimeNumbers()
        {
            int number = 0;
            while (Globals.PrimeNumbers.Count < MAX_PRIME_NUMBER_SIZE)
            {
                if (IsPrime(number))
                    Globals.PrimeNumbers.Add(number);
            }
        }

        private static bool IsPrime(int number)
        {
            //Crude prime number calculator
            for (int i = 2; i*i < number; i++)
            {
                if (number % i == 0)
                    return false;
            }
            return true;
        }
    }
}
