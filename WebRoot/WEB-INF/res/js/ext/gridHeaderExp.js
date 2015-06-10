MyGridView = Ext.extend(Ext.grid.GridView, {



            renderHeaders : function() {



                var cm = this.cm, ts = this.templates;



                var ct = ts.hcell, ct2 = ts.mhcell;



                var cb = [], sb = [], p = {}, mcb = [];



                for (var i = 0, len = cm.getColumnCount(); i < len; i++) {



                    p.id = cm.getColumnId(i);



                    p.value = cm.getColumnHeader(i) || "";



                    p.style = this.getColumnStyle(i, true);



                    if (cm.config[i].align == 'right') {



                        p.istyle = 'padding-right:16px';



                    }



                    cb[cb.length] = ct.apply(p);



                    if (cm.config[i].mtext)



                        mcb[mcb.length] = ct2.apply({



                                    value : cm.config[i].mtext,



                                    mcols : cm.config[i].mcol,



                                    mwidth : cm.config[i].mwidth



                                });



                }



                var s = ts.header.apply({



                            cells : cb.join(""),



                            tstyle : 'width:' + this.getTotalWidth() + ';',



                            mergecells : mcb.join("")



                        });



                return s;



            }



        });



viewConfig = {



    templates : {



        header : new Ext.Template(



                ' <table border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',



                ' <thead> <tr class="x-grid3-hd-row">{mergecells} </tr>'



                + ' <tr class="x-grid3-hd-row">{cells} </tr> </thead>',



                " </table>"),



        mhcell : new Ext.Template(



                ' <td class="x-grid3-header" colspan="{mcols}" style="width:{mwidth}px;"> <div align="center">{value}</div>',



                " </td>")



    }



};

var cm = new Ext.grid.ColumnModel([{
                header : "标题1",
                mtext : " ",
                mcol : 1,
                mwidth : 60,
                width : 60,

                dataIndex : ''
            }, {
                mtext : "标题2",
                mcol : 3,
                mwidth : 240,
                header : "标题3",
                width : 80,
                dataIndex : ''

            }, {
                mtext : "  ",
                mwidth : 80,
                header : "标题4",
                width : 80,
                sortable : true,
                dataIndex : ' '
            }, {
                header : "标题5",
                mwidth : 80,
                width : 80,
                dataIndex : ' '
            }, {
                mtext : " ",
                mcol : 1,
                mwidth : 60,
                header : "标题6",
                width : 60,
                dataIndex : ' '
            }]);
