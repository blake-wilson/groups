using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Groups
{
    public interface IElement
    {
        Object Value { get; set; }

        Group Parent { get; set; }

        //IElement Operate(IElement e1, IElement e2);
    }
}
