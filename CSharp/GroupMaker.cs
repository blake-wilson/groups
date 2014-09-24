using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace Groups
{
    public partial class GroupMaker : Form
    {
        private Group g;
        private DataGridView cayleyTable;

        //Labels referenced from main form
        Label lblGroupOpResult;
        Form1.LabelFiller lblFiller;

        public GroupMaker(Group g, DataGridView cayleyTable, Label lblGroupOpResult, Form1.LabelFiller lblFiller)
        {
            this.g = g;
            this.cayleyTable = cayleyTable;
            InitializeComponent();
            this.lblGroupOpResult = lblGroupOpResult;
            this.lblFiller = lblFiller;
        }

        private void btnGenerate_Click(object sender, EventArgs e)
        {
            CodeCompiler cc = new CodeCompiler();
            bool isError;
            StringBuilder sb = new StringBuilder();
            sb.Append("Group.GroupOperate gO = (x, y) =>"
                + "{"); //+
                //"Element x = new Element");
            string argString = sb.ToString() + txtGroupOp.Text;
            Group.GroupOperate gO = cc.CompileAndRun(argString, out isError);
            if (isError)
            {
                MessageBox.Show("Unable to compile entered operation", "Error", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                return;
            }
            try
            {
                Element identity = new Element(txtIdentity.Text);
                g = new Group(identity, gO);
                List<IElement> elements = new List<IElement>(ParseElements(txtGroupElts.Text));
                GroupGenerator gg = new GroupGenerator(elements, gO, identity);
                g = gg.CreateGroup();

                g.CalculateGroupProperties();

                SubgroupManager manager = new SubgroupManager(g);
                manager.FindSubgroups();

                CayleyTable cT = new CayleyTable(g);
                DrawCayleyTable(g);

                WriteLabels();
            }
            catch (Exception ex)
            {
                if (ex is FormatException)
                {
                    System.Windows.Forms.MessageBox.Show("Elements were not entered in correct format", "Error",
                        System.Windows.Forms.MessageBoxButtons.OK, System.Windows.Forms.MessageBoxIcon.Warning);
                }
                else
                    throw;
            }
        }

        private List<Element> ParseElements(string text)
        {
            List<Element> elements = new List<Element>();
            
            //Use commas as delimiters for now
            int startIndex = 0;
        
            int i;
            for (i = 0; i < text.Length; i++)
            {
                if (text[i] == ',')
                {
                    elements.Add(new Element(text.Substring(startIndex, i - startIndex)));
                    startIndex = i + 1;
                }
            }
            elements.Add(new Element(text.Substring(startIndex, i - startIndex)));

            return elements;
        }

        private void DrawCayleyTable(Group g)
        {
            DataGridViewCellStyle style = new DataGridViewCellStyle();
            style.Font = new System.Drawing.Font("Lucida Sans Unicode", 10F,
                                 System.Drawing.FontStyle.Regular,
                                 System.Drawing.GraphicsUnit.Point, ((byte)(0)));

            cayleyTable.Columns.Clear();
            cayleyTable.Rows.Clear();
            //CayleyTable cT = new CayleyTable(g);
            Globals.CayleyTable = new CayleyTable(g);

            for (int i = 0; i < g.Elements.Count; i++)
            {
                cayleyTable.Columns.Add("", g.Elements[i].ToString());
                cayleyTable.Columns[i].Width = 30;
            }

            for (int i = 0; i < g.Elements.Count; i++)
            {
                cayleyTable.Rows[i].HeaderCell.Style = style;
                cayleyTable.Rows.Add(Globals.CayleyTable.GetNextRow());
                cayleyTable.Rows[i].HeaderCell.Style.Alignment = DataGridViewContentAlignment.BottomLeft;
                cayleyTable.Rows[i].HeaderCell.Value = g.Elements[i].Value;
            }
        }

        private void WriteLabels()
        {
            SubgroupManager sM = new SubgroupManager(g);
            List<Group> subgroups = sM.FindSubgroups();
            lblFiller(g.IsAbelian, g.IsCyclic, subgroups);
        }

        private void lblOpHelp_Click(object sender, EventArgs e)
        {
        }
    }
}
