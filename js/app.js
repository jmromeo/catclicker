/********************************************************************/
/************************* V I E W S ********************************/
/********************************************************************/
(function () {

function Cat(id, name, img, nicknames) {
    this.id         = id;   // ID of cat resource
    this.name       = ko.observable(name); // Name of cat
    this.img        = ko.observable(img);  // Cat picture
    this.numclicks  = ko.observable(0);    // Number of times cat was liked on
    this.nicknames  = ko.observableArray(nicknames);
};

initialCatArr = [
    new Cat(0, 'bella', 'imgs/cute_cat_1.jpeg', ["Bee", "Floof Ball", "Beauty"]),
    new Cat(1, 'beast', 'imgs/cute_cat_2.jpeg', ["Tubby", "Chunky Monkey", "Potatoe"]),
    new Cat(2, 'bubba', 'imgs/cute_cat_3.jpeg', ["Hunter", "Micio"]),
    new Cat(3, 'barly', 'imgs/cute_cat_4.jpeg', ["Cucciolo"]),
    new Cat(4, 'bartangolus', 'imgs/cute_cat_5.jpeg', ["Barty", "Bart"])
];

var ViewModel = {
    init : function() {
        self = this;

        self.cats       = ko.observableArray(initialCatArr);
        self.currentcat = ko.observable(self.cats()[0]);
        self.catLevel   = ko.computed(self.computeCurrentCatLevel, self);
        self.editmode   = ko.observable({
            entered: ko.observable(false),
            catname: ko.observable(""),
            catimg: ko.observable(""),
            catlikes: ko.observable(0),
            catnicknames: ko.observableArray([])
        });

        ko.applyBindings(self);
    },

    saveEdit : function() {
        self.currentcat().name(self.editmode().catname());
        self.currentcat().img(self.editmode().catimg());
        self.currentcat().numclicks(self.editmode().catlikes());
        self.currentcat().nicknames(self.editmode().catnicknames());

        self.editmode().entered(false);
    },

    cancelEdit : function() {
        self.editmode().entered(false);
    },

    catDisliked : function() {
        alert("Are you crazy?! " + this.name() + " is super cute!");
    },

    computeCurrentCatLevel : function() {
        var cat = this.currentcat();

        if (cat.numclicks() < 10) {
            return "kinda cute!";
        }
        else if (cat.numclicks() < 20) {
            return "cute";
        }
        else if (cat.numclicks() < 30) {
            return "really cute";
        }
        else if (cat.numclicks() < 100) {
            return "SOOOO CUTE";
        }
        else {
            return "SO FLUFFY, I'M GOING TO DIE";
        }
    },

    editCat : function() {
        this.editmode().entered(true);
        this.editmode().catname(self.currentcat().name());
        this.editmode().catimg(self.currentcat().img());
        this.editmode().catlikes(self.currentcat().numclicks());
        this.editmode().catnicknames(self.currentcat().nicknames());
    },

    setCurrentCat : function() {
        self.currentcat(this);
    },

    incrementClickCount : function() {
        this.numclicks(this.numclicks() + 1);
    }
}

ViewModel.init();

})();