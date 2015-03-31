Pokedex.Views = {}

Pokedex.Views.PokemonIndex = Backbone.View.extend({
  // tagName: "li",
  //
  // className: "backbone-el",
  //
  // attrs: {
  // },

  events: {
     "click li": "selectPokemonFromList"
  },

  initialize: function () {
    this.collection = new Pokedex.Collections.Pokemon();
    this.listenTo(this.collection, 'sync add', this.render);
  },

  addPokemonToList: function (pokemon) {
    var content = window.JST["pokemonListItem"]({pokemon: pokemon});
    this.$el.append(content);
  },

  refreshPokemon: function (callback) {
    this.collection.fetch({
      success: function() {
        this.render();
        callback && callback();
      }.bind(this)
    });
  },

  render: function () {
    this.$el.empty();
    this.collection.each(this.addPokemonToList, this);
    return this;
  },

  selectPokemonFromList: function (event) {
    var li = $(event.currentTarget);
    var pokemonId = li.data("id");
    // var pokemon = this.collection.get(pokemonId);

    Backbone.history.navigate("/pokemon/" + pokemonId, {trigger: true});
    // var pokeDetail = new Pokedex.Views.PokemonDetail({model: pokemon});
    // $("#pokedex .pokemon-detail").html(pokeDetail.$el);
    // pokeDetail.refreshPokemon();
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
