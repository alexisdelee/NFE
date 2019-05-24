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
            var email = email_nfe.$el.value.trim();
            var id = nfeid.$el.value.trim();
            var pass = password.$el.value.trim();

            if (email == "" || id == "" || pass == "") {
                alert("imcomplet");
                return;
            }
            
            axios.post("/login", {
                email_nfe: email,
                nfeid: id,
                password: pass
            }).then(res => {
                if (res.data.success) {
                    window.location.href = "/";
                }
            })
        }
    }
});