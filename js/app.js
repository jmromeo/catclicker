/********************************************************************/
/************************* V I E W S ********************************/
/********************************************************************/
(function () {

function Cat(id, name, img, nicknames) {
    this.id            = id;
    this.name          = ko.observable(name);
    this.img           = ko.observable(img);
    this.numclicks     = ko.observable(0);
    this.nicknames     = ko.observableArray(nicknames);

    this.computeCuteness = function() {
        if (this.numclicks() < 10) {
            return "kinda cute!";
        }
        else if (this.numclicks() < 20) {
            return "cute";
        }
        else if (this.numclicks() < 30) {
            return "really cute";
        }
        else if (this.numclicks() < 100) {
            return "SOOOO CUTE";
        }
        else {
            return "SO FLUFFY, I'M GOING TO DIE";
        }
    };

    this.cutenessLevel = ko.computed(this.computeCuteness, this);
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
        self.editmode   = ko.observable({
            entered: ko.observable(false),
            catname: ko.observable(""),
            catimg: ko.observable(""),
            catlikes: ko.observable(0),
            catnicknames: ko.observableArray([])
        });

        ko.applyBindings(self);
    },

    editCat : function() {
        this.editmode().entered(true);
        this.editmode().catname(self.currentcat().name());
        this.editmode().catimg(self.currentcat().img());
        this.editmode().catlikes(self.currentcat().numclicks());
        this.editmode().catnicknames(self.currentcat().nicknames());
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

    catLiked : function() {
        this.numclicks(this.numclicks() + 1);
    },

    catDisliked : function() {
        alert("Are you crazy?! " + this.name() + " is super cute!");
    },

    setCurrentCat : function(clickedCat) {
        self.currentcat(clickedCat);
    },
}

ViewModel.init();

})();