/*var s = new Vue({
    el: '#degradation_type',
    data: {
      options: [
          { text: 'Panne de réseau', value: 'panne' },
          { text: 'Compteur cassé', value: 'compteur_cassee'}
      ]
    }
});*/

var email_nfe = new Vue({
    el: '#email_nfe'
});

var nfeid = new Vue({
    el: '#nfeid'
});

var password = new Vue({
    el: '#password'
});

var connection_button = new Vue({
    el: '#connection_button',
    methods: {
        connect: function() {
        var email = getVal(email_nfe).trim();
        var id = getVal(nfeid).trim();
        var pass = getVal(password).trim();

        if (email == "" || id == "" || pass == "") {
            alert("imcomplet");
            return;
        }

        axios.post(
            "/login",
            {
                email_nfe: email,
                nfeid: id,
                password: pass
            }
        ).then(function(res) {
            alert(res.data.success);


        })
    }
  }
});

function getVal(element) {
    return element.$el.value;
}