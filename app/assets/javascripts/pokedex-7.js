Pokedex.Views = (Pokedex.Views || {});

Pokedex.Views.PokemonForm = Backbone.View.extend({
  events: {
    "submit form": "savePokemon"
  },

  render: function () {
    var content = window.JST["pokemonForm"]();
    this.$el.html(content);
  },

  savePokemon: function (event) {
    event.preventDefault();
    var currentTarget = $(event.currentTarget).serializeJSON();
    console.log(currentTarget);

    this.model.save(currentTarget['pokemon'], {
      success: function() {
        this.collection.add(this.model);
        Backbone.history.navigate('/pokemon/' + this.model.get('id'), {trigger: true});
      }.bind(this)
    });
  }
});
