Pokedex.Views = {}

Pokedex.Views.PokemonIndex = Backbone.View.extend({
  events: {
     "click li": "selectPokemonFromList",
     "keyup .search": "updateSearchParams"
  },

  initialize: function () {
    this.collection = new Pokedex.Collections.Pokemon();
    this.$el.append('<input class="search" type="text">');
    this.$el.append('<div class="inner-list">');
    this.listenTo(this.collection, 'sync add', this.render);
  },

  addPokemonToList: function (pokemon) {
    var content = window.JST["pokemonListItem"]({pokemon: pokemon});
    this.$el.find('.inner-list').append(content);
  },

  refreshPokemon: function (searchString, callback) {
    this.collection.fetch({
      success: function() {
        debugger
        this.render({searchString: searchString});
        callback && callback();
      }.bind(this)
    });
  },

  render: function (options) {

    var searchString = options['searchString'];
    this.$el.find('.inner-list').empty();
    if (!searchString) {
      this.collection.each(this.addPokemonToList, this);
    } else {
      this.collection.each(function (pokemon) {
        var pokeName = pokemon.get('name');
        if (pokeName.indexOf(searchString) > -1) {
          this.addPokemonToList(pokemon);
        }
      }.bind(this));
    }
    return this;
  },

  selectPokemonFromList: function (event) {
    var li = $(event.currentTarget);
    var pokemonId = li.data("id");

    Backbone.history.navigate("/pokemon/" + pokemonId, {trigger: true});
  },

  updateSearchParams: function(event) {
    var searchString = $(event.currentTarget).val();
    console.log(searchString);
    this.refreshPokemon(searchString);
  }
});

Pokedex.Views.PokemonDetail = Backbone.View.extend({
  events: {
    'click .toy-list-item': 'selectToyFromList'
  },

  refreshPokemon: function (callback) {
    this.model.fetch({
      success: function() {
        this.render();
        callback && callback();
      }.bind(this)
    });
  },

  render: function () {
    this.$el.empty();
    var content = window.JST['pokemonDetail']({pokemon: this.model});
    this.$el.html(content);
    this.model.toys().each(function(toy) {
      var toyContent = window.JST['toyListItem']({ toy: toy });
      this.$el.find(".toys").append(toyContent);
    }, this);
  },

  selectToyFromList: function (event) {
    var toyId = $(event.currentTarget).data('id');
    var pokemonId = $(event.currentTarget).data('pokemon-id');

    Backbone.history.navigate("/pokemon/" + pokemonId + "/toys/" + toyId, {trigger: true});
  }
});

Pokedex.Views.ToyDetail = Backbone.View.extend({
  render: function () {
    this.$el.empty();
    var content = window.JST["toyDetail"]({toy: this.model, pokes: _([])});
    this.$el.html(content);
  }
});
