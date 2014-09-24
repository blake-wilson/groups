using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Groups
{
    /// <summary>
    /// A class for static math functions that .NET does not provide.
    /// </summary>
    class MathFuncs
    {

        public static int ModAdd(int num1, int num2, int modulus)
        {
            if ((num1 + num2) % modulus >= 0)
                return (num1 + num2) % modulus;
            else
            {
                return (modulus - ((num1 + num2) % modulus));
            }
        }

        public static int ModSubt(int num1, int num2, int modulus)
        {
            if ((num1 - num2) % modulus >= 0)
                return (num1 - num2) % modulus;
            else
            {
                return (modulus + ((num1 - num2) % modulus));
            }
        }

    }
}
