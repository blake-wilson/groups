using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Groups
{
    class SampleGroups
    {
        public static Group DihedralGroup(int order)
        {
            Group dGroup;
            Group.GroupOperate operation = (x, y) =>
                {
                    DihedralElement dX = x as DihedralElement;
                    DihedralElement dY = y as DihedralElement;
                    DihedralElement dR = new DihedralElement(dX.NumRotations * 2, false, 0);
                    DihedralElement.DihedralProperties xProps = (DihedralElement.DihedralProperties)dX.Value;
                    DihedralElement.DihedralProperties yProps = (DihedralElement.DihedralProperties)dY.Value;

                    if (dX.IsRotation && dY.IsRotation)
                    {
                        dR.IsRotation = true;
                        dR.Value = new DihedralElement.DihedralProperties
                        {
                            //rot = (xProps.rot + yProps.rot) % dX.NumRotations,
                            rot = MathFuncs.ModAdd(xProps.rot, yProps.rot, dX.NumRotations),
                            refl = 0
                        };
                    }
                    else if (dX.IsReflection && dY.IsRotation)
                    {
                        dR.IsReflection = true;
                        dR.Value = new DihedralElement.DihedralProperties
                        {
                            rot = 0,
                            //refl = (xProps.refl - yProps.rot) % dX.NumRotations
                            refl = MathFuncs.ModSubt(xProps.refl, yProps.rot, dX.NumRotations),
                        };
                    }

                    else if (dX.IsRotation && dY.IsReflection)
                    {
                        dR.IsReflection = true;
                        dR.Value = new DihedralElement.DihedralProperties
                        {
                            rot = 0,
                            //refl = (xProps.rot + yProps.refl) % dX.NumRotations
                            refl = MathFuncs.ModAdd(xProps.rot, yProps.refl, dX.NumRotations),
                        };
                    }

                    else // dX is reflection and dY is reflection
                    {
                        dR.IsRotation = true;
                        dR.Value = new DihedralElement.DihedralProperties
                        {
                            //rot = (xProps.rot - yProps.rot) % dX.NumRotations,
                            rot = MathFuncs.ModSubt(xProps.refl, yProps.refl, dX.NumRotations),
                            refl = 0
                        };
                    }

                    //int xrot = ParseRotation(x.Value);
                    //int yrot = ParseRotation(y.Value);
                    //int xRef = ParseReflection(x.Value);
                    //int yRef = ParseReflection(y.Value);

                    return dR;
                };

            DihedralElement dihedralIdentity = new DihedralElement(order, true, 0);

            List<IElement> dElements = new List<IElement>();

            //Add rotation elements
            for (int i = 1; i < order / 2; i++)
            {
                dElements.Add(new DihedralElement(order, true, i));
            }

            //Add reflection elements
            {
                for (int i = 0; i < order / 2; i++)
                {
                    dElements.Add(new DihedralElement(order, false, i));
                }
            }

            dGroup = new Group(dihedralIdentity, operation, dElements);

            return dGroup;
        }
    }
}
