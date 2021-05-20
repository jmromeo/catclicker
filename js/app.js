/********************************************************************/
/************************* V I E W S ********************************/
/********************************************************************/
(function () {

var catDisplayView = {

    init : function() {
        this.name_view  = $("#catnameview")[0];
        this.img_view   = $("#catimgview")[0];
        this.count_view = $("#catcountview")[0];

        this.render();
    },

    buttonClicked : function(cat) {
        return function() {
            octopus.catClicked(cat);
        }
    },

    render : function() {
        var cat = octopus.getCurrentCat();

        //this.name_view.innerHTML  = cat.name;
        this.img_view.src         = cat.img;
        this.count_view.innerHTML = "Click Count: " + cat.numclicks;
        this.img_view.onclick     = this.buttonClicked(cat); 
    } 
}

var catListView = {

    init : function() {
        this.catlist_view = $("#catlist");

        this.render();
    },

    buttonClicked : function(cat) {
        return function() {
            octopus.catSelected(cat);
        }
    },

    render : function() {
        // not the smartest, but clearing all previous cats and starting again
        this.catlist_view.empty();

        var cats   = octopus.getCats();
        var curcat = octopus.getCurrentCat();
        for (var i = 0; i < cats.length; i++) {

            var button = document.createElement("button");
            button.id = 'catlist_button_' + cats[i].id;
            button.innerHTML = cats[i].name;
            button.classList.add("btn");
            button.onclick = this.buttonClicked(cats[i]);

            if (cats[i] == curcat) {
                button.classList.add("btn-primary");
            }
            else {
                button.classList.add("btn-success");
            }

            this.catlist_view.append(button);
        }
    },
}

function Cat(id, name, img) {
    this.id         = id;   // ID of cat resource
    this.name       = name; // Name of cat
    this.img        = img;  // Cat picture
    this.numclicks  = 0;    // Number of time cat was clicked on
};

var model = {
    cats : [
        new Cat('cat_1', 'bella', 'imgs/cute_cat_1.jpeg'),
        new Cat('cat_2', 'beast', 'imgs/cute_cat_2.jpeg'),
        new Cat('cat_3', 'bubba', 'imgs/cute_cat_3.jpeg'),
        new Cat('cat_4', 'barly', 'imgs/cute_cat_4.jpeg'),
        new Cat('cat_5', 'bartangolus', 'imgs/cute_cat_5.jpeg')
    ],

    init : function() {
        this.setCurrentCat(this.cats[0]);
    },

    setCurrentCat : function(cat) {
        this.currentcat = cat;
    },

    getCurrentCat : function() {
        return this.currentcat;
    },

    getCats : function() {
        return this.cats;
    },

    incrementClickCount : function(cat) {
        cat.numclicks++;
    }
}

var octopus = {
    init : function() {
        model.init();
        catListView.init();
        catDisplayView.init();
    },
    
    getCurrentCat : function() {
        return model.getCurrentCat();
    },

    getCats : function() {
        return model.getCats();
    },

    catSelected : function(cat) {
        model.setCurrentCat(cat);
        catDisplayView.render();
        catListView.render();
    },

    catClicked : function(cat) {
        model.incrementClickCount(cat);
        catDisplayView.render(cat);
    }
}

octopus.init();

})();