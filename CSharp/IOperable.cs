using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Groups
{
    interface IOperable
    {
        IElement Operate(IElement element1, IElement element2);
    }
}
