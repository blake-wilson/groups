using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using PH.DataTree;

namespace Groups
{
    class SubgroupLattice
    {
        //private List<Group> subgroups;
        private DTreeNode<Group> latticeRoot;

        public SubgroupLattice()
        {
            latticeRoot = new DTreeNode<Group>();
        }

        public void UpdateLattice(Group group)
        {
            
        }
    }
}
