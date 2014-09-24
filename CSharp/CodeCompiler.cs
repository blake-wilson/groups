using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.CSharp;
using System.Windows.Forms;
using System.CodeDom.Compiler;
using System.Reflection;
using System.IO;

namespace Groups
{
    /// <summary>
    /// Class that compiles group operations specified by user.
    /// </summary>
    class CodeCompiler
    {

        private string prefix = "using System;" + "using System.Linq;" +
            "namespace Groups{" +
            "public static class Driver" +
            "{" +
            "   public static Group.GroupOperate Run()" +
            "   {";

        private string postfix = "};" +
            "return gO;" + 
            "}" +
            "}" +
            "}";

        public static Assembly CompileCode(string code)
        {
            // Create a code provider
            Microsoft.CSharp.CSharpCodeProvider csProvider = new Microsoft.CSharp.CSharpCodeProvider();

            // Setup our options
            CompilerParameters options = new CompilerParameters();
            options.GenerateExecutable = false; // we want a Dll (or "Class Library" as its called in .Net)
            options.GenerateInMemory = true; // Saves us from deleting the Dll when we are done with it, though you could set this to false and save start-up time by next time by not having to re-compile
            // And set any others you want, there a quite a few, take some time to look through them all and decide which fit your application best!

            // Add any references you want the users to be able to access, be warned that giving them access to some classes can allow
            // harmful code to be written and executed. I recommend that you write your own Class library that is the only reference it allows
            // thus they can only do the things you want them to.
            options.ReferencedAssemblies.Add(Assembly.GetExecutingAssembly().Location);
            options.ReferencedAssemblies.Add("System.Core.dll");
            // Compile our code
            CompilerResults result;
            result = csProvider.CompileAssemblyFromSource(options, code);

            if (result.Errors.HasErrors)
            {
                // TODO: report back to the user that the script has errored
                return null;
            }

            if (result.Errors.HasWarnings)
            {
                // TODO: tell the user about the warnings, might want to prompt them if they want to continue
                // runnning the "script"
            }

            return result.CompiledAssembly;
        }

        /// <summary>
        /// Compiles the given code and runs it.
        /// </summary>
        /// <param name="input"></param>
        /// <param name="hasError"></param>
        /// <returns></returns>
        public Group.GroupOperate CompileAndRun(string input, out bool hasError)
        {
            hasError = false;
            string returnData = null;
            Group.GroupOperate gO = null;
            CompilerResults results = null;

            using (CSharpCodeProvider provider = new CSharpCodeProvider())
            {
                CompilerParameters options = new CompilerParameters();
                options.GenerateInMemory = true;
                options.ReferencedAssemblies.Add(Assembly.GetExecutingAssembly().Location);
                options.ReferencedAssemblies.Add("System.Core.dll");

                StringBuilder sb = new StringBuilder();
                sb.Append(prefix);
                sb.Append(input);
                sb.Append(postfix);

                results = provider.CompileAssemblyFromSource(options, sb.ToString());
            }

            if (results.Errors.HasErrors)
            {
                hasError = true;
                StringBuilder errorMessage = new StringBuilder();
                foreach (CompilerError error in results.Errors)
                {
                    errorMessage.AppendFormat("{0} {1}", error.Line, error.ErrorText);
                }
                returnData = errorMessage.ToString();
            }
            else
            {
                //TextWriter temp = Console.Out;
                //StringWriter writer = new StringWriter();
                //Console.SetOut(writer);
                Type driverType = results.CompiledAssembly.GetType("Groups.Driver");
                gO = (Group.GroupOperate)driverType.InvokeMember("Run", BindingFlags.InvokeMethod |
                    BindingFlags.Static | BindingFlags.Public, null, null,
                    null);
                //Console.SetOut(temp);
                //returnData = writer.ToString();
            }
            return gO;
        }
    }
}
