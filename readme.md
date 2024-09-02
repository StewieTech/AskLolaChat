# AskLolaChat

- I believe I need to make the conditional renders of components better. Currently right now, my app renders all the time within my App no matter what page I'm on. That is because I am not using exact routes. I also have everything in my App within App.js. I need to create AppRoutes for the routes. Also Refactor all my components into components. Need to understand if I want UseEffects for everything

### Features
- Went with three layer architecture. Considered other architectural design patterns like event-driven architecture, microkernal architecture, microservices, monolithic architecture
- A User need to be able to Login, have a unique ID where all the information they provide get's tied to them
- They eventually need to have a unique session that is also tied to that ID ? 
- A User will need to pay using stripe

#### Prototype
- Forgot Password, Password Reset, Email Verification

#### MVP 2.0
- Oauth Provider automatically filled in from their manual form and connected to their gmail so they can sign in with it in the future, or at least connect there accounts



### Components
#### Common
- Button
- Input
- ProUpgradeModal
- Login Success
- RegistrationSuccess

Need to think do I need Login/Registration or can I combine them into Modal?


#### Features
##### Authentication
- Login.js
- RegistrationForm.js
- GoogleOAuth.js
- AuthContext.js

My assumption is I won't need Login here and within pages as well, I can probably do one or the other
##### Dashboard
- NavigationMenu
- Header

Header will be an X that turns into navigation menu

##### Image
- ImageDisplayComponent
- ImageUploader

##### Messages
- QuestionCount.js
- TextAreaComonent.js

##### Notifications




### Pages
- MainChatPage.js
- LoginPage.js
- Registration.js
- NavigationMenu.js 
- InterviewPage

- The user should start on the HomePage and then from their the signup automatically starts
- I also want a way to immediately get them to become a pro user
- the first message Lola responds to them with should be free and over the top excited
- CSS pages should accompany files ? I think this is an easier way to manage them to know where they are impacting
 




