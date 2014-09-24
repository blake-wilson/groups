namespace Groups
{
    partial class GroupMaker
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(GroupMaker));
            this.btnGenerate = new System.Windows.Forms.Button();
            this.txtGroupOp = new System.Windows.Forms.TextBox();
            this.lblOperation = new System.Windows.Forms.Label();
            this.lblElements = new System.Windows.Forms.Label();
            this.txtGroupElts = new System.Windows.Forms.TextBox();
            this.txtIdentity = new System.Windows.Forms.TextBox();
            this.lblIdentity = new System.Windows.Forms.Label();
            this.lblOpHelp = new System.Windows.Forms.Label();
            this.lblEltsHelp = new System.Windows.Forms.Label();
            this.toolTipHelp = new System.Windows.Forms.ToolTip(this.components);
            this.SuspendLayout();
            // 
            // btnGenerate
            // 
            this.btnGenerate.Location = new System.Drawing.Point(12, 160);
            this.btnGenerate.Name = "btnGenerate";
            this.btnGenerate.Size = new System.Drawing.Size(130, 23);
            this.btnGenerate.TabIndex = 0;
            this.btnGenerate.Text = "Generate Group";
            this.btnGenerate.UseVisualStyleBackColor = true;
            this.btnGenerate.Click += new System.EventHandler(this.btnGenerate_Click);
            // 
            // txtGroupOp
            // 
            this.txtGroupOp.Location = new System.Drawing.Point(12, 25);
            this.txtGroupOp.Multiline = true;
            this.txtGroupOp.Name = "txtGroupOp";
            this.txtGroupOp.Size = new System.Drawing.Size(175, 78);
            this.txtGroupOp.TabIndex = 1;
            // 
            // lblOperation
            // 
            this.lblOperation.AutoSize = true;
            this.lblOperation.Location = new System.Drawing.Point(12, 9);
            this.lblOperation.Name = "lblOperation";
            this.lblOperation.Size = new System.Drawing.Size(130, 13);
            this.lblOperation.TabIndex = 2;
            this.lblOperation.Text = "Enter the group operation:";
            // 
            // lblElements
            // 
            this.lblElements.AutoSize = true;
            this.lblElements.Location = new System.Drawing.Point(216, 9);
            this.lblElements.Name = "lblElements";
            this.lblElements.Size = new System.Drawing.Size(135, 13);
            this.lblElements.TabIndex = 3;
            this.lblElements.Text = "Enter the group\'s elements:";
            // 
            // txtGroupElts
            // 
            this.txtGroupElts.Location = new System.Drawing.Point(219, 25);
            this.txtGroupElts.Multiline = true;
            this.txtGroupElts.Name = "txtGroupElts";
            this.txtGroupElts.Size = new System.Drawing.Size(179, 78);
            this.txtGroupElts.TabIndex = 4;
            // 
            // txtIdentity
            // 
            this.txtIdentity.Location = new System.Drawing.Point(219, 163);
            this.txtIdentity.Name = "txtIdentity";
            this.txtIdentity.Size = new System.Drawing.Size(100, 20);
            this.txtIdentity.TabIndex = 5;
            // 
            // lblIdentity
            // 
            this.lblIdentity.AutoSize = true;
            this.lblIdentity.Location = new System.Drawing.Point(216, 147);
            this.lblIdentity.Name = "lblIdentity";
            this.lblIdentity.Size = new System.Drawing.Size(112, 13);
            this.lblIdentity.TabIndex = 6;
            this.lblIdentity.Text = "Enter Identity element:";
            // 
            // lblOpHelp
            // 
            this.lblOpHelp.AutoSize = true;
            this.lblOpHelp.BackColor = System.Drawing.Color.LightSalmon;
            this.lblOpHelp.Location = new System.Drawing.Point(12, 106);
            this.lblOpHelp.Name = "lblOpHelp";
            this.lblOpHelp.Size = new System.Drawing.Size(29, 13);
            this.lblOpHelp.TabIndex = 7;
            this.lblOpHelp.Text = "Help";
            this.toolTipHelp.SetToolTip(this.lblOpHelp, resources.GetString("lblOpHelp.ToolTip"));
            this.lblOpHelp.Click += new System.EventHandler(this.lblOpHelp_Click);
            // 
            // lblEltsHelp
            // 
            this.lblEltsHelp.AutoSize = true;
            this.lblEltsHelp.BackColor = System.Drawing.Color.LightSalmon;
            this.lblEltsHelp.Location = new System.Drawing.Point(222, 106);
            this.lblEltsHelp.Name = "lblEltsHelp";
            this.lblEltsHelp.Size = new System.Drawing.Size(29, 13);
            this.lblEltsHelp.TabIndex = 8;
            this.lblEltsHelp.Text = "Help";
            this.toolTipHelp.SetToolTip(this.lblEltsHelp, "Enter the elements in the group.  You may\r\nenter only those elements which are no" +
                    "t generated\r\nby other elements and the remainder will be generated.\r\nElements mu" +
                    "st be delimited by commas.");
            // 
            // toolTipHelp
            // 
            this.toolTipHelp.AutoPopDelay = 20000;
            this.toolTipHelp.InitialDelay = 500;
            this.toolTipHelp.ReshowDelay = 100;
            this.toolTipHelp.ToolTipIcon = System.Windows.Forms.ToolTipIcon.Info;
            // 
            // GroupMaker
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(427, 212);
            this.Controls.Add(this.lblEltsHelp);
            this.Controls.Add(this.lblOpHelp);
            this.Controls.Add(this.lblIdentity);
            this.Controls.Add(this.txtIdentity);
            this.Controls.Add(this.txtGroupElts);
            this.Controls.Add(this.lblElements);
            this.Controls.Add(this.lblOperation);
            this.Controls.Add(this.txtGroupOp);
            this.Controls.Add(this.btnGenerate);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MinimumSize = new System.Drawing.Size(415, 250);
            this.Name = "GroupMaker";
            this.Text = "Group Maker";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button btnGenerate;
        private System.Windows.Forms.TextBox txtGroupOp;
        private System.Windows.Forms.Label lblOperation;
        private System.Windows.Forms.Label lblElements;
        private System.Windows.Forms.TextBox txtGroupElts;
        private System.Windows.Forms.TextBox txtIdentity;
        private System.Windows.Forms.Label lblIdentity;
        private System.Windows.Forms.Label lblOpHelp;
        private System.Windows.Forms.Label lblEltsHelp;
        private System.Windows.Forms.ToolTip toolTipHelp;
    }
}