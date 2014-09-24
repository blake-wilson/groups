using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using PH.DataTree;

namespace Groups
{
    public partial class Form1 : Form
    {
        List<Label> subgroupsLabels;

        public Form1()
        {
            InitializeComponent();
            
            subgroupsLabels = new List<Label>();
           
            Globals.Controller = new TreeViewController<Group>(treeViewSubgroups, Globals.LatticeRoot);
            lblFill = FillLabels_GM;

            lblProperties.AutoSize = true;
        }

        private void Form1_Paint(object sender, PaintEventArgs e)
        {
        }

        private void panel1_Paint(object sender, PaintEventArgs e)
        {
        }

        private void textBox1_TextChanged(object sender, EventArgs e)
        {

        }

        private void textBox1_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {

            }
        }

        private void btnMakeGroup_Click(object sender, EventArgs e)
        {
            //Create a group
            /*
            int modulus = 36;
            Group.GroupOperate gO = (param1, param2) =>
            {
                int modulus = 36;
                Element x = new Element(((Int32.Parse(param1.Value) + Int32.Parse(param2.Value)) % modulus).ToString());
                return x;
            };
            Group g = new Group(new Element("0"), gO); 
            for (int i = 1; i < 36; i++)
            {
                g.AddElement(new Element(i.ToString()));
            }
            lblGroupResult.Text = g.Elements[7].Value + " + " +  g.Elements[7].Value + " is: ";
            lblGroupResult.Text += g.Operate(g.Elements[7], g.Elements[7]).Value;
            lblGroupResult.Text += " order of 7 is: " + g.GetOrder(g.Elements[7]);

            g.CalculateGroupProperties();
            lblProperties.Text = "Group is ";
            if (g.IsAbelian)
                lblProperties.Text += "Abelian, ";
            else
                lblProperties.Text += "not Abelian, ";

            if (g.IsCyclic)
            {
                lblProperties.Text += "cyclic" + "\n" + "Subgroups of group are: ";
                SubgroupManager sM = new SubgroupManager(g);
                List<Group> subgroups = sM.FindSubgroups();
                foreach (Group gr in subgroups)
                {
                    lblProperties.Text += gr.ToString();
                }
            }
            
            else
                lblProperties.Text += "not cyclic";

            DrawCayleyTable(g);
            */

            FillForm();
            panel1.Invalidate();

        }

        private void DrawCayleyTable(Group g)
        {
            dGCayleyTable.Columns.Clear();
            dGCayleyTable.Rows.Clear();
            CayleyTable cT = new CayleyTable(g);
            for (int i = 0; i < g.Elements.Count; i++)
            {
                dGCayleyTable.Columns.Add("", g.Elements[i].ToString());
                dGCayleyTable.Columns[i].Width = 30;
            }

            for (int i = 0; i < g.Elements.Count; i++)
            {
                dGCayleyTable.Rows.Add(cT.GetNextRow());
                dGCayleyTable.Rows[i].HeaderCell.Style.Alignment = DataGridViewContentAlignment.BottomLeft;
                dGCayleyTable.Rows[i].HeaderCell.Value = g.Elements[i].Value;
            }
        }

        private void dgViewCayleyTable_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {

        }


        //Display subgroups on a Treeview -- Prefferred method for now
        private void PopulateTreeview()
        {
           
        }

        //Recursive function to draw subgroup lattice without windows controls
        private void DrawTree2(DTreeNode<Group> node, PaintEventArgs e, Pen pen, Point parentPos, int currentDepth, Font drawFont, SolidBrush drawBrush)
        {
            foreach (DTreeNode<Group> n in node.Nodes)
            {
                if (node.Value != null)
                {
                    int yPos = parentPos.Y + n.Depth * 50;

                    if (node.Depth > currentDepth)
                    {
                        //Revert parent x position
                        parentPos.X = 0;

                        e.Graphics.DrawLine(pen, new Point(parentPos.X, parentPos.Y + 20), new Point(parentPos.X + 30, parentPos.Y));
                        e.Graphics.DrawString(n.Value.ToString(), drawFont, drawBrush, new Point(parentPos.X + 30, yPos));
                        //parentPos.Y = (Globals.LatticeRoot.Depth - n.Depth) * 30;
                    }
                    else
                    {
                        e.Graphics.DrawLine(pen, new Point(parentPos.X, parentPos.Y + 20), new Point(parentPos.X + 30, yPos));
                        parentPos = new Point(parentPos.X + 30, yPos);
                        e.Graphics.DrawString(n.Value.ToString(), drawFont, drawBrush, parentPos);
                    }
                    currentDepth = n.Depth;
                }
                DrawTree2(n, e, pen, parentPos, currentDepth, drawFont, drawBrush);

                //Revert position of Parent
                parentPos.Y -= 50;
            }
            if (parentPos.Y > panel1.Height)
            {
                panel1.VerticalScroll.Visible = true;
            }
        }

        private void FillForm()
        {
            Group g = null;
            List<Group> subgroups = new List<Group>();
            
            try
            {
                if (cmbGroupType.SelectedItem.ToString() == "Cyclic and Abelian")
                {
                    int modulus = Int32.Parse(textBox1.Text);
                    Group.GroupOperate gO = (param1, param2) =>
                    {
                        Element x = new Element(((Int32.Parse(param1.ToString()) + Int32.Parse(param2.ToString())) % modulus).ToString());
                        return x;
                    };
                    g = new Group(new Element("0"), gO);
                    for (int i = 1; i < modulus; i++)
                    {
                        g.AddElement(new Element(i.ToString()));
                    }

                    lblGroupResult.Text = "Subgroups shown as subgroups of Z_n (which is isomorphic to specified group)";

                    g.CalculateGroupProperties();

                    SubgroupManager sM = new SubgroupManager(g);
                    subgroups = sM.FindSubgroups();

                    //}
                    //else
                    //    lblProperties.Text += "not cyclic";

                    //DrawCayleyTable(g);
                }
                else if (cmbGroupType.SelectedItem.ToString() == "Dihedral")
                {
                    g = SampleGroups.DihedralGroup(Int32.Parse(textBox1.Text));
                    //g.AddElement(new DihedralElement(Int32.Parse(textBox1.Text), true, 1));
                    //g.AddElement(new DihedralElement(Int32.Parse(textBox1.Text), false, 0));

                    //GroupGenerator gg = new GroupGenerator(g.Elements, g.Operation, g.Identity);
                    //g = gg.CreateGroup();

                    g.CalculateGroupProperties();

                    SubgroupManager sM = new SubgroupManager(g);
                    subgroups = sM.FindSubgroups();
                    foreach (Group gr in subgroups)
                    {
                        lblProperties.Text += gr.ToString();
                    }

                    lblGroupResult.Text = "Group elements shown as rotations (R) and reflections (S)";

                    if (optionBox.Checked == true)
                    {
                        PolygonForm polygonDrawer = new PolygonForm(Int32.Parse(textBox1.Text) / 2, "Visual representation of dihedral group as a " + 
                            (Int32.Parse(textBox1.Text) / 2).ToString() + "-sided polygon.\nReflections occur about the lines");
                        polygonDrawer.Show();
                    }
                }

                DrawCayleyTable(g);
                FillLabels(g.IsAbelian, g.IsCyclic, subgroups);
            }
            catch (Exception ex)
            {
                if (ex is NullReferenceException)
                    MessageBox.Show("Please select a group type", "Error", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                else if (ex is FormatException)
                    MessageBox.Show("Group order was not input in a valid format", "Error", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                else if (ex is DivideByZeroException)
                {
                    if (cmbGroupType.SelectedItem.ToString() == "Cyclic and Abelian")
                        MessageBox.Show("Divide by zero exception.  Did the group have order 0?", "Error", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                    else if (cmbGroupType.SelectedItem.ToString() == "Dihedral")
                        MessageBox.Show("Divide by zero exception.  Did the group have even order > 0?", "Error", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                }
                else
                    throw;
            }
        }

        private void FillLabels(bool isAbelian, bool isCyclic, List<Group> subgroups)
        {
            lblProperties.Text = "Group is: ";

            if (isAbelian)
                lblProperties.Text += "Abelian, ";
            else
                lblProperties.Text += "not Abelian, ";

            if (isCyclic)
                lblProperties.Text += "cyclic";
            else
                lblProperties.Text += "not cyclic";

            lblProperties.Text += "\n" + "Subgroups of group are: ";


            lblProperties.MaximumSize = new Size(this.Width - 20, 0);

            for (int i = 0; i < subgroups.Count; i++)
            {
                lblProperties.Text += subgroups[i].ToString();

                if (i != subgroups.Count - 1)
                    lblProperties.Text += ", ";
            }
        }

        private void FillLabels_GM(bool isAbelian, bool isCyclic, List<Group> subgroups)
        {
            FillLabels(isAbelian, isCyclic, subgroups);
            lblGroupResult.Text = "";
        }

        private void btnCustomGrp_Click(object sender, EventArgs e)
        {
            Group g = new Group();
            GroupMaker gM = new GroupMaker(g, dGCayleyTable, lblGroupResult, lblFill);
            
            gM.Show();
        }

        public delegate void LabelFiller(bool isAbelian, bool isCyclic, List<Group> subgroups);
        private static LabelFiller lblFill;

        private void lblEnterOrder_Click(object sender, EventArgs e)
        {

        }

        private void cmbGroupType_SelectedIndexChanged(object sender, EventArgs e)
        {
            switch(cmbGroupType.SelectedItem.ToString())
            {
                case "Dihedral":
                    optionBox.Text = "Graph polygon rep.?";
                    optionBox.Enabled = true;
                    break;
                case "Cyclic and Abelian":
                optionBox.Text = "Option";
                optionBox.Enabled = false;
                    break;
                default:
                    optionBox.Text = "Option";
                    optionBox.Enabled = false;
                    break;
            }
        }
    }
}
