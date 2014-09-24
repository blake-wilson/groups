using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Facet.Combinatorics;

namespace Groups
{
    /// <summary>
    /// A class for calculating and managing the subgroups of a group.
    /// </summary>
    class SubgroupManager
    {
        List<Group> subgroups;
        Group group;
        Dictionary<int, int> primeNumbers;
        PH.DataTree.DTreeNode<Group> temp;

        
        /// <summary>
        /// The class constructor.
        /// </summary>
        /// <param name="g"></param>
        public SubgroupManager(Group g)
        {
            group = g;
            subgroups = new List<Group>();
            primeNumbers = new Dictionary<int, int>(g.Elements.Count);
            temp = new PH.DataTree.DTreeNode<Group>();
        }
        
        /// <summary>
        /// Finds the subgroups of the group given to the subgroup manager and populates the global subgroup lattice with these subgroups.
        /// </summary>
        /// <returns></returns>
        public List<Group> FindSubgroups()
        {
            //Clear the subgroup lattice
            Globals.LatticeRoot.Nodes.Clear();

            //If a group is cyclic it has exactly one subgroup for each divisor of the order of the group
            if (group.IsCyclic)
            {
                subgroups = CalcSubgroupsOfCyclic(group);
            }

            /*
            else if (group.IsAbelian)
            {

            }
            */

            else
            {
                subgroups = CalcSubgroupsByBruteForce(group);
            }

            //Look for a better way
            temp = Globals.LatticeRoot;
            PopulateLattice(group);
            Globals.LatticeRoot = temp.Root.RootNode;

            foreach (Group g in subgroups)
            {
                g.CalculateGroupProperties();
            }
            return subgroups;
        }
        
        /// <summary>
        /// Finds subgroups of the given group.
        /// </summary>
        /// <param name="g"></param>
        /// <returns></returns>
        public List<Group> FindSubgroups(Group g)
        {
            //List of subgroups to return
            List<Group> sgroups = new List<Group>();

            //If a group is cyclic it has exactly one subgroup for each divisor of the order of the group
            if (g.IsCyclic)
            {
                List<int> divisors = GetDivisors(g.Elements.Count);
                for (int i = 0; i < divisors.Count; i++)
                {
                    int j;
                    for (j = 0; j < g.Elements.Count; j++)
                    {
                        //if (group.GetOrder(group.Elements[j]) % divisors[i] == 0)
                        if (divisors[i] == GCD(g.GetOrder(g.Elements[j]), g.Elements.Count))
                            break;
                    }

                    //Add the subgroup only if it is not equal to the original group
                    if (j != g.Elements.Count)
                        sgroups.Add(new Group(g.Identity, g.Operation, GenerateGroup(g.Elements[j]).Elements));
                }
            }
            

            /*
            else if (g.IsAbelian)
            {

            }
            */

            else
            {
                sgroups = CalcSubgroupsByBruteForce(g);
            }

            foreach (Group s in sgroups)
            {
                s.CalculateGroupProperties();
            }
            return sgroups;
        }

        public Group[] FindSubgroupsByOSST(Group g)
        {
            //Use Lagrange's Theorem to narrow options
            List<int> possibleOrders = GetDivisors(g.Elements.Count);
            List<Element> elementsRemoved;

            return null;
        }

        private void PopulateLattice2()
        {
            PH.DataTree.DTreeNode<Group> temp;

            for (int i = 0; i < subgroups.Count; i++)
            {
                for (int j = 0; j < subgroups.Count; j++)
                {
                    int largerSetIndex = 0;
                    int smallerSetIndex = 0;
                    if (subgroups[i].Elements.Count >= subgroups[j].Elements.Count)
                    {
                        largerSetIndex = i;
                        smallerSetIndex = j;
                    }
                    else
                    {
                        largerSetIndex = j;
                        smallerSetIndex = i;
                    }
                    
                    if (IsSubset(subgroups[largerSetIndex], subgroups[smallerSetIndex]))
                    {
                        if (Globals.LatticeRoot.Depth == 0)
                        {
                            Globals.LatticeRoot.Nodes.Add(subgroups[smallerSetIndex]);
                        }
                        else
                        {
                            temp = Globals.LatticeRoot.Nodes.Add(subgroups[smallerSetIndex]);
                        }
                    }

                    foreach (Group g in Globals.LatticeRoot.DepthFirstEnumerator)
                    {
                        
                    }
                }
            }
        }

        private void PopulateLattice(Group g)
        {
            List<Group> sgroups = new List<Group>();
            sgroups = FindSubgroups(g);

            foreach (Group s in sgroups)
            {
                if (sgroups.Count > 1)
                {
                    //temp = temp.Nodes.Add(s);
                    Globals.LatticeRoot = Globals.LatticeRoot.Nodes.Add(s);
                    PopulateLattice(s);
                    Globals.LatticeRoot = Globals.LatticeRoot.Parent;
                    //temp = temp.Parent;
                }
            }

        }

        private Group GenerateGroup(IElement e)
        {
            IElement original = e;
            Group generatedGroup = new Group(group.Identity, group.Operation);
            
            while (!e.Equals(group.Identity))
            {
                generatedGroup.AddElement(e);
                e = group.Operate(e, original);
            }
            return generatedGroup;
        }

        //Check if second group is a subset of the first
        private bool IsSubset(Group group1, Group group2)
        {
            ElementEqualityComparer e = new ElementEqualityComparer();

            //If the second group contains more elements than the first, it is clearly not a subset
            if (group2.Elements.Count > group1.Elements.Count)
                return false;
            
            for (int i = 0; i < group1.Elements.Count; i++)
            {
                if (!group1.Elements.Contains(group2.Elements[i], e))
                    return false;
            }

            return true;
        }

        private bool Reduce(Group g, List<Element> testSet, List<Element> elementsRemoved)
        {
            for (int i = 0; i < testSet.Count; i++)
            {
                while (g.Elements.Count % testSet.Count != 0)
                {
                    
                }
            }
            return false;
        }

        public bool OneStepSubgroupTest(Group g, List<IElement> testSet)
        {
            foreach (IElement e in testSet)
            {
                for (int i = 0; i < testSet.Count; i++)
                {
                    if (!testSet.Contains(g.Operate(e, g.GetInverse(testSet[i]))))
                        return false;
                }
            }
            return true;
        }

        private static List<int> GetDivisors(int order)
        {
            List<int> divisors = new List<int>();
            for (int i = 1; i <= order / 2; i++)
            {
                if (order % i == 0)
                    divisors.Add(i);
            }
            return divisors;
        }

        private static int GCD(int a, int b)
        {
            int gcd = 1;

            for (int i = 1; i <= Math.Min(a, b); i++)
            {
                if ((a % i == 0) && (b % i) == 0)
                    gcd = i;
            }
            return gcd;
        }

        private IEnumerable<int> GetPrimeFactors(int value, Eratosthenes eratosthenes)
        {
            List<int> factors = new List<int>();

            foreach (int prime in eratosthenes)
            {
                while (value % prime == 0)
                {
                    value /= prime;
                    factors.Add(prime);
                }

                if (value == 1)
                    break;
            }

            return factors;
        }

        private bool IsPrime(int number)
        {
            if (Globals.PrimeNumbers.Contains(number))
                return true;

            return false;
        }

        //Assumes group is cycic --check this for all calls to this function
        /// <summary>
        /// Calculates the subgroups of a given cyclic group.
        /// </summary>
        /// <param name="group"></param>
        /// <returns></returns>
        public List<Group> CalcSubgroupsOfCyclic(Group group)
        {
            List<Group> sGroups = new List<Group>();
            List<int> divisors = GetDivisors(group.Elements.Count);
            for (int i = 0; i < divisors.Count; i++)
            {
                int j;
                for (j = 0; j < group.Elements.Count; j++)
                {
                    //if (group.GetOrder(group.Elements[j]) % divisors[i] == 0)
                    if (divisors[i] == GCD(group.GetOrder(group.Elements[j]), group.Elements.Count))
                        break;
                }

                //Add the subgroup only if it is not equal to the original group
                if (j != group.Elements.Count)
                    sGroups.Add(new Group(group.Identity, group.Operation, GenerateGroup(group.Elements[j]).Elements));
            }
            return sGroups;
        }

        /// <summary>
        /// Calculates the subgroups of the given group by a slow method.
        /// </summary>
        /// <param name="group"></param>
        /// <returns></returns>
        public List<Group> CalcSubgroupsByBruteForce(Group group)
        {
            List<Group> sGroups = new List<Group>();
            for (int i = 1; i < group.Elements.Count; i++)
            {
                if (group.Elements.Count % i == 0)
                {
                    Combinations<IElement> combinations = new Combinations<IElement>(group.Elements, i);
                    foreach (List<IElement> potentialGroup in combinations)
                    {
                        if (OneStepSubgroupTest(group, potentialGroup))
                        {
                            if (!potentialGroup.Equals(group))
                                sGroups.Add(new Group(group.Identity, group.Operation, potentialGroup));
                        }
                    }
                }
            }
            return sGroups;
        }
    }
}
