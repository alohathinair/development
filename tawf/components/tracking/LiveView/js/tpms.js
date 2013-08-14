var mtr360TrailerLayout = {
    xOffset: 200,
    yOffset: 55,
    parts: [
        {name: "", x:  10, y: 65, width: 330, height: 120}
    ],
    tires: [
        /* Tractor/Trailer */
        {id: 0,   x: 10,   y: 0},
        {id: 1,   x: 10,   y: 30},
        {id: 2,   x: 10,   y: 200},
        {id: 3,   x: 10,   y: 230},

        {id: 4,   x: 80,   y: 0},
        {id: 5,   x: 80,   y: 30},
        {id: 6,   x: 80,   y: 200},
        {id: 7,   x: 80,   y: 230},

        {id: 8,   x: 150,   y: 0},
        {id: 9,  x: 150,   y: 30},
        {id: 10, x: 150,   y: 200},
        {id: 11, x: 150,   y: 230},

        {id: 12, x: 220,   y: 0},
        {id: 13, x: 220,   y: 30},
        {id: 14, x: 220,   y: 200},
        {id: 15, x: 220,   y: 230},

        {id: 16, x: 290,   y: 0},
        {id: 17, x: 290,   y: 30},
        {id: 18, x: 290,   y: 200},
        {id: 19, x: 290,   y: 230}

    ]
};

 
var tpms_products = [
    {
        supportedProducts: ["360HDR", "360HDRB"],
        width: 670,
        height: 330,
        tabs: [{
            name: 'Tractor',
            layout: {
                parts: [
                    {name: "", x:  0,     y: 65, width: 260, height: 120},
                    {name: "",  x:  300,  y: 65, width: 330, height: 120}
                ],
                tires: [
                    /* Tractor */
                    {id: 1,   x: 0,   y: 0},
                    {id: 2,   x: 0,   y: 30},
                    {id: 3,   x: 0,   y: 200},
                    {id: 4,   x: 0,   y: 230},

                    {id: 5,   x: 70,   y: 0},
                    {id: 6,   x: 70,   y: 30},
                    {id: 7,   x: 70,   y: 200},
                    {id: 8,   x: 70,   y: 230},

                    {id: 9,   x: 140,   y: 0},
                    {id: 10, x: 140,   y: 30},
                    {id: 11, x: 140,   y: 200},
                    {id: 12, x: 140,   y: 230},

                    {id: 13, x: 210,   y: 0},
                    {id: 14, x: 210,   y: 30},
                    {id: 15, x: 210,   y: 200},
                    {id: 16, x: 210,   y: 230},

                    /* Trailer */

                    {id: 17, x: 300,   y: 0},
                    {id: 18, x: 300,   y: 30},
                    {id: 19, x: 300,   y: 200},
                    {id: 20, x: 300,   y: 230},

                    {id: 21, x: 370,   y: 0},
                    {id: 22, x: 370,  y: 30},
                    {id: 23, x: 370,   y: 200},
                    {id: 24, x: 370,   y: 230},

                    {id: 25, x: 440,   y: 0},
                    {id: 26, x: 440,   y: 30},
                    {id: 27, x: 440,   y: 200},
                    {id: 28, x: 440,   y: 230},

                    {id: 29, x: 510,   y: 0},
                    {id: 30, x: 510,   y: 30},
                    {id: 31, x: 510,   y: 200},
                    {id: 32, x: 510,   y: 230},

                    {id: 33, x: 580,   y: 0},
                    {id: 34, x: 580,   y: 30},
                    {id: 35, x: 580,   y: 200},
                    {id: 36, x: 580,   y: 230}
                ]
            }
        }]
    },
    {
        supportedProducts: ["360SLR","360SLRB"],
        width: 730,
        height: 330,
        tabs: [{
            name: 'Tractor',
            layout: {
                parts: [
                    {name: "", x:  0,     y: 65, width: 190, height: 120},
                    {name: "",  x:  230,  y: 65, width: 470, height: 120}
                ],
                tires: [
                    /* Tractor */
                    {id: 1,   x: 0,   y: 30},
                    {id: 2,   x: 0,   y: 200},

                    {id: 3,   x: 70,   y: 0},
                    {id: 4,   x: 70,   y: 30},
                    {id: 5,   x: 70,   y: 200},
                    {id: 6,   x: 70,   y: 230},

                    {id: 7,   x: 140,   y: 0},
                    {id: 8,   x: 140,   y: 30},
                    {id: 9,   x: 140,   y: 200},
                    {id: 10, x: 140,   y: 230},

                    /* Trailer */

                    {id: 11, x: 230,   y: 0},
                    {id: 12, x: 230,   y: 30},
                    {id: 13, x: 230,   y: 200},
                    {id: 14, x: 230,   y: 230},

                    {id: 15, x: 300,   y: 0},
                    {id: 16, x: 300,   y: 30},
                    {id: 17, x: 300,   y: 200},
                    {id: 18, x: 300,   y: 230},

                    {id: 19, x: 370,   y: 0},
                    {id: 20, x: 370,  y: 30},
                    {id: 21, x: 370,   y: 200},
                    {id: 22, x: 370,   y: 230},

                    {id: 23, x: 440,   y: 0},
                    {id: 24, x: 440,   y: 30},
                    {id: 25, x: 440,   y: 200},
                    {id: 26, x: 440,   y: 230},

                    {id: 27, x: 510,   y: 0},
                    {id: 28, x: 510,   y: 30},
                    {id: 29, x: 510,   y: 200},
                    {id: 30, x: 510,   y: 230},

                    {id: 31, x: 580,   y: 0},
                    {id: 32, x: 580,   y: 30},
                    {id: 33, x: 580,   y: 200},
                    {id: 34, x: 580,   y: 230},

                    {id: 35, x: 650,   y: 0},
                    {id: 36, x: 650,   y: 30},
                    {id: 37, x: 650,   y: 200},
                    {id: 38, x: 650,   y: 230}
                ]
            }
        }]
    },
    {
        supportedProducts: ["360MTR"],
        width: 780,
        height: 390,
        tabs: [
            {name: 'Tractor', layout: mtr360TrailerLayout},
            {name: 'Trailer 1', layout: mtr360TrailerLayout},
            {name: 'Trailer 2', layout: mtr360TrailerLayout},
            {name: 'Trailer 3', layout: mtr360TrailerLayout},
            {name: 'Trailer 4', layout: mtr360TrailerLayout},
            {name: 'Trailer 5', layout: mtr360TrailerLayout},
            {name: 'Trailer 6', layout: mtr360TrailerLayout},
            {name: 'Trailer 7', layout: mtr360TrailerLayout},
            {name: 'Trailer 8', layout: mtr360TrailerLayout}
        ]
    },
    {
        supportedProducts: ["PressurePro"],
        width: 700,
        height: 330,
        tabs:
            [{
                name: 'Tractor',
                layout: {
                    parts: [
                        {name: "", x:  0,     y: 65, width: 190, height: 120},
                        {name: "",  x:  230,  y: 65, width: 400, height: 120}
                    ],
                    tires: [
                        /* Tractor */
                        {id: 2,   x: 0,   y: 30},
                        {id: 1,   x: 0,   y: 200},

                        {id: 4,   x: 70,   y: 0},
                        {id: 3,   x: 70,   y: 30},
                        {id: 33,   x: 70,   y: 200},
                        {id: 34,   x: 70,   y: 230},

                        {id: 6,   x: 140,   y: 0},
                        {id: 5,   x: 140,   y: 30},
                        {id: 31,   x: 140,   y: 200},
                        {id: 32, x: 140,   y: 230},

                        /* Trailer */

                        {id: 8, x: 230,   y: 0},
                        {id: 7, x: 230,   y: 30},
                        {id: 29, x: 230,   y: 200},
                        {id: 30, x: 230,   y: 230},

                        {id: 10, x: 300,   y: 0},
                        {id: 9, x: 300,   y: 30},
                        {id: 27, x: 300,   y: 200},
                        {id: 28, x: 300,   y: 230},

                        {id: 12, x: 370,   y: 0},
                        {id: 11, x: 370,  y: 30},
                        {id: 25, x: 370,   y: 200},
                        {id: 26, x: 370,   y: 230},

                        {id: 14, x: 440,   y: 0},
                        {id: 13, x: 440,   y: 30},
                        {id: 23, x: 440,   y: 200},
                        {id: 24, x: 440,   y: 230},

                        {id: 16, x: 510,   y: 0},
                        {id: 15, x: 510,   y: 30},
                        {id: 21, x: 510,   y: 200},
                        {id: 22, x: 510,   y: 230},

                        {id: 18, x: 580,   y: 0},
                        {id: 17, x: 580,   y: 30},
                        {id: 19, x: 580,   y: 200},
                        {id: 20, x: 580,   y: 230}
                    ]
                }
            }]
        }
];

function get_tpms_conf(productType) {
    for (var i = 0; i < tpms_products.length; i++) {
        var item = tpms_products[i];
        if ($.inArray(productType, item.supportedProducts) != -1)
            return item;
    }
    return null;
}

function build_tpms(truck, container) {

    var needTabs = truck.tabs.length > 1;
    var tabs;
    $(container).tabs("destroy");
    $(container).width(truck.width - 30);
    $(container).height(truck.height - 70);

    container.html("");
    if (needTabs) {
        tabs = $('<ul />');
        container.append($(tabs));

        $(truck.tabs).each(function(){
            var tab = $('<li />');
            var link = $('<a />');
            $(link).attr("id","tpms-tab-link-"+this.name.replace(/ /g,''));
            $(link).attr("href","#tpms-tab-"+this.name.replace(/ /g,''));
            $(link).html(this.name);
            $(tab).append($(link));
            tabs.append($(tab));
        });
    } else {
        tabs = $('<div />');
    }

    $(truck.tabs).each(function(){
        var tab = $("<div id='tpms-tab-" + this.name.replace(/ /g,'')  + "'></div>");
        var tabName = this.name;
        var xOffset = this.layout.xOffset ?  this.layout.xOffset : 0;
        var yOffset = this.layout.yOffset ?  this.layout.yOffset : 15;
        
        $(this.layout.tires).each(function(){
            var tire = $('<div />');
            $(tire).attr("id","tpms-tire-" + tabName.replace(/ /g,'') + '-' + this.id);
            $(tire).addClass("tpms-tire");
            $(tire).css("left", this.x + xOffset);
            $(tire).css("top", this.y + yOffset);
            $(tire).append(this.id);
            tab.append($(tire));
        });

        $(this.layout.parts).each(function(){
            var part = $('<div />');
            $(part).addClass("tpms-part");
            $(part).css("left", this.x +  xOffset);
            $(part).css("top", this.y  + yOffset);
            $(part).css("width", this.width);
            $(part).css("height", this.height);
            $(part).css("line-height", this.height + "px");
            $(part).append(this.name);
            tab.append($(part));
        });
        
        container.append($(tab));
        
    });

    if (needTabs) {
        container.tabs();
    }

}



