var everyauth = require("everyauth"),
    appId = process.env.facebook_appid, 
    fbSecret = process.env.facebook_fbsecret,
    fbCallbackAddress = "/",
    userStore = require("../data/userStore");

module.exports = function(app){
    everyauth.everymodule.findUserById( function (userId, callback) {
      userStore.findById(userId).when(callback);
    });

    // configure facebook authentication
    everyauth.facebook
        .appId(appId)
        .appSecret(fbSecret)
        .scope('email')
        .redirectPath('/')
        .findOrCreateUser(function (session, accessToken, extra, oauthUser) {
            var promise = this.Promise();
            userStore.getOrSaveUser(oauthUser)
                    .when(function(err,user){
                        if (err) return promise.fail(err);
                        promise.fulfill(user);
                    });
            return promise;
        });

    app.configure(function(){
        app.use(everyauth.middleware());
    });

    everyauth.helpExpress(app);
};