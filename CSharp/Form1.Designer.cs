namespace Groups
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Form1));
            this.imageList1 = new System.Windows.Forms.ImageList(this.components);
            this.panel1 = new System.Windows.Forms.Panel();
            this.treeViewSubgroups = new System.Windows.Forms.TreeView();
            this.textBox1 = new System.Windows.Forms.TextBox();
            this.lblEnterOrder = new System.Windows.Forms.Label();
            this.btnMakeGroup = new System.Windows.Forms.Button();
            this.lblGroupResult = new System.Windows.Forms.Label();
            this.dGCayleyTable = new System.Windows.Forms.DataGridView();
            this.lblProperties = new System.Windows.Forms.Label();
            this.lblGroupType = new System.Windows.Forms.Label();
            this.cmbGroupType = new System.Windows.Forms.ComboBox();
            this.btnCustomGrp = new System.Windows.Forms.Button();
            this.optionBox = new System.Windows.Forms.CheckBox();
            this.panel1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.dGCayleyTable)).BeginInit();
            this.SuspendLayout();
            // 
            // imageList1
            // 
            this.imageList1.ColorDepth = System.Windows.Forms.ColorDepth.Depth8Bit;
            this.imageList1.ImageSize = new System.Drawing.Size(16, 16);
            this.imageList1.TransparentColor = System.Drawing.Color.Transparent;
            // 
            // panel1
            // 
            this.panel1.Controls.Add(this.treeViewSubgroups);
            this.panel1.Location = new System.Drawing.Point(12, 51);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(275, 283);
            this.panel1.TabIndex = 0;
            this.panel1.Paint += new System.Windows.Forms.PaintEventHandler(this.panel1_Paint);
            // 
            // treeViewSubgroups
            // 
            this.treeViewSubgroups.Location = new System.Drawing.Point(3, 4);
            this.treeViewSubgroups.Name = "treeViewSubgroups";
            this.treeViewSubgroups.Size = new System.Drawing.Size(145, 276);
            this.treeViewSubgroups.TabIndex = 0;
            // 
            // textBox1
            // 
            this.textBox1.Location = new System.Drawing.Point(166, 28);
            this.textBox1.Name = "textBox1";
            this.textBox1.Size = new System.Drawing.Size(65, 20);
            this.textBox1.TabIndex = 1;
            this.textBox1.TextChanged += new System.EventHandler(this.textBox1_TextChanged);
            this.textBox1.KeyDown += new System.Windows.Forms.KeyEventHandler(this.textBox1_KeyDown);
            // 
            // lblEnterOrder
            // 
            this.lblEnterOrder.AutoSize = true;
            this.lblEnterOrder.Location = new System.Drawing.Point(12, 31);
            this.lblEnterOrder.Name = "lblEnterOrder";
            this.lblEnterOrder.Size = new System.Drawing.Size(104, 13);
            this.lblEnterOrder.TabIndex = 2;
            this.lblEnterOrder.Text = "Enter order of group:";
            this.lblEnterOrder.Click += new System.EventHandler(this.lblEnterOrder_Click);
            // 
            // btnMakeGroup
            // 
            this.btnMakeGroup.Location = new System.Drawing.Point(12, 341);
            this.btnMakeGroup.Name = "btnMakeGroup";
            this.btnMakeGroup.Size = new System.Drawing.Size(148, 23);
            this.btnMakeGroup.TabIndex = 3;
            this.btnMakeGroup.Text = "Generate Group";
            this.btnMakeGroup.UseVisualStyleBackColor = true;
            this.btnMakeGroup.Click += new System.EventHandler(this.btnMakeGroup_Click);
            // 
            // lblGroupResult
            // 
            this.lblGroupResult.AutoSize = true;
            this.lblGroupResult.Location = new System.Drawing.Point(15, 392);
            this.lblGroupResult.Name = "lblGroupResult";
            this.lblGroupResult.Size = new System.Drawing.Size(121, 13);
            this.lblGroupResult.TabIndex = 4;
            this.lblGroupResult.Text = "Group Operation Result:";
            // 
            // dGCayleyTable
            // 
            this.dGCayleyTable.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.dGCayleyTable.Location = new System.Drawing.Point(302, 51);
            this.dGCayleyTable.Name = "dGCayleyTable";
            this.dGCayleyTable.Size = new System.Drawing.Size(377, 283);
            this.dGCayleyTable.TabIndex = 5;
            this.dGCayleyTable.CellContentClick += new System.Windows.Forms.DataGridViewCellEventHandler(this.dgViewCayleyTable_CellContentClick);
            // 
            // lblProperties
            // 
            this.lblProperties.AutoSize = true;
            this.lblProperties.Location = new System.Drawing.Point(15, 405);
            this.lblProperties.Name = "lblProperties";
            this.lblProperties.Size = new System.Drawing.Size(89, 13);
            this.lblProperties.TabIndex = 6;
            this.lblProperties.Text = "Group Properties:";
            // 
            // lblGroupType
            // 
            this.lblGroupType.AutoSize = true;
            this.lblGroupType.Location = new System.Drawing.Point(12, 12);
            this.lblGroupType.Name = "lblGroupType";
            this.lblGroupType.Size = new System.Drawing.Size(120, 13);
            this.lblGroupType.TabIndex = 7;
            this.lblGroupType.Text = "Choose a type of group:";
            // 
            // cmbGroupType
            // 
            this.cmbGroupType.FormattingEnabled = true;
            this.cmbGroupType.Items.AddRange(new object[] {
            "Cyclic and Abelian",
            "Dihedral"});
            this.cmbGroupType.Location = new System.Drawing.Point(166, 4);
            this.cmbGroupType.Name = "cmbGroupType";
            this.cmbGroupType.Size = new System.Drawing.Size(121, 21);
            this.cmbGroupType.TabIndex = 8;
            this.cmbGroupType.SelectedIndexChanged += new System.EventHandler(this.cmbGroupType_SelectedIndexChanged);
            // 
            // btnCustomGrp
            // 
            this.btnCustomGrp.Location = new System.Drawing.Point(302, 340);
            this.btnCustomGrp.Name = "btnCustomGrp";
            this.btnCustomGrp.Size = new System.Drawing.Size(148, 23);
            this.btnCustomGrp.TabIndex = 9;
            this.btnCustomGrp.Text = "Generate Custom Group";
            this.btnCustomGrp.UseVisualStyleBackColor = true;
            this.btnCustomGrp.Click += new System.EventHandler(this.btnCustomGrp_Click);
            // 
            // optionBox
            // 
            this.optionBox.AutoSize = true;
            this.optionBox.Enabled = false;
            this.optionBox.Location = new System.Drawing.Point(302, 4);
            this.optionBox.Name = "optionBox";
            this.optionBox.Size = new System.Drawing.Size(57, 17);
            this.optionBox.TabIndex = 10;
            this.optionBox.Text = "Option";
            this.optionBox.UseVisualStyleBackColor = true;
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(700, 464);
            this.Controls.Add(this.optionBox);
            this.Controls.Add(this.btnCustomGrp);
            this.Controls.Add(this.cmbGroupType);
            this.Controls.Add(this.lblGroupType);
            this.Controls.Add(this.lblProperties);
            this.Controls.Add(this.dGCayleyTable);
            this.Controls.Add(this.lblGroupResult);
            this.Controls.Add(this.btnMakeGroup);
            this.Controls.Add(this.lblEnterOrder);
            this.Controls.Add(this.textBox1);
            this.Controls.Add(this.panel1);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.Name = "Form1";
            this.Text = "Finite Group App";
            this.Paint += new System.Windows.Forms.PaintEventHandler(this.Form1_Paint);
            this.panel1.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.dGCayleyTable)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.ImageList imageList1;
        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.TextBox textBox1;
        private System.Windows.Forms.Label lblEnterOrder;
        private System.Windows.Forms.Button btnMakeGroup;
        private System.Windows.Forms.Label lblGroupResult;
        private System.Windows.Forms.DataGridView dGCayleyTable;
        private System.Windows.Forms.Label lblProperties;
        private System.Windows.Forms.Label lblGroupType;
        private System.Windows.Forms.ComboBox cmbGroupType;
        private System.Windows.Forms.Button btnCustomGrp;
        private System.Windows.Forms.TreeView treeViewSubgroups;
        private System.Windows.Forms.CheckBox optionBox;
    }
}

