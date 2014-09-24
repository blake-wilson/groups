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
    public partial class PolygonForm : Form
    {
        private int numSides;
        private Point origin;

        public PolygonForm(int numSides, string description)
        {
            InitializeComponent();
            this.numSides = numSides;
            this.Description.Text = description;
            this.origin = new Point(this.Width / 2, this.Height / 2);
        }

        private void PolygonForm_Load(object sender, EventArgs e)
        {
        }

        private void PolygonForm_Paint(object sender, PaintEventArgs e)
        {
            int radius = Math.Min(this.Height / 2 - 40, this.Width / 2 - 40);
            double theta = (2 * Math.PI) / numSides;
            Pen pen = new Pen(Color.FromArgb(255, 0, 0, 0));
            Point[] points = new Point[numSides];
            for (int i = 0; i < numSides; i++)
            {
                points[i] = new Point((int)(radius * Math.Sin(theta * i) + this.origin.X), (int)(radius * Math.Cos(theta * i)) + this.origin.Y);
            }
            for (int i = 0; i < numSides; i++)
            {
                if (numSides % 2 == 0)
                    e.Graphics.DrawLine(pen, points[i], points[(i + (numSides / 2)) % numSides]);
                else
                    e.Graphics.DrawLine(pen, points[i], MidPoint(points[(i + (numSides / 2)) % numSides], points[(i + (numSides / 2) + 1) % numSides]));
            }
            e.Graphics.DrawPolygon(pen, points);
        }

        private Point MidPoint(Point pt1, Point pt2)
        {
#if DEBUG
            Point p = new Point((pt1.X + pt2.X) / 2, (pt1.Y + pt2.Y) / 2);
#endif
            return new Point((pt1.X + pt2.X) / 2, (pt1.Y + pt2.Y) / 2);
        }

        private void PolygonForm_ResizeEnd(object sender, EventArgs e)
        {
            this.origin = new Point(this.Width / 2, this.Height / 2);
            this.Invalidate();
        }
    }
}
