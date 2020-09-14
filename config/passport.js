const GoogleStrategy=require('passport-google-oauth20').Strategy
const keys=require('./keys')
const mongoose=require('mongoose')

const User=mongoose.model('users')

module.exports= passport =>{
    passport.use(
        new GoogleStrategy({
            clientID:keys.googleClientId,
            clientSecret:keys.googleClientSecret,
            callbackURL:'/auth/google/callback',
            proxy:true
        },(accessToken,refreshToken,profile,done)=>{
            // console.log(accessToken)
            // console.log(profile)
            // const image=profile.photos[0].value.substring(0,profile.photos[0].value.indexOf('?'))
            // console.log(image)

            const  newUser={
                googleID:profile.id,
                firstName:profile.name.givenName,
                lastName:profile.name.familyName,
                email:profile.emails[0].value,
                image:profile.photos[0].value
            }
            // console.log(newUser.image)
            User.findOne({
                googleID:profile.id
            }).then(user=>{
                if(user){
                    done(null,user)
                }else{
                    new User(newUser)
                        .save()
                        .then(user =>{
                            done(null,user)
                        })
                }
            })
        })
    ),
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
      
}