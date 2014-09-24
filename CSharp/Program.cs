using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Forms;

namespace Groups
{
    static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            //Create a group
            int modulus = 10;
            Group.GroupOperate gO = (param1, param2) =>
            {
                Element x = new Element((Int32.Parse(param1.ToString()) + Int32.Parse(param2.ToString()) % modulus).ToString());
                return x;
            };

            Group g = new Group();
            g.Operation = gO;
            g.Identity = new Element("0", g);
            //g = new Group(new Element("0"), gO); 
            for (int i = 0; i < 10; i++)
            {
                g.AddElement(new Element(i.ToString(), g));
            }

            //Perform initialization tasks
            Initialization.Init();

            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new Form1());
        }
    }
}
