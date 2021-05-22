/********************************************************************/
/************************* V I E W S ********************************/
/********************************************************************/
(function () {

var catEditView = {

    _createNameEditor : function() {
        var nameform = document.createElement("div");

        nameform.classList.add("form-group");

        var label = document.createElement("label");
        label.innerHTML = "Cat Name";

        var input = document.createElement("input");
        input.classList.add("form-control");

        nameform.appendChild(label);
        nameform.appendChild(input);

        this.catnameinput = input;

        return nameform;
    },

    _createImgEditor : function() {
        var img = document.createElement("div");

        img.classList.add("form-group");

        var label = document.createElement("label");
        label.innerHTML = "Cat Img";

        var input = document.createElement("input");
        input.classList.add("form-control");

        img.appendChild(label);
        img.appendChild(input);

        this.catimginput = input;

        return img;
    },

    _createLikesEditor : function() {
        var likes = document.createElement("div");

        likes.classList.add("form-group");

        var label = document.createElement("label");
        label.innerHTML = "Cat likes";

        var input = document.createElement("input");
        input.classList.add("form-control");

        likes.appendChild(label);
        likes.appendChild(input);

        this.catlikesinput = input;

        return likes;
    },

    _createNicknamesEditor : function() {
        var nicknames = document.createElement("div");

        nicknames.classList.add("form-group");

        var label = document.createElement("label");
        label.innerHTML = "Nicknames";

        var input = document.createElement("input");
        input.classList.add("form-control");

        nicknames.appendChild(label);
        nicknames.appendChild(input);

        this.nicknamesinput = input;

        return nicknames;
    },

    _createSaveButton : function() {
        var button = document.createElement("button");

        button.innerHTML = "Save";
        button.classList.add("btn");
        button.classList.add("btn-success");
        button.onclick = this.saveClicked;

        return button;
    },

    _createCancelButton : function() {
        var button = document.createElement("button");

        button.innerHTML = "Cancel";
        button.classList.add("btn");
        button.classList.add("btn-danger");
        button.onclick = this.editCancelled;

        return button;
    },

    init : function(parentview) {
        this.catedit_view = parentview;

        this.catnameform     = this._createNameEditor(); 
        this.catimgform      = this._createImgEditor();
        this.catlikesform    = this._createLikesEditor();
        this.catnicknameform = this._createNicknamesEditor();

        this.savebutton   = this._createSaveButton();
        this.cancelbutton = this._createCancelButton();

        return this;
    },

    saveClicked : function() {
        var newcatname  = catEditView.catnameinput.value;   
        var newcatimg   = catEditView.catimginput.value;
        var newcatlikes = parseInt(catEditView.catlikesinput.value);

        octopus.editCat(octopus.getCurrentCat(), newcatname, newcatimg, newcatlikes);
    },

    editCancelled : function() {
        octopus.editCancelled();
    },

    render : function() {
        cat = octopus.getCurrentCat();

        this.catnameinput.value   = cat.name;
        this.catimginput.value    = cat.img;
        this.catlikesinput.value  = cat.numclicks();
        this.nicknamesinput.value = cat.nicknames();

        this.catedit_view.append(this.catnameform);
        this.catedit_view.append(this.catimgform);
        this.catedit_view.append(this.catlikesform);
        this.catedit_view.append(this.catnicknameform);
        this.catedit_view.append(this.savebutton);
        this.catedit_view.append(this.cancelbutton);
    } 
}

var adminView = {

    init : function() {
        this.admin_view  = $("#adminview");
        this.cateditview = catEditView.init(this.admin_view);

        this.render();
    },

    adminButtonClicked : function(view) {
        octopus.adminButtonClicked();
    },

    render : function() {
        var button = document.createElement("button");
        
        // silly but just removing all elements and rerendering everything
        this.admin_view.empty();

        // admin button always shows
        var adminbutton = document.createElement("button");
        adminbutton.id = 'admin_button';
        adminbutton.innerHTML = "Edit Cat";
        adminbutton.classList.add("btn");
        adminbutton.classList.add("btn-primary");
        adminbutton.onclick = this.adminButtonClicked;

        this.admin_view.append(adminbutton);

        // displaying cat editor if in admin mode
        if (octopus.isAdminMode()) {
            this.cateditview.render();
        }
    },
}

var catDisplayView = {

    init : function() {
        this.img_view        = $("#catimgview")[0];
        this.count_view      = $("#catcountview")[0];
        this.catlike_view    = $("#catlike")[0];
        this.catdislike_view = $("#catdislike")[0];

        this.render();
    },

    catLiked : function(cat) {
        return function() {
            octopus.catClicked(cat);
        }
    },

    catDisliked : function(cat) {
        return function() {
            alert("Are you crazy?! " + cat.name + " super cute!");
        }
    },

    render : function() {
        var cat = octopus.getCurrentCat();

        this.img_view.src            = cat.img;
        this.count_view.innerHTML    = "Likes: " + cat.numclicks();
        this.catlike_view.onclick    = this.catLiked(cat);
        this.catdislike_view.onclick = this.catDisliked(cat);
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

function Cat(id, name, img, nicknames) {
    this.id         = id;   // ID of cat resource
    this.name       = name; // Name of cat
    this.img        = img;  // Cat picture
    this.numclicks  = ko.observable(0);    // Number of times cat was liked on
    this.nicknames  = ko.observableArray(nicknames);
};

var model = {
    
    catsArr : [
        new Cat(0, 'bella', 'imgs/cute_cat_1.jpeg', ["Bee", "Floof Ball", "Beauty"]),
        new Cat(1, 'beast', 'imgs/cute_cat_2.jpeg', ["Tubby", "Chunky Monkey", "Potatoe"]),
        new Cat(2, 'bubba', 'imgs/cute_cat_3.jpeg', ["Hunter", "Micio"]),
        new Cat(3, 'barly', 'imgs/cute_cat_4.jpeg', ["Cucciolo"]),
        new Cat(4, 'bartangolus', 'imgs/cute_cat_5.jpeg', ["Barty", "Bart"])
    ],

    init : function() {
        this.setAdminMode(false);
        this.cats       = ko.observableArray(this.catsArr);
        this.currentcat = ko.observable(this.cats()[0]);
        this.catLevel   = ko.computed(this.computeCurrentCatLevel, this);
        this.nicknames  = ko.computed(this.currentCatNicknames, this);

        ko.applyBindings(this);
    },

    currentCatNicknames : function() {
        return this.getCurrentCat().nicknames();
    },

    computeCurrentCatLevel : function() {
        var cat = this.getCurrentCat();

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

    setAdminMode : function(val) {
        this.adminmode = val;   
    },

    isAdminMode : function() {
        return this.adminmode;
    },

    setCurrentCat : function(cat) {
        this.currentcat(cat);
    },

    getCurrentCat : function() {
        return this.currentcat();
    },

    getCats : function() {
        return this.cats();
    },

    updateCatName : function(cat, newname) {
        this.cats()[cat.id].name = newname;
    },

    updateCatImg : function(cat, newimg) {
        this.cats()[cat.id].img = newimg;
    },

    updateCatLikes : function(cat, newlikes) {
        this.cats()[cat.id].numclicks(newlikes);
    },

    incrementClickCount : function(cat) {
        cat.numclicks(cat.numclicks() + 1);
    }
}

var octopus = {
    init : function() {
        model.init();
        catListView.init();
        catDisplayView.init();
        adminView.init();
    },

    getCurrentCat : function() {
        return model.getCurrentCat();
    },

    getCats : function() {
        return model.getCats();
    },

    editCat : function(cat, newname, newimg, newnumlikes) {
        if (newname != "") {
            model.updateCatName(cat, newname);
        }

        if (newimg != "") {
            model.updateCatImg(cat, newimg);
        }

        if (newnumlikes != "") {
            model.updateCatLikes(cat, newnumlikes);
        }

        model.setAdminMode(false);
        catListView.render();
        catDisplayView.render();
        adminView.render();
    },

    catSelected : function(cat) {
        model.setCurrentCat(cat);
        catDisplayView.render();
        catListView.render();
    },

    catClicked : function(cat) {
        model.incrementClickCount(cat);
        catDisplayView.render(cat);
    },

    adminButtonClicked : function() {
        model.setAdminMode(true);
        adminView.render();
    },

    editCancelled : function() {
        model.setAdminMode(false);
        adminView.render();
    },

    isAdminMode : function() {
        return model.isAdminMode();
    }
}

octopus.init();

})();