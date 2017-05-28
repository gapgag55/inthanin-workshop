const FB = require('fb');
const express  = require('express')
const url = require('url')
const path = require('path')
const bodyParser = require('body-parser')

var app      = express();
var port     = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(bodyParser())

FB.options({
    appId: '457141724648398',
    appSecret: '5957495007786aade96534dcdd846133'
})

app.get('/', function(req, reply) {
    reply.render('index.ejs', { url: FB.getLoginUrl({
            scope: 'user_website,email,user_birthday,user_about_me,user_posts,publish_actions',
            redirect_uri: 'http://localhost:3000/get'
        })
    })
})

app.get('/get', function(req, reply) {

      FB.api('oauth/access_token', {
         client_id: '457141724648398',
         client_secret: '5957495007786aade96534dcdd846133',
         redirect_uri: 'http://localhost:3000/get',
         code: req.query.code
    }, function (res) {

         if(!res || res.error) {
             console.log(!res ? 'error occurred' : res.error);
             return;
         }
    
         FB.setAccessToken(res.access_token);

        reply.redirect('/show');
     });
})

app.get('/show', function(req, reply) {
    FB.api('me/', { fields: 'id,name,about,birthday,email,website,posts'}, function (res) {
    if(!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        return;
    }
    reply.render('profile.ejs', { data: res })
    });
    
})

app.post('/post', function(req, reply) {
    var body = req.body.message
    FB.api('me/feed', 'post', { message: body }, function (res) {
    if(!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        return;
    }
    
    reply.redirect('/show');
    });
})


// launch
app.listen(port);
console.log('The magic happens on port ' + port);