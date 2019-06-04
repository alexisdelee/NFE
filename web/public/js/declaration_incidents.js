function getTypes() {
    
}

var s = new Vue({
    el: '#degradation_type',
    data: {
      options: [
          { text: 'Panne de réseau', value: 'panne' },
          { text: 'Compteur cassé', value: 'compteur_casse'},
          { text: "Compteur buggé", value: 'compteur_bugge'}
      ]
    }
});