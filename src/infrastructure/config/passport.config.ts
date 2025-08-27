import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import UserModel from '@/infrastructure/model/user.model';
import { environment } from './environment';

// Only initialize Google OAuth strategy if environment variables are configured
if (environment.GOOGLE_CLIENT_ID && environment.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: environment.GOOGLE_CLIENT_ID,
        clientSecret: environment.GOOGLE_CLIENT_SECRET,
        callbackURL: environment.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await UserModel.findOne({ googleId: profile.id });
          
          if (!user) {
            // Create new user
            user = await UserModel.create({
              googleId: profile.id,
              email: profile.emails?.[0]?.value,
              firstName: profile.name?.givenName || '',
              lastName: profile.name?.familyName || '',
              profilePicture: profile.photos?.[0]?.value,
              isEmailVerified: true,
              role: 'user'
            });
          }
          
          return done(null, user);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );
  console.log('Google OAuth strategy initialized successfully');
} else {
  console.log('Google OAuth not configured - skipping strategy initialization');
}

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
