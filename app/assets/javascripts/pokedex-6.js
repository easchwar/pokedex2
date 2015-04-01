Pokedex.Router = Backbone.Router.extend({
  routes: {
    "": "pokemonIndex",
    "pokemon/:id": "pokemonDetail",
    "pokemon/:pokemonId/toys/:toyId": "toyDetail"
  },

  pokemonDetail: function (id, callback) {
    if (!this._pokemonIndex) {
      this.pokemonIndex(function () {
        this.pokemonDetail(id, callback);
      }.bind(this));
    } else {
      var pokemon = this._pokemonIndex.collection.get(id);
      var pokeDetail = new Pokedex.Views.PokemonDetail({model: pokemon});
      $("#pokedex .pokemon-detail").html(pokeDetail.$el);
      pokeDetail.refreshPokemon(callback);
      this._pokemonDetail = pokeDetail;
    }
  },

  pokemonIndex: function (callback) {
    var pokeIndex = new Pokedex.Views.PokemonIndex();
    pokeIndex.refreshPokemon(null, callback);
    $("#pokedex .pokemon-list").html(pokeIndex.$el);
    this._pokemonIndex = pokeIndex;
    this.pokemonForm();
  },

  toyDetail: function (pokemonId, toyId) {
    if (!this._pokemonDetail) {
      this.pokemonDetail(pokemonId, function() {
        this.toyDetail(pokemonId, toyId);
      }.bind(this));
    } else {

      var toy = this._pokemonDetail.model.toys().get(toyId);
      var toyDetail = new Pokedex.Views.ToyDetail({model: toy});

      $("#pokedex .toy-detail").html(toyDetail.$el);
      toyDetail.render();
    }
  },

  pokemonForm: function () {

    var pokemonForm = new Pokedex.Views.PokemonForm({model: new Pokedex.Models.Pokemon(), collection: this._pokemonIndex.collection});
    $("#pokedex .pokemon-form").html(pokemonForm.$el);
    pokemonForm.render();
  }
});


$(function () {
  new Pokedex.Router();
  Backbone.history.start();
});
