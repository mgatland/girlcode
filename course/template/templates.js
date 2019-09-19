/* eslint indent: "off" */
const issues = [
{ 'title': 'Show a graph of how many people chose each answer',
'body': `
let users view a graph of how many people chose each answer.

Here's an example:

![](https://www.popovergenie.com/wp-content/uploads/2016/12/amazon_asks_example_1.png)

This issue is going to only focus on drawing the graph, not on recording the stats.

Eventually we will only show the graph after the user chooses an answer. *But to start with, we will always show the graph*.

- [ ] open *feed.html* in VS Code
- [ ] find the line \`function displayMessage(post) {\`

This is the code that displays each post. Let's add some fake stats that we can display, by adding this line near the start of the function.

\`\`\`javascript
if (post.answerCount === undefined) {
  post.answerCount = [1, 4, 5, 10];
  post.totalAnswers = 20;
}
\`\`\`

(This is saying that the first answer was chosen 1 time, the second was chosen 4 times, the third was chosen 5 times, and the last was chosen 10 times.  The \`if\` statement will stop this from overriding the real stats, when someone gets the real stats working. We only add fake stats if the stats are missing.)

OK, now we're going to draw nice bars to represent the answers.

In the big block of code that creates the HTML for each post, add some to show the stats:

\`\`\`javascript
 +  '<div class="stats">'
  +  '<div class="answerStat" style="width:50%"></div>'
  +  '<div class="answerStat" style="width:10%"></div>'
  +  '<div class="answerStat" style="width:60%"></div>'
  + '<div class="answerStat" style="width:20%"></div>'
  + '</div>'
\`\`\`

This will be invisible because they are empty and have no borders or anything.

Open *style.css* and add some styles for answerStat so that it displays as bar. Give it a fixed height and a border or background color. Don't set its width because we will set each bar to its own custom width in the code.

- [ ] you should see four bars in each post, each a different width.

So far we have 'hard-coded' the width of each bar. We need to instead work out the width using post.answerCount[0] for the first answer, post.answerCount[1] for the next and so on.

- [ ] calculate the correct width for each post

Hey the answerStat bars also need to display the text of the answer. You can look at the code for the answer buttons to see how to do this.

- [ ] display the text of the answer on or next to the corresponding answer bar.
`
},
{ 'title': 'Record how many people choose each answer',
'body': `
When someone chooses an answer, record their response on the server.

This issue is to record the stats on the server. **We won't draw the graph in this issue**.

Summary:
* When the user chooses an answer, send a message to the server saying which answer they picked *and* which question it was for.
* The server will record there response by adding 1 to a counter.

- [ ] Open *feed.html* in VS Code
- [ ] Find the code that creates the four answer buttons

We want to make it easier to tell which answer is which. Give each of the HTML elements an attribute, like this: \`data-id="0"\` - give each a different id value: 0, 1, 2 and 3.

- [ ] each answer button now has a \`data-id\` attribute with a different value

- [ ] in *feed.html* find the function that is run when the user clicks on an answer button. (Look for \`console.log("button clicked!")\`)

We can new code after that line and it will only run when an answer button is clicked.

We need to get 2 pieces of information: the post ID (which post is this?) and the answer number (which answer did they choose?)

\`\`\`javascript
let answerNumber = e.target.dataset.id;
let postIdElement = e.target.parentNode.querySelector(".postId");
let postId = postIdElement.innerHTML;
console.log("You chose post " + postId + ", answer " + answerNumber);
\`\`\`
The code above puts the values you need into \`postId\` and \`answerNumber\`, and writes them in the dev tools console.

- [ ] test that choosing an answer logs the right post ID and answer number

Now you need to send these values to the server. Take a look at post.html for an example of sending values to the server.

You'll create a data object, put the values you want to send into the data object, and then use the fetch command to post it to the server.

In *post.html* we used the path "/post". Change that to "/answerChosen" so the server knows it is a new kind of request.

- [ ] Use a fetch command to send a message to the server with the two pieces of information we need

> You can check what is being sent by opening your Chrome Developer Tools and looking at the network tab. There's a list of requests. Click on an answer to make a new request. It should appear at the end of the list. Click on it then look under 'headers' at the very end to see what is being sent.

# server side

- [ ] open index.js

Add this to *index.js*:

\`\`\`javascript
function answerChosen(request, response) {
   console.log("Post id: " + request.body.postId);
   console.log("Answer number: " + request.body.answerNumber);
   response.send("ok");
}
app.post("/answerChosen", answerChosen);
\`\`\`

The server can now reply to 'answerChosen' requests using this new function.

The server should log the values you sent through. Try it out and see if the right values come through.

- [ ] the server log (in Terminal or Command Prompt) shows the same post ID and answer number as you saw in Chrome

Once you have the right values you can use them to get the appropriate post:

\`\`\`javascript
let post = posts.find(x => x.id == request.body.postId);
\`\`\`

Lets save the answer id into a variable with a shorter name, and convert it to a number instead of a string:

\`\`\`javascript
let answerNumber = parseInt(request.body.answerNumber);
\`\`\`

Record stats about who has answered the question so far:

\`\`\`
if (post.answerCount === undefined) {
  post.answerCount = [0, 0, 0, 0]; //starting values
  post.totalAnswers = 0;
}
post.answerCount[answerNumber]++; //increase counter by one
post.totalAnswers++; //increase counter by one
\`\`\`


Next we have to save a copy of the post into the database. If the server is restarted, it will forget any changes it made that were not recorded in the database.

To resave the post:

\`\`\`javascript
databasePosts.update({id: post.id}, post);
\`\`\`


These stats are not displayed anywhere, but you can see them by looking at the raw view of the posts: \`http://localhost:3000/posts\`

Check that the system is recording what answers you choose. Check that the record is still correct even after restarting the server.
`
},
{ 'title': 'The feed displays polls (front end only)',
'body': `
In *feed.html*, each post is now going to include a poll.

We want to display the four possible answers for each poll.

Open *feed.html* and find the function *displayMessage*.

- [ ] Inside the function, at the start, add this line. This adds some answers to every post. This is just for testing and will be deleted when we add the ability for users to attach their own answers to their post.

\`\`\`javascript
if (!post.answers) post.answers = ["one", "two", "three", "four"]; // For testing only
\`\`\`

Now look at the code in the function that creates the postHTML. You need to add some new div tags into the HTML to contain each of the four answers.

- [ ] do that!

You can get the value of an answer like this: \`post.answers[0]\` or \`post.answers[1]\`. The answers are numbered 0, 1, 2 and 3.

Once you've finished, you should see the four answers appear in the feed on every post.

- [ ] We see the four answers appear after every post

We want the answers to look clickable. Give the answers the css class \`answerButton\` so you can style them. Then open up the css file and add some styles to make them look clickable.

In your css file:
\`\`\`css
.answerButton {
  
}
\`\`\`

Look at some other websites for ideas. (How about this GitHub page you're looking at right now?) How can you tell what you're supposed to click on?

Some ideas to try:
* the mouse pointer arrow turns into a pointing finger
* the HTML element changes color when you *hover* over it with your mouse
* sometimes, the text is underlined, or gets an underline when you hover
* sometimes, there is a border and background color so it looks like a button

- [ ] the answers look clickable

## make the buttons do something

Normally, we add an event listener to a single button. Here, there could be lots of different answer buttons in the message feed. We're going to add a special event listener that works for all the buttons at the same time.

Add this code to your JavaScript, somewhere that is not inside any other function. 
\`\`\`
function messageListClick(e) {
  if (e.target.classList.contains("answerButton")) {
    console.log("button clicked!")
  } else {
    console.log("something else was clicked")
  }
}

let messageList = document.querySelector(".message-list");
messageList.addEventListener("click", messageListClick);
\`\`\`

- [ ] add the code

This adds an event listener to the entire message list. Every time you click on anything inside the list, the function runs.

When the function runs, it checks if you clicked on something with the class \`answerButton\`. If you did, we're going to do something. Otherwise we won't.

- [ ] Open your developer tools to the Console page and try clicking on the button and other parts of the message feed.
- [ ] test: clicking a button should display 'button clicked!'

If it doesn't, make sure your buttons have the same class that the code is looking for.

- [ ] test: clicking on any part of a post except the button should display 'something else was clicked'

`
},
{ 'title': 'user can add and save a poll question and 4 options',
'body': `
This will be very similar to the save an author ticket, except we're adding 5 new input fields!

Use the instructions from the old *Save and display the author of each post* as a reference.

We need to add 5 new inputs on the form at post.html:
- [ ] question
- [ ] answer 1
- [ ] answer 2
- [ ] answer 3
- [ ] answer 4

- [ ] Make the server expect and save all 5 inputs in index.js

### move answers into a list

In index.js, instead of saving the answers as answer1, answer2, answer3 and answer4, we want to save them into a list. This makes it easier to treat each answer the same way.

Currently, you should have some code a bit like this:
\`\`\`javascript
//old code
post.answer1 = request.body.answer1;
post.answer2 = request.body.answer2;
\`\`\`
and so on for answer3 and answer4

Replace with this:
\`\`\`javascript
post.answers = []; // empty list
post.answers.push(request.body.answer1);
post.answers.push(request.body.answer2);
\`\`\`
and so on for answer3 and answer4

Check:

When you look at http://localhost:3000/posts you will see all of the posts in raw form

Make a new post then find it at http://localhost:3000/posts

If the answers were "one", "two", "three", "four" you should see something like this in that page:

\`\`\`javascript
answers: ["one", "two", "three", "four"]
\`\`\`

- [ ] Yes, I can see that the answers are being saved as a list
`
},
{'title': 'Add the new logo',
'body': `The logo image should be attached to this issue.

- [ ] Right click on the logo to download it to your computer.
- [ ] Copy the logo into our project's \`public\` folder (using Windows Explorer or Finder)

> If you have trouble finding the public folder on your computer, you can go to Github Desktop and choose 'Repository' then 'Open in Explorer' (Windows) or 'Open in Finder' (Mac).

Now it's in the public folder, so our server can show it to clients. If the file is named\`logo.png\` then you can view it at this address: http://localhost:3000/logo.png 

You can add the logo to any HTML page as an image tag, for example:

\`\`\`html
<img src=\"/logo.png\">
\`\`\`

- [ ] add the logo to every page in our site`},
{'title': "User can set their post's background color? (unfinished)",
'body': ``},
{'title': "Search feed improvement - display 'no results found' if no results are found",
'body': `We put a message 'No results found' under the feed, but make it hidden with CSS.
When we search the feed, we set a variable \`foundAnything\` to false
Each time we find a matching result, we set \`foundAnything\` to true. So it will be true if we found 1 or more results.
After the search is finished, we show or hide the 'No results found' message based on whether \`foundAnything\` is true or false.

### step by step

- [ ] Add a 'no results found' message to the page's html, but give it a class 'hidden' so it starts off invisible. Give it another class you can use to find it with JavaScript.
- [ ] Find the function that searches and filters the feed.

- [ ] At the start, create the variable
\`\`\`javascript
let foundAnything = false
\`\`\`

- [ ] While it is searching, if it ever finds a matching result, set \`foundAnything = true\`

- [ ] After we search, add or remove the class \`hidden\` from the message so it appears or disappears
`},
{'title': 'Swear filter',
'body': `Add a profanity filter. When the server receives messages from a client, it should run them through the filter to get the censored versions. The server should only save the censored versions of messages.

You could write your own, but we might as well use a pre-made one. This one looks ok:

https://www.npmjs.com/package/bad-words

- [ ] use npm to install the new package
- [ ] find all the places where users can send text to the server. Make sure each one passes the text through the filter before saving it.

- [ ] test - Try posting a swear word and check that it is filtered. If you're not sure what swear word to use, I suggest \`h4x0r\` because it's not a real swear word but the filter removes it for some reason!
- [ ] make sure every place a user could post a swear word is filtered

Discussion point: who gets to decide what is or isn't a swear word? you might find some words are filtered that you think should be allowed.`},
{'title': 'Make Sign up and Login work on the server (accounts feature)',
'body': `The other Sign Up and Log In issue must be completed first.

OK we have a login page at http://localhost:3000/login.html

And we have a server who can listen to \"/login\" and \"/signup\" posts but doesn't do anything with them.

Now we gotta make it do something

# Overview

When you Sign Up, it's a lot like making a new post. Instead of making a new post, you make a new user. But it's the same idea. Get it?

The server will keep a list of users.

# Tools

We're going to use a framework to save us some time. Install it by running this command in the Command Prompt (or Terminal):

- [ ] \`npm install --save client-sessions\`

# Go to the index.js because it's server time

In \`index.js\` we're going to make an empty list to hold the user accounts

\`\`\`javascript
let users = [];
\`\`\`

## sign ups

Find the code for when someone posts to /signup. Make it create a new user and push it into the accounts list - just like what we do when someone posts a new post!

- [ ] do it

> Warning: Normally you should **never** save a user's password without encrypting it. For now, we are saving the passwords in plain text which is not a good practice. We will fix this later...

- [ ] When someone signs up, our server should create a new object, put the user's email, name, and password into the object, then push the object into the users list.

## log ins

Find the code for when someone posts to /login.

You need to check if there is a user in the **users** list that has the same email and password as what the user submitted. if there are, respond \"Log in success!\" otherwise respond \"Log in failed\".

We can use the find command to do this:

\`\`\`javascript
let user = users.find(u => u.email === request.body.email && u.password == request.body.password);
\`\`\`

Then you can use: \`if (user === undefined)\` to check if no user was found - then send a response saying \"login failed\" - otherwise respond with \"login succeeded\"

- [ ] Test that logging in gives the correct response - success or fail based on whether the email and password match an existing account.

## OK but it doesn't actually log you in, it just says 'success' and then stops

Yeah, we want to give the user a [*session*](https://stormpath.com/blog/everything-you-ever-wanted-to-know-about-node-dot-js-sessions) which basically means we give them an ID token and their browser shows it to us every time they make a request from now on. We check their ID token to know who they are. We're using a framework to handle most of this for us.

At the start of index.js, import the framework

\`\`\`javascript
let session = require('client-sessions');
\`\`\`

Add this configuration too

\`\`\`javascript
app.use(session({
  cookieName: 'session',
  secret: 'random_secret_string_goes_here',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));
\`\`\`

> The secret should actually be secret, but again, we're going to be lazy and make our app not very secure. For now. (Our code is all public on GitHub, so putting the secret in our code isn't very secret.)

Now in the code where we log in, if it succeeds, we can save the user object into the session:

\`\`\`javascript
//put this code at the point where you know the request has a correct username and password, because you found a user object in the accounts list that matches:
request.session.user = user;
\`\`\`

That's it. Now whenever that user makes a request, they will send their ID token and the framework will give us back the user object.

## How do I know if it's working?

Let's make a simple test URL so the client can ask the server \"who am I?\"

Still in \`index.js\`, Add this code somewhere:

\`\`\`javascript
function getMyProfile(request, response) {
  response.send(request.session.user);
}
app.get(\"/profile\",  getMyProfile);
\`\`\`

Use your web browser to ask for this new resource \`/profile\`. Does it work?

## yes but when the server restarts, all the accounts disappear

yeah. Fixing that is big enough to be a whole other ticket though. We have to:

* log into mlab.com (which manages our database) and add a new Collection called *accounts*
* back in index.js, find the code that loads posts out of the database when the server starts up. Copy it and adjust it to load accounts.
* when we create a new account, as well as saving it to our local list, save it to the database as well. We already do this with posts so take a look at that code.

##  when you sign up, the sign up should fail if there is already an account with the same email address.

Yeah. Can you fix it?`},
{'title': 'Sign up + Log in page (accounts feature) NOT UPDATED FOR NO JQUERY',
'body': `(note to Matthew: this task is quite long and could be split in half from 'make the server react'

# Sign Up and Log In page

Let's add a page where new users can sign up to our app, or log in to their account.

# Make an HTML page

- [ ] Make a new HTML file in the public folder called *login.html*
- [ ] Copy all the code from *post.html* into *login.html* to use as a starting point.

Here's an example of a typical log-in page.

![2017-06-15 14_07_12-twitter it s what s happening](https://user-images.githubusercontent.com/364886/27162212-2a622f1c-51d4-11e7-9227-e14bee271ff9.png)

Note that this page has two different forms you can fill out. One form to log in. One form to sign up. 

You only have one form in your HTML, so you will want to copy it to make two forms. (A form starts with \`<form>\` and ends with \`</form>\`

- [ ] In *login.html*, copy and paste the form so there are now two forms.
- [ ] In *login.html* edit the forms so they have the right inputs and buttons for a log in page (like in the screenshot above)

# Let our page talk to the server

When the user clicks on the Log in button, we need to:

* get the values out of the input boxes
* put each of those values into a data object
* post the data object to the server

Look for some JavaScript in *login.html*. You'll need to change a few details but it should already do most of what you want.

- [ ] When the user clicks 'Log in', post the email and password from the appropriate inputs. Post it to \"/login\"

> How to check what is being sent to the server: 
> 1. Open the Developer Tools
> 2. click on the Network tab.  
> 3. Click on the button on your form
> 4. A new row should appear in the Developer Tools, representing the new POST command. 
> 5. Click on that new row. Some options will appear with a new row of tabs.
> 6. Click on the 'Headers' tab and scroll to the end to see what is being sent.


- [ ] When the user clicks \"Sign up\", post the email, name and password from signup form. Post it to \"/signup\"

> Check what is being sent to the server, following the same instructions as before.

# What we we done so far:

We have made a sign up\\log in page that sends messages to the server. But we have not told the server what to do when someone sends one of these messages.

# Make the server react to these messages

Open up \`index.js\`. Add this code to make the server listen to \"/login\" posts.

\`\`\`javascript
function login(request, response) {
  console.log(\"someone tried to log in\");
  response.send(\"OK\");
}
app.post(\"/login\", login);
\`\`\`
- [ ] copy the code above into index.js

Restart the server. When you click the 'login' button on the website, you should see the message \"someone tried to log in\" appear in the Command Prompt or Terminal.

- [ ] test that 'someone tried to log in' appears in Command Prompt or Terminal when you try to log in.

Now copy the code in again, but change it to react to \"/signup\" instead.  You will need to to rename the function from \`login\` to \`signup\` and change the app.post line to refer to \`signup\`.

- [ ] The message  'someone tried to sign up' should appear in Command Prompt or Terminal when you try to sign up.
- [ ] check that logging in still says 'someone tried to log in'. Now you know both are working!

# Make the client display the server's response

The client needs to know if the logging in worked or not. We can make the client display the server's reply.

**Go back to \`login.html\`**

If you check the documentation for jQuery's [post command](https://api.jquery.com/jquery.post/), you'll see all the arguments you can give it:

\`\`\`javascript
jQuery.post( url [, data ] [, success ] [, dataType ] )
\`\`\`

We already give it the url, and some data. Now we're going to give it the 'success' argument, which is a *function* that will be run when the server replies.

At the start of your \`<script>\`, add this function:
\`\`\`javascript
function showServerReply(data, textStatus) {
$(\".note\").text(data);
}
\`\`\`
- [ ] make sure your html has a div with \`class=\"note\"\` - that's where we will display the response. You might already have one, if you don't, add one.

- [ ] Where you use \`$.post\` to log in or to sign up, add a third argument, \`showServerReply\` to tell your browser what you want it to do when the server responds.

- [ ] Try out your page now. Clicking the Log In button should show the server's response, which is always \"OK\" at the moment.
`},
{'title': 'Make comments work (comments feature part 3)',
'body': `_Making comments work is a big job, split across several tickets. This is the third part, and the other two must be completed first._

The previous comment tickets did this:
* One made a place on the page where the user can write comments
* One made the server keep track of comments, and displayed them in the feed

Now we need to
* Make the user's comments be sent to the server
* Make the server record the comments when it receives them

In *feed.html*, find the code that runs when someone clicks on a reply button.
Right now it just displays a message on the screen.

We need to change it to POST a message to the server.

We will need 2 pieces of information to give the server:

* post.id (which post do you want to comment on)
* the actual comment

\`\`\`javascript
let data = {};
data.postId = post.id;
data.comment = "test" //fixme: replace this with the actual comment
fetch("/comment", {
  method:"POST",
  body: JSON.stringify(data),
  headers: {'Content-Type': 'application/json'}
});


console.log(\"i asked the server to save your comment\");
\`\`\`

- [ ] add the code above in the right place so it runs when you click 'reply'
- [ ] change the //fixme part so it includes the actual comment you typed in (look at the code that makes the alert box pop up for an example

Now we need to go to \`index.js\` and teach it how to respond to a new kind of POST.

Start by adding this empty post handler to the server:

\`\`\`javascript
function commentHandler(request, response) {
    //more code goes here
   response.send(\"ok\");
}
app.post(\"/comment\", commentHandler);
\`\`\`

> Remember to restart the server whenever you change index.js!

Now you'll need to teach the server what to do:
- [ ] check what value was sent through: try \`console.log(request.body.postId);\` and \`console.log(request.body.comment);\` and see if the comment and post number appear in the server log when you comment
- [ ] Use the id value to find the matching post in the posts list.
\`\`\`javascript
  let post = posts.find(x => x.id == request.body.postId);
\`\`\`
- [ ] log that whole post to the console to make sure you've got it right. \`console.log(post)\`, check it is finding the right post
- [ ] when you find the matching post, add the comment. Look at how we add the fake test comment on every post for an example.
- [ ] delete the code that adds the fake test comment on every post

*Test*: Go to feed.html and try posting a comment. Then **Refresh** the page and see if your comment appears. (It won't appear until you refresh)

It should be working now. But we have two things to tidy up:

## We need to save comments to the database too

Otherwise, when you restart your server, the comments will disappear.

Find the code where we add comments in *index.js*

After the comment is added to the post, add this line. It will save the *updated* post over the old copy in the database.
\`\`\`javascript
databasePosts.update({id: postId}, post);
\`\`\`

> The first part \`{id: postId}\` tells the database which post to update. The second part is the new version we want to save. So it says: Find the post with this id, and replace it with this new version.

**TEST**: Add a comment, restart the server, see if your comments are still there

## Make your own comments appear straight away

In *feed.html* we can post a new comment. The comment is saved to the server, and if we refresh the page we will see it. But I want to see it appear right away!

* Find the code that writes comments into the page.
* Find the code that POSTs a comment to the server

it so: when your comment is posted to the server, it also writes your comment straight onto the page`},
{'title': 'Make the server keep track of comments and display them in the feed (comments feature)',
'body': `_Making comments work is a big job, split across several tickets. This is one part._

# Give every post a list of comments

in index.js, when we create a new post, give it an empty list called 'comments'

\`\`\`javascript
post.comments = [];
\`\`\`

Just for testing, let's add a fake comment so there will be something to display:

\`\`\`
//add a fake comment to every post
post.comments.push(\"Great question!\")
\`\`\`


*Test*: Make a new post, then look at http://localhost:3000/posts and you should see the fake comment.

> Remember to restart your server whenever you change index.js

# Display the comments in the feed

Open up  \`feed.html\`.

- [ ] Find *displayMessage*, the JavaScript function that makes a post appear on the page.

You will need to add a *loop* which loops over every comment, then adds some HTML to show that comment. Here is some code to get your started.

Put this inside the *displayMessage* function.
\`\`\`javascript
function displayComment(comment) {
    //the code in here will run for each comment
    console.log(comment); //look at your developer tools to see the comments appear
}
post.comments.forEach(displayComment)
\`\`\`

*Test*: When you look at the feed, you should see comments appear in the *Developer Tools console* (not the server's console)

- [ ] Make the comments appear in the feed instead

There is lots of code in displayMessage to make things appear in the page. Try copying some of that to start with.

> If there are old posts in the system, they won't have a comments list. You will get red error messages in your console for each of these old posts. It's ok.

*Test*: Each post should display the fake comment

That's all we're doing in this ticket. Other tickets will finish off the comments feature.`},
{'title': "Add a text input and 'reply' button after every post (comments feature) (not updated for no jquery)",
'body': `_Making comments work is a big job, split across several tickets. This is one part._

**This ticket depends on the 'unique ids' ticket being done first**

We're going to add a little area under each post where you can post a comment.

examples:

![2017-06-15 13_18_19- 1 facebook](https://user-images.githubusercontent.com/364886/27161111-47a77c8c-51cd-11e7-90e0-3b900f60458f.png)

![2017-06-15 13_17_34-play by play on twitter_ _did you take any photos at pbp17 this year and would](https://user-images.githubusercontent.com/364886/27161112-498873e4-51cd-11e7-950e-a907abc15dfb.png)

## add a reply button and a text input so you can write your comment

In *feed.html*, find the displayMessage function. This is *JavaScript* that creates *HTML*. Work out how the other parts of the posts are added to the page.

- [ ] Add an *input* (with type=\"text\") You can look at *post.html* for examples of inputs.
- [ ] Add a *button* that says 'Reply'.

*Check*: There should now be an input and button after each post.
*Check*: If there is more than one post, there should be more than one Reply button.

## make the button do something

Add this code inside the displayMessage function but at the end. It needs to happen after we add the button. 
\`\`\`
  function postComment() {
   alert(\"post id: \" + post.id + \", my comment: \" + postElement.find(\"input\").val());
  }
  postElement.find(\"button\").click(postComment); 
\`\`\`

- [ ] add the code

This says: When someone clicks on the button, run *postComment*. PostComment is a function that makes your comment pop up on the screen.

*Check*: When you click on the button, your comment pops up
*Check*: If there is more than one post, when you click on the button it shows the post ID and the matching comment

That's all we're doing in this ticket. Other tickets will finish off the comments feature.`},
{'title': 'Tool for deleting posts',
'body': `### what's this?

Let's make a delete post tool. It will let the user type in the **id number** of a post, and delete it. We will also make them put in a password, and we will only delete if the password is correct.

### step 1

Make a new page called \`delete.html\` and start off by copying everything from \`post.html\`. Then change it:

* Make sure you change the text so it's clear to people that this new page is for deleting posts!
* Change the inputs. We only need two:
* * id number (the id number of the post to delete)
* * password (only people with the password can delete posts)

> If you change the class of an input, you have to also change the class in the javascript so it still links up.

- [ ] Change where the site posts to - make it go to \"/delete\" instead of \"/posts\". (You need to change it in *2 places*)

When we save the values into the data object, the name we choose will be the name the server sees. For example \`data.message = …\` will give the server something in \`request.body.message\`.

- [ ] change the labels so we give our server \`data.postId\` and \`data.password\`

- [ ] Change the message that pops up afterwards from \"Thanks! Your message was saved!\" into \"Deleting a message...\"

### now on the server

In **index.js** teach the server how to respond to this new kind of request.

Add this code:

\`\`\`javascript
function deleteHandler(request, response) {
   console.log(\"client wants to delete this post: \" + request.body.postId );
    //code goes here
   response.send(\"ok\");
}
app.post(\"/delete\", deleteHandler);
\`\`\`

CHECK: Restart the server, try deleting a post. It won't delete yet, but you should see the message \"client wants to delete this post…\" appear in your console.

# delete the post

We need to delete the post from two places: The server has its own list, and there's another copy in the database.

## delete the server's copy

\`\`\`javascript
let postIdNumber = parseInt(request.body.postId);
posts = posts.filter(post => post.id != postIdNumber);
\`\`\`
Try deleting a post -- it should delete!

Try restarting the server. The server gets all the posts from the database, so the deleted post comes back :/

## delete the post from the database too

\`\`\`javascript
  databasePosts.deleteOne({ id : postIdNumber })
\`\`\`

Test the post is gone for good, no matter what you do.

# Security check

Let's make it only delete the post if you entered the right secret code. Use an if statement, and put all the deleting stuff inside it.

\`\`\`javascript
if (request.body.password === \"1234\") {
 //things that happen if the password was correct
} else {
  console.log(\"Wrong password\");
}
\`\`\``},
{'title': 'Search \\ filter the feed',
'body': `We'll add a search box to the feed that lets you filter the feed.

All of this is in _feed.html_  (well, almost all…)

### Add a search input

Add a search box - this will actually be a text input, just like the **text inputs** in our form. It's one line of HTML. This is where you type in what you're searching for.

Give it a class of \`filter\`

### write a search function

Make a function called \`filterFeed\`, which:
1. creates a variable \`searchText\` by getting the value from our new filter input
2. loops over each of the children in \`message-list\`, and does something. Here's the code to do that:

\`\`\`javascript
  document.querySelectorAll(".post").forEach(function(element) {
   //code in here will be run once for each post
 });
\`\`\`
1. for each post, we need to search its contents and see if it contains our search text. Then we'll add or remove the class \`hidden\` to that post.

You'll have to combine a few different things: an if statement, code to add a class, and code to search for text. This code example will print out 'yes' or 'no' based on whether the search text is found or not:

Here's an example that searches an html element for particular text:

\`\`\`javascript
searchText = \"hi\";
if (element.innerHTML.toLowerCase().includes(searchText.toLowerCase())) {
  console.log(\"yes\");
} else {
  console.log(\"no\");
}
\`\`\`

This is how you add or remove a class:

\`\`\`javascript
element.classList.add("hidden");
element.classList.remove("hidden");
\`\`\`

2. Add a new css rule

The 'hidden' class doesn't do anything unless we tell it to. Let's do that:

\`\`\`css
.hidden {display: none}
\`\`\`

3. Connect the search box to your new function so the function is run every time you type a letter:

\`\`\`javascript
document.querySelector(".filter").addEventListener("keyup", filterFeed);
\`\`\`
`},
{'title': 'Instead of a feed, show just one post at a time',
'body': `We're going to make a new page on our site that shows one post at a time, instead of the whole feed.

[ ] Make a new file named feed2.html inside the public folder
[ ] copy all the text from feed.html and paste it into feed2.html. This will be your starting point.

(We'll keep original feed as well, because seeing all the posts at once is useful for testing. We might remove it from the final site.)

[ ] In feed2.html, replace \`fetch("/posts")\` with \`fetch("/random")'

This changes the request we are making to the server. We will ask for 1 random post instead of the whole feed.

[ ] In feed2.html, replace \`.then(createFeed);\` with \`.then(displayMessage);\`

The createFeed function expects a list of posts. The displayMessage function expects one post by itself. Because the server is going to give us one post, we should call the function that expects on post.

[ ] In feed2.html, delete the createFeed function, since we no longer use it. Delete the whole function including its pair of curly brackets and their contents.

Feed2 now asks the server for a random post.

[ ] You can test the page at /feed2.html but it won't work yet.

Our server doesn't know how to answer the new "/random" request. We need to move on to the server code in *index.js*

In index.js, add this code, borrowed from our TV Show Idea generator back in week 2.

You can add this anywhere that is not inside another function:

\`\`\`javascript
//pick and return a random element from the given list
function pickRandomFrom(list) {
  return list[Math.floor(Math.random()*list.length)];
};
\`\`\`

And then this function sets up the response to the request for "/random":

\`\`\`javascript
//give the client a random post
function getRandomPost(request, response) {
  let randomPost = pickRandomFrom(posts);
  response.send(randomPost);
};

app.get('/random', getRandomPost);
\`\`\`

[ ] add both sections of code 

[ ] Restart your server, then test the new feed2.html page

You should get a randomly selected post each time you refresh the page.

### 'Next' button

Can you add a link on the page that makes a new post appear?

- [ ] You'll need to add a link for the user to click on - you've done this before!
- [ ] Give it a unique class i.e. \`class="showNextPost"

- [ ] You'll need to make a new function that contains the 'fetch, then then' lines. These lines are already in your code, but they are not wrapped up in a function yet. This means they run when the page loads but cannot run again. You need to put them inside a new function so you can call them whenver you like.
- [ ] Use JavaScript to tell your browser to run that function when the link is clicked - you've done this before too! Think back to Week 2 when we made the buttons add and remove stars in \`fivestar.html\`

Does it work? Is there a weird side effect? Can you figure out why it's happening and how you might fix it?
`},
{'title': 'User can set the date of an event - NOT UPDATED FOR NO JQUERY',
'body': `When a user posts a new event, let them set a date (what day).

We'll add a new text input (the white box you type words into) to _post.html_

### Part 1
- [ ] in post.html, add a new text \`<input>\` field where the user can write the date. You can copy and paste the input where they write their message.
- (Don't copy the whole form - we're just adding a new input, which is the empty space you write into, to the existing form. There should still only be one 'Post it!' button for the whole form.
- [ ] Make your new \`<input>\` field have a unique class name, e.g. \`class=\"dateInput\"\`
- [ ] Check: open localhost:3000/post.html and check your new input field appears on the form.

### Part 1.5

OK instead of typing in a date we want a cool date picker (like a little calendar)

That's too much work to code ourselves so we'll use one that's already been made

We can use jquery-ui, which is an extension to jquery.

- [ ] Add these line to the head of the page:

\`\`\`html
<link rel=\"stylesheet\" href=\"https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css\">
<script src=\"https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js\"></script>
\`\`\`
In the javascript near the end of your page, use this command to add a date picker to the input field

\`\`\`javascript
$( \".dateInput\" ).datepicker();
\`\`\`

Replace \`dateInput\` with the *class* that you put on the input you want the date picker to connect to.

### Part 2

If someone has already finished the issue **Clicking 'Post it!' should not go to a new page** then you need to do an extra step:
- [ ] in post.html, update the javascript so it sends the new form field to the server. (Look at the existing code for reference. You need to add one line of JavaScript code.)
- You will need to add one line to the javascript in post.html. This will be very similar to the line that starts with \`data.message =\`… but will need to set \`data.date\` instead.
- If no-one has done **Clicking 'Post it!' should not go to a new page**, you can skip this step.

### Part 3

Now it's (hopefully) being sent to the server, we need to teach the server to look out for this new information.
- [ ] We're now working in _index.js_
- [ ] look for the code that is run when a user POSTS a new post to the server.
- [ ] there is a line that writes the post's message to the console using \`console.log(request.body.message);\`. Add another line that logs request.body.date as well.
- [ ] Restart the server, post a new post and check that the event date now shows up in terminal/command prompt.
- [ ] If the date is coming through, we can now save it. You do this by setting a new new name-value pair on the \`post\`. Your code might look like this:

\`\`\`javascript
post.date = request.body.date;
\`\`\`
### Part 4
- [ ] Save some new posts then check how they look in raw form at http://localhost:3000/posts – each post should have a date now.
- [ ] modify feed.html so that each post displays the date (\`post.date\`). Try copying the code that's already there.

### notes

This task does not include updating the CSS look + feel of the post.html page. Just make it work, don't focus on making it pretty in this ticket.
`},
{'title': 'Make the feed a grid',
'body': `You need to set styles on the *container• (that contains the posts) and on the posts themselves\n\ncontainer: set \`display: flex;\`\n\nposts: give the posts a fixed \`width\` and \`height\`\n\nYou might need to set a rule to let them wrap to a new line when they run out of space going across the page - take a look here\n\nhttps://css-tricks.com/snippets/css/a-guide-to-flexbox/\n`},
{'title': 'Make all images the same size + feed look better',
'body': `Users can post images of any size. _Any size_. It gets messy.
## part 1

Use css to make the images in the feed always appear the same size - or at least, with the same width. (If you set the width of an image, its height automatically changes to keep the right proportions!

css rules to try:

\`\`\`css
width: 100%
\`\`\`

\`\`\`css
width: 100px;
\`\`\`
Decide which you prefer, and try changing the number a little bit. Make sure you try resizing your browser window to see how it looks on smaller screens too!

## Part 2

While you're here, do you feel like adding margins and padding to the parts of the feed so it looks a bit nicer? Look at your tumblr, facebook or pinterest feed and pay attention to how much empty space there is between the different text and images.
`},
{'title': 'Give each post an ID number',
'body': `This a behind-the-scenes change that will let us do cool stuff later!

Background:

_Imagine you want to 'like' a post, or reply to it. We need a way that the client can tell the server which post you are talking about! We could use their position (\"I want to reply to the 2nd post\"), but that could get confusing if we ever reorder the posts, or delete one. It's simpler if we give every post its own ID number (just like a student ID number)_
# Part 1

In _index.js_, when we create a new post, give it a random ID number

\`\`\`javascript
post.id = Math.round(Math.random() * 10000);
\`\`\`

This isn't a very good way of giving out ID numbers (do you know why?) but it's good enough for now.

_How to check your change is working_
- Remember to kill and restart the server first.
- post a new post
- Go to http://localhost:3000/posts and see if your new post has an ID number.

NOTE: our posts also have a *_id* field (with the underscore in front) - that's from our database, which gives the posts id numbers as well. We're going to ignore those though and add our own id as *id* with no underscore in front.

## Optional side adventure

In Chrome, open the Developer Tools and choose 'Console'

Try typing these commands into the console (press Enter after each one) and see if you can work out what each command does:

\`\`\`javascript
Math.random()
\`\`\`

\`\`\`javascript
Math.random() * 1000
\`\`\`

\`\`\`javascript
Math.round(Math.random() * 1000)
\`\`\`
# OK back to work (Part 2)

Let's include the ID in the feed.

Open _feed.html_

Find the code where we create each post. You will see that we insert various things into the html, like \`post.message\`, \`post.author\`, maybe \`post.time\`… You need to add \`post.id\`.

Put post.id inside a new \`<div>\` tag and give it class=\"postId\".

- [ ] Check: the post ids are now displayed in the feed.

Don't worry about making it look good, because we are going to use CSS To make it invisible!

In the style.css file, add a rule to make the ids invisible:

\`\`\`css
.postId {
    display: none;
}
\`\`\`

The ID will still be there if you view the source (using the Developer Tools), but it's invisible to users.
## Part 3

Now our posts have unique ids, we can give our server a function to get a particular post when we ask for it.

In \`index.js\`, let's make a new special GET request that the server listens to.

\`\`\`javascript
app.get('/post', function (request, response) {
   let searchId = request.query.id;
   console.log(\"Searching for post \" + searchId);
   response.send(\"fix this later\");
});
\`\`\`

Try it out by restarting the server then going to an address like this: http://localhost:3000/post?id=1001 

**that's post without the s, not posts**

If you look at the Terminal\\Command Prompt, you should see \"Searching for post 1001\"

But it doesn't actually search for the post yet.

How do we find the right post?

We can use the 'find' function to search a list for something that passes a certain test. Our test will simply check if the id is the id we are looking for.

\`\`\`javascript
   let post = posts.find(x => x.id == searchId);
   response.send(post);
\`\`\`

Test that it's working by going to http://localhost:3000/post?id=1001 again. Instead of 1001 put in the id of an actual post. It should show details of that post.
`},
{'title': 'new posts at the top instead of bottom',
'body': `Currently new posts are displayed at the bottom of the page. Let's put them at the top instead (like twitter, tumblr etc does it.)

In **feed.html**, we need to _reverse_ the order of the posts, _after_ we GET them from the server but _before_ we display them.

Once you figure out where in the code to do this, actually doing it is simple. If the list object was called posts, we'd use this line:

\`\`\`javascript
posts.reverse();
\`\`\`

(how did I know to do this? I googled 'javascript array reverse' and found this page: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse )
`},
{'title': 'removed',
'body': `- [ ] this page is pretty useless? let's get rid of it\n- [ ] Let's rename feed.html to index.html so it comes up by default if you don't ask for a particular page.\n`},
{'title': "Default picture if user doesn't include a picture",
'body': `
(This ticket can only be done after we have added the pictures feature)

If the user leaves the image link blank, include a cute default picture.

Look at \`index.js\` in the \`saveNewPost\` function.

Currently, the server copies information from the request (accessed through request.body) into a new post object.

Once it finishes, it saves the post.

*Before* it saves the post, we can make corrections to the post. Add something like this:

\`\`\`
  if (post.image === "") {
    post.image = "http://example.com/a-nice-picture.jpg"
  }
\`\`\`

Replace the URL with a link to an actual picture.

Test that it works.

While we're here, do we want to add default values for anything else that the user might leave blank? For example, if they leave the author name blank, we could replace it with "A community member" or "anonymous".

- [ ] add default values for any other fields you think should have a default value



`},
{'title': 'Make the form look good on phones',
'body': `Our post.html page looks really bad. Let's improve it!

You don't need to get it perfect – we will probably change it again later.

You will be working in **post.html** and **style.css**

Right now, our form probably looks like this:

![screen shot 2017-05-15 at 9 05 31 pm](https://cloud.githubusercontent.com/assets/364886/26050553/33dc56d2-39b3-11e7-9b7e-46dc07556c1d.png)

This layout isn't very good. It's especially bad on phones, which need bigger inputs.

Here is a great modern-looking form from trademe.co.nz:

![screen shot 2017-05-15 at 9 09 37 pm](https://cloud.githubusercontent.com/assets/364886/26050563/3e75f616-39b3-11e7-8b3b-7c3249638d84.png)

Make our form look a bit more like the TradeMe one by making some of these changes:

Try adding this code to **style.css** as a starting point.

\`\`\`css
input {
    border: 1px solid orange;
    background-color: green;
    color: red;
}

button {
   color: blue;
   background-color: green;
   border: 1px solid red;
}
\`\`\`

- [ ] make it a vertical layout (each input is below the last, instead of beside). One way to do this is to add the css rule \`display: block;\` to anything that should be on a new line.
- [ ] bigger font size
- [ ] add more *margin* and *padding* to the inputs
- [ ] Add a label above each input. You can use html like this: \`<label>Name:</label>\`
- [ ] Add a heading to the start of the form saying what the form is for, i.e. \`<h2>Write your post</h2>\`
- [ ] try some different colours?

Does your form look nice and spacious, like the TradeMe example?

### How does it look on a phone?

To test how your site looks on a small screen, open the *Developer Tools* then click this button near the top left:

![screen shot 2017-05-15 at 9 17 26 pm](https://cloud.githubusercontent.com/assets/364886/26050781/11cdab94-39b4-11e7-8679-65aed8b8d81b.png)

Now you get some options (above the web page) to choose what kind of phone you want to emulate. You can even rotate the screen!

![screen shot 2017-05-15 at 9 17 41 pm](https://cloud.githubusercontent.com/assets/364886/26050784/18f466d8-39b4-11e7-9846-89a449944007.png)

You sometimes need to *refresh the page* each time you change the kind of phone, to make everything resize correctly.

The site might look super small. We need to add this line to the head of our page to make it work properly on phones:

\`\`\`html
<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
\`\`\`
- [ ] Add the line above to the page. It should be in the head section.
- [ ] Check: this should make the page look a little bit better in the mobile preview?
- [ ] add the same line to every other HTML page in our site too, so its consistent.

### buttons

Want to customise the buttons a little bit? Here are some great examples to try.

https://www.w3schools.com/css/css3_buttons.asp
`},
{'title': 'Ghost text when filling out the form',
'body': `As a user, when I want to post a cool post, I have to backspace away the example text to put in my message.\n\nWhen I start typing in the text box, that example text should just disappear automatically. Ghost text! 👻\n\nFortunately this feature is built into modern browsers so we don't need to code it ourselves.\n- [ ] In post.html, in each of the \`input\` elements that the user can type text into, instead of setting the \`value\` (which is meant to be for what the user enters), set the \`placeholder\` instead.\n- [ ] test that the page looks and works correctly with ghost text!\n`},
{'title': 'Save and display the author of each post',
'body': `When a user posts a new post, let them put in their name so we know who posted it.

We'll add a new text input (the white box you type words into) to _post.html_
### Part 1
- [ ] in post.html, add a new text \`<input>\` field where the user can write their name. You can copy and paste the input where they write their message. Now there will be two places you can write in when you look at the page.
- (Don't copy the whole form - we're just adding a new input, which is the empty space you write into, to the existing form. There should still only be one 'Post it!' button for the whole form.
- [ ] Give your new \`<input>\` field has a unique class name, e.g. \`class=\"nameInput\"\`
- [ ] Check: open localhost:3000/post.html and check your new input field appears on the form.

### Part 2

If someone has already finished the issue **Clicking 'Post it!' should not go to a new page** then you need to do an extra step:
- [ ] in post.html, update the javascript so it sends the new form field to the server. (Look at the existing code for reference. You need to add one line of JavaScript code.)
- You will need to add one line to the javascript in post.html. This will be very similar to the line that starts with \`data.message =\`… but will need to set \`data.author\` instead.
- If no-one has done **Clicking 'Post it!' should not go to a new page**, you can skip this step.

### Part 3

Now it's (hopefully) being sent to the server, we need to teach the server to look out for this new information.
- [ ] We're now working in _index.js_
- [ ] look for the code that is run when a user POSTS a new post to the server.
- [ ] there is a line that writes the post's message to the console using \`console.log(request.body.message);\`. Add another line that logs request.body.author as well. ('author' needs to match whatever you saved it as in the data object back in post.html)
- [ ] Restart the server, post a new post and check that your author name now shows up in terminal/command prompt.
- [ ] If the author name is coming through, we can now save it. You do this by setting a new new name-value pair on the \`post\`. Your code might look like this:

\`\`\`javascript
post.author = request.body.author;
\`\`\`
### Part 4
- [ ] Save some new posts then check how they look in raw form at http://localhost:3000/posts – each post should have a _message_ and an _author_.
- [ ] modify feed.html so that each post displays the author (\`post.author\`). Find the line that creates the \`postHTML\` variable and add this to the HTML that's added:

\`\`\`javascript
+ '  <div>author goes here</div>';
\`\`\`

First check that that works - it should display 'author goes here' after every post.

Once that's working, change it to include the actual author value \`post.author\` - you may need to use quotation marks to make it clear that you want the actual \`post.author\` and don't want it to literally say \"post.author\"

### notes

This task does not include updating the CSS look + feel of the post.html page. Just make it work, don't focus on making it pretty in this ticket.
`},
{'title': 'Keep posts when server restarts',
'body': `(must be done after the 'Posts into Objects' task)

Right now, all the posts disappear each time the server restarts.

Let's check that this is true. Start your server by running \`node index.js\` in Terminal or Command Prompt. Visit your server \`localhost:3000\` in your web browser. Make a post, and look at the feed. 

You should see the post you made.

Now stop and restart the server. (Go to Terminal or Command Prompt, press Control+C to stop the server. Then start it again using the instruction above.)

You should see that the post has disappeared.

To keep the posts saved even after the server restarts, we need to save them somewhere else.

We're going to use mongoDB, a database, to store our posts. Girl Code has already signed up with a company that provides free Mongo databases, so we won't need to install any database software ourselves.
# Set up a new database on mLab
- [ ] Go to mLab.com
- [ ] Ask our mentors for the Girl Code username and password.
- [ ] Use the Girl Code account details to log in
- [ ] Create a new database (a.k.a new Deployment). Look for a 'Create New' button.

You don't want to pay any money so choose the free option when you see one. Other options like Cloud Provider or Location can be left alone.

- [ ] Under _Database Name_ give it the same name as our GitHub project, i.e. girlcode2015-term4.

Once it's created, click on it in the database list. We need to do two things:
- [ ] Add a Collection. Call it 'posts'. This is a collection of things we can save and load.
- [ ] Add a Database User. This is an account that can use this database. Give them a name and password, maybe 'girlcode' and 'hats123'.

(Leave the 'read only' box unticked. That would mean that this user can look at posts but is not allowed to make new ones. We need them to be able to create new posts.)

# Add mongodb dependency

Let's go back to our project.

We need to add a new module that lets us talk to the Mongo database.

Go to your Terminal or Command Prompt.

- [ ] make sure you are in your project folder
- [ ] If the server is running, you need to stop it to free up the console. Press Control+C.
- [ ] Now you can run the console command:

\`\`\`
npm install mongodb
\`\`\`

This downloads the module. It also records it in package.json, which is a like a shopping list -- this means  the system will know to install it for everyone else too.

_After this change is merged, everyone else will have to run \`npm install\` to get the new module. You should mention this during your code review!_

# add some database code

Near the **start** of index.js, add this code which declares an empty variable:

\`\`\`javascript
let databasePosts = null;
\`\`\`

At the **end** of index.js, add this code:

\`\`\`javascript

let MongoClient = require('mongodb').MongoClient;
let databaseUrl = 'mongodb://<dbuser>:<dbpassword>@ds015919.mlab.com:15919/girlcode1999-term1';
let databaseName = 'girlcode1999-term1';
 
MongoClient.connect(databaseUrl, {useNewUrlParser: true}, function(err, client) {
  if (err) throw err;
  console.log("yay we connected to the database");
  let database = client.db(databaseName);
  databasePosts = database.collection('posts');
  databasePosts.find({}).toArray(function(err, results) {
    if (err) throw err;
    console.log("Found " + results.length + " results");
    posts = results
  });
});

\`\`\`

This code needs a few changes.

- [ ] The databaseUrl needs to be changed to point to *your* database. Look for the \"standard MongoDB URI\" on the mLab website and copy it in.
- [ ] In the URI, replace \`<dbuser>\` with the database username that you created. (Delete the pointy brackets.)
- [ ] Also replace \`<dbpassword>\` with the database password that you created.
- [ ] On the line that starts \`let databaseName = \`, you need to put in the name of *your* database.

Try starting your server. You should see a message \"\"yay we connected to the database\" in your command prompt after a few seconds.

# What is this code doing?

> When the server starts, it will 
> 1 connect to your database.
> 2. Find the database's collection of posts.  Save this in the \`databasePosts\` variable so we can use it later.
> 3. Find all the documents in this collection, and save this list of documents into the variable \`posts\`.

# But the collection is empty

When someone makes a new post on our website, our server needs to save that post into the database collection.

- [ ] In \`index.js\`, find \`function saveNewPost\`

Add this lines inside the function, at the end. (The function ends with a \`}\` symbol, usually on a line by itself. You want to add this just before that.)

\`\`\`javascript
databasePosts.insert(post);
\`\`\`

Now new posts will be sent to the database.

# Test it out

- [ ] Restart your server.
- [ ] Make a post
- [ ] Check that the post is in the feed
- [ ] Restart your server
- [ ] Check that the post is *still* the feed!
`},
{'title': "Display each post's time",
'body': `**This task can only be done after #4**
# PART 1

Now that posts are objects, we can add other information to them.

We're going to give each post a time stamp.
- [ ] When a post is saved on the server (index.js), as well as saving the message into \`post.message\`, create a new name-value pair like this: \`post.time = \"test\";\`
- [ ] Restart you server and test that it's working: in your web browser, post some new messages, then go to http://localhost:3000/posts and look at the raw list of posts. You should see that each post now has a time as well as a message.
- [ ] Instead of always setting the time to "test", get the actual date and time - try googling "how do i get the current date in javascript"… if you get stuck for more than 5 minutes, ask for help :)
- [ ] Now in feed.html add the post.time so it displays after the post.message. Find the line that creates the \`postHTML\` variable and add this to the HTML that's added:

\`\`\`javascript
+ '  <div class="time">time goes here</div>';
\`\`\`

Test that that displays 'time goes here' in the place where you want the time to appear.

Now, you'll need some careful use of quotation marks and pluses to make javascript include the actual \`post.time\` inside the tags. Look at the nearby code for reference!

After this change, when you look at http://localhost:3000/feed.html you should see the time for each post - but it's not pretty yet.

# PART 2

Working in _feed.html_

Right now, our timestamp should like this: \`2015-09-09T03:42:18.991Z\`. Only good if you are a robot  🤖

We can make that nicer, but it will take a lot of code. _Fortunately, someone else has already written the code for us!_ I found a plugin that will work, it's called timeago.js.

- [ ] Download timeago.min.js from here: https://raw.githubusercontent.com/hustcc/timeago.js/master/gh-pages/timeago.min.js
- [ ] Move timeago.min.js into our project's public folder.
- [ ] Include the script in our feed by adding this link to the _head_ section of feed.html

\`<script src=\"/timeago.min.js\"></script>\`

(It should go just below the other \`<script>\` line in the head section)

Now your web browser will include that script every time the feed is loaded.

The script gives us some new commands. (The full documentation is at https://github.com/hustcc/timeago.js if you need to look up something that's not written here.)

- [ ] to display the post time nicely, replace \`post.time\` with this:

\`timeago.format(post.time)\`

- [ ] check that your times are now pretty! They should say something like \"11 minutes ago\"

# PART 3

It's kind of confusing that the time is the same color as the text and author name.

Let's give the time some CSS rules so it displays differently.
- [ ] Add a css rule to \`style.css\` that makes the time display in a different colour.

Check the feed to see that the time is now in a different colour.
`},
{'title': 'Publish our app on the internet',
'body': `Until now, we have tested our site by running a local server on our own computers. These servers are not public.

We are now going to make a public copy of our server, so anyone can use our app. We are using a company called Heroku to host our server.

- [ ] Ask one of our mentors to give you Girl Code's Heroku username and password

- [ ] Go to heroku.com and log in.
- [ ] You will see a long list of apps from previous Girl Code classes.
- [ ] Click 'New' to create a new app.
- [ ] Pick a name that's easy to remember, maybe the same as our github project name i.e. girlcode2016-term3
- [ ] Create the app! The other options like region do not matter.

You should now see the control panel for our app.

Now we need to tell Heroku where to get our code from.

- [ ] Select the 'Deploy' tab (it might already be selected).

(We don't want to use Pipelines, so you can ignore any options to do with pipelines.)

We need to connect the app to GitHub. Choose the GitHub user *girlcodeakl* and the repository name (something similar to *girlcode2016-term3*).

- [ ] Connect GitHub with the right GitHub user and repository name.

Now we need to enable Automatic deploys. This means the public app will automatically update whenever we update the master branch of our app.

- [ ] Look for the 'Automatic deploys' section
- [ ] Make sure the master branch is selected
- [ ] *enable automatic deploys*

This means the site will be deployed every time someone changes the master branch.

### Testing and bug-fixing

OK, we better test this out.

Look for the 'Manual deploy' section and use it to deploy the master branch.

Some text should appear to tell you what's going on. Eventually it will say your deploy succeeded. (If it doesn't, call a mentor as something unexpected is going on!)

- [ ] Click the 'View' button to look at the app.

Uh oh, your app is not working properly! (This is expected.)

We need to look at the logs to see what went wrong.

- [ ] Scroll to the top of the page, click 'More' and choose 'View logs'

(Note that there are two different logs. We don't want to look at the 'build logs', which you might have seen further down the page.)

There are two problems we expect you to get. The first is indicated by the line *npm ERR! missing script: start*

- [ ] check that you see that error in the log

Heroku is saying: You gave me this code, but you didn't tell me how to start it up.

To start our app, we run \`node index.js\` -- we know that, but how do we tell Heroku? We need to add the instructions into \`package.json\`

- [ ] in VS Code, open up \`package.json\`
- [ ] add this in:

\`\`\`javascript
"scripts": {
     "start": "node index.js"
   }
\`\`\`
Some tips:
* You need to add this inside the outermost pair of curly brackets
* You will need to add a comma somewhere to make this work. Notice where commas appear in this file -- can you work out what the rule is? Commas appear after a closing curly bracket, but not if it's the last one... have a look.
* Look at the colour-coding in VS Code -- if you you are missing a comma, or have it in the wrong place, you might see some words in a colour that doesn't match the pattern of everything else.

- [ ] after your change to package.json, restart your local server and test it (at localhost:3000) just to make sure you didn't break the site.
- [ ] _commit_ this change. Commit it straight to the master branch - normally this is bad manners but you have to today to make Heroku use it.
- [ ] After you commit, push your branch.
- [ ] (You don't need to do a pull request, you've skipped that step by pushing straight into the master branch.)

Heroku should automatically deploy your change because we set up auto deploys.

- [ ] Look at the log on the Heroku website again.

After a few minutes, some new lines should appear. The app is starting up again! Is it working? Click on 'Open app' at the top right to view it.

Now, it's probably still not working. But you should get a **different** error this time, and that's a good sign.

We expect you to see a line like this: 

\`\`\`
Error R10 (Boot timeout) -> Web process failed to bind to $PORT within 60 seconds of launch
\`\`\`

We've seen this before. If you hadn't, you'd have to google it. The problem is that our app always listens at port 3000, but on Heroku you are only allowed to listen on the port they give you -- and it might be different every time 

If you don't start listening on the correct port, it shuts you down after 60 seconds.

- [ ] in index.js, find the line that makes our app listen to port 3000. (Try searching for '3000')
- [ ] Change from \`3000\` to \`(process.env.PORT || 3000)\` - which means "get the port number from the configuration, or if it hasn't been configured, just used 3000.
- [ ] On your computer, restart your server and just check you haven't broken anything.
- [ ] commit your change to the master branch
- [ ] Push your branch
- [ ] Heroku will take a few minutes to deploy the new version. See if it's starting up properly now.

(It should be working now!)

Now we have a public version of our app. And it will update every time we update the master branch.

- [ ] post the link to the app in our slack channel so everyone can check it out!
`},
{'title': 'User can include a picture with their post (no css, just make it work)',
'body': `***This can only be done when #4 and #2  has been completed

The post form in post.html should let you include a link (URL) to an image file
# PART 1
- [ ] on post.html, add a new text input field inside the form. This is where the user can paste in the url of an image.
- Don't add a whole new form - just add a new field (that's the empty space you write into) inside the form that's already there. This is _one line_ of HTML code.

If someone has already finished the issue **Clicking 'Post it!' should not go to a new page** then you need to do an extra step:
- [ ] in post.html, update the javascript so it sends the new form field to the server. (Look at the existing code for reference. You need to add one line of JavaScript code.)
- If no-one has done **Clicking 'Post it!' should not go to a new page**, you can skip the step above.
- [ ] use the Chrome Developer Tools to check that it's posting the new value when you post.

How to check what is being sent to the server:

> with post.html open in Google Chrome, open the Developer Tools 
> Click on the _Network_ tab 
> Now on the form, click the button 
> You should see a new item 'posts', appear in the Developer Tools. This line is the POST request. Click on it to see what happened 
> Choose the Headers section, scroll to the bottom to see the form data, and make sure all the form fields are visible - that means they were sent to the server. 
# PART 2
- [ ] on the server (index.js), look for the code that runs when a new post is POSTed (it starts with \`app.post\` and calls a function) You need to add a line to that function so that the image url is saved into the new post object.
- [ ] check that the image url is being saved by looking at the raw posts at http://localhost:3000/posts - do you see the image urls appearing?

(Remember that because you're changing index.js you'll need to restart your server to make it read your changes.)
# PART 3
- [ ] Now we have these images, we need to display them in the feed. In feed.html, you will need to modify the code that creates each post so that it includes the image URL. 

In feed.html, find the code that creates a variable \`postHTML\`. There are several lines that add different elements to the HTML. Find the line that adds the message, and add this new line before it (so the image appears above the message):

\`\`\`javascript
  + '  <img src=\"http://example.com/image.jpg\">'
\`\`\`

This should create an image, but it will be a broken image link because the URL is wrong. You need to include \`post.image\` as the URL. You'll need some careful use of quotation marks and pluses to make javascript include the actual \`post.image\` instead of just literally saying post.image.
- [ ] TEST: you can now post glorious images to the message feed

If you are having trouble in this step, the Developer Tools may help. Right click on a post in the feed (in Google Chrome) and choose Inspect to see the HTML code. Compare it to an image in another website, like your Neocities website, and try to spot the difference.
`},
{'title': 'Change posts into objects, not strings, so we can save more info about each idea - (this must be done ASAP!)',
'body': `### background

On the server, whenever a post is saved, we will eventually want to save extra info like:
- who posted it
- what time it was posted
- maybe a picture?
- maybe the number of Likes or Reblogs the post has

Before any of that is possible, we need to change our posts from being a \`string\` to being an \`object\`.

A string is a sequence of letters - like a word, a sentence, or a paragraph.

here are some example strings

\`\`\`javascript
let string = \"hello, i am a string\";
let string2 = \"i am another string\";
let string3 = \"a\";
let string4 = \"\"; //this is an empty string!
\`\`\`

An object, in JavaScript, is a bit like a filing cabinet or a dictionary or a phone book. It can have lots of values and each value is filed under a certain label. Programmers call these \"name-value pairs\" because each value has a name.

\`\`\`javascript
let obby = {}; //create an empty object
obby.rating = 10; //created a name-value pair: the name is rating and the value is the number 10
obby.greeting = \"hello!\"; //the name is greeting and the value is a string
\`\`\`
### PART 1:

You will need to change the data structure a bit, so each idea is an object, not just a string.

Look in index.js for the line that pushes the user's new post into the list of posts.

We currently get the value \`request.body.message\` which is a string, and save it straight into the posts list.

\`\`\`javascript
posts.push(request.body.message);
\`\`\`

Replace that line with this:

\`\`\`javascript
let post= {};
post.message = request.body.message;
posts.push(post);
\`\`\`

These new lines do this:
1. Creating an empty object called \`post\`. Objects can contain many values, each value has a name.
2. Under the name 'message', add the user's message.
3. Save this object by pushing it into the end of the list of posts.

_Because you've changed index.js, you will need to restart your server now._
### PART 2: Displaying the message again

If you look at the message feed, and post a post, it won't look right any more. It comes out as \`[Object object]\`.

In _feed.html_, we need to change the code to display the post.message instead of trying to write out the whole post object.
- [ ] in feed.html, the post displays as \`[Object object]\`. You will need to tell the page to pull out the _message_ from the object. Instead of inserting\`post\` into the page, make it insert \`post.message\` instead.

(You should only change one line in feed.html - it's the line where post.message is added into a string. Look for some \`+\` plus symbols!

Commit your changes. Check everything works! Then sync and make a pull request!
`},
{'title': "Put links on every page so it's easy to navigate between pages",
'body': `As a user, I don't like having to remember all the URLs and type them in by hand.

I'd like to be able to click on links to get to every page on the site, and never get stuck on a page with no links.
- [ ] Make some HTML to add a list of links to all the pages in the site
- [ ] Add CSS to the style.css file to make the links appear as a bar going across the page instead of a list going down the page. You may need to put the links in a div with a new class, i.e. \`<div class=\"nav-bar\">\`
- [ ] Add the HTML to every page
- [ ] check it works on every page

(This is often called the 'navigation bar' or 'nav bar')

## Notes

this is what a navigation bar looks like

![screen shot 2015-08-20 at 1 20 13 pm](https://cloud.githubusercontent.com/assets/364886/9373422/5f46085e-473e-11e5-9bb8-9aa4e33ca0e5.png)

I googled 'how to make a navigation bar' and got this page
https://www.w3schools.com/howto/howto_js_topnav.asp

Note: Links have a built in style that makes them blue and underlined. This rule will override the rules they inherit from the navbar. You need to make a _more specific style_ to override the link styles. For example, if your navbar has class=\"navbar\", this rule will change the color of the links inside the navbar and remove their underline:

\`\`\`css
.navbar a {
    color: pink;
    text-decoration: none;
}
\`\`\`

That rule applies to links \`<a>\` that are _inside something_ that has class=\"navbar\"
`},
{'title': "Clicking 'Post it!' should not go to a new page",
'body': `Currently, when you click 'Post it!' on the **post.html** page, you are taken to a new page that says \"thanks for your message. Press back to add another\"

This is confusing and not very attractive.

After this change, when you click the button,
1. you stay on the same page
2. a little box pops up that says "Thanks! Your message was saved!"

All these changes are in post.html.

## Part 1

In **post.html**, we're going to use JavaScript to change what happens when you click the 'Post it!' button:
- [ ] in the html, add a class to the \`<button>\` so we can find it using javascript - it should end up looking like \`<button class=\"postButton\">\`
- [ ] add a pair of \`<script>\` tags so we can add some javascript between them. Add these near the end of the file, just above \`</body>\` and \`</html>\`
- [ ] in your script, add this function:

\`\`\`javascript
function sendMessageToServer(e) {
    e.preventDefault();
    alert(\"nothing happens - except this alert!\");
}
\`\`\`

Now we must tell the button to run the function when you click on it. This is similar to what we did in the fivestar and tvshow activities.

- [ ] add this line to your javascript:

\`\`\`javascript
document.querySelector(\".postButton\").addEventListener(\"click\", sendMessageToServer);
\`\`\`

_What is this doing?_
* We told the button to call the function when you click on it
* Inside the function, \`e.preventDefault()\` turns off the browser's built in action (which was to send data to our server AND go to a new page).
* The \`alert\` command is just there to show your code is working. We will delete it later because it's super annoying.
- [ ] TEST: clicking 'Post it!' should now make an annoying message pop up! But it does NOT add anything to the message feed any more. yay :/

## Part 2

history lesson (you can skip this):

> Before your change, this page works using an old-school technique from before JavaScript was a thing. In the HTML is a form. A form is just like a paper form - you fill it in. When you press the button, your browser takes all the things you wrote, puts them together into a message, and POSTs it to the address specified at the top of the form. Then your browser waits for the response from the server. When it arrives, it displays the response (\"Thanks for your message…\").

In your new function, we now need to do the same thing but write it ourselves: make it do a POST that sends the right info to the server.

Here is an example of how to post something to the server:

\`\`\`javascript
let data = {};
fetch("/url", {
  method:"POST",
  body: JSON.stringify(data),
  headers: {'Content-Type': 'application/json'}
});

\`\`\`
- [ ] add that code **inside** the sendMessageToServer function. (Look for \`function sendMessageToServer\`. The code inside the function is the next few lines, between the \`{\` and the \`}\`.)
- [ ] Change the first argument from \"url\" to \"/posts\" - this is where we are posting to. (It has to match the address the server is listening to in index.js)
- [ ] TEST: clicking the button should now add a new message to the message feed - but it will be \`null\`, instead of what you typed in.
- [ ] delete the annoying \`alert\` command.

### Part 3

How do we get the words the user typed in, and send them to the server?

We will use javascript to get the part of the HTML page the user is typing into.
Just like the button, we need to give this part of the HTML a class so our javascript can select it.
- [ ] Add a _class_ to the \`<input>\` where your message goes. i.e. \`class=\"messageInput\"\`

Now we can select it with javascript, and get the value out of it using the \`.value\` function.

We save the value into the data object.

\`\`\`javascript
data.message = document.querySelector(\".messageInput\").value;
\`\`\`

You'll need to add the line above just after the line \`let data = {}\`. That means, after we create an empty object named 'data', but before we send the object to the server, we add some information to it.
- [ ] Test: Make a post. The post should correctly appear in the feed.

### Part 4: show feedback
- [ ] Add an empty div to the page (inside the \`body\`) with a class 'note' i.e. \`<div class=\"note\"></div>\`
- [ ] In your sendMessageToServer function, add a line that selects that div and changes the text inside it to say \"Thanks! Your message was saved!\" using some code like this: \`document.querySelector(\".note\").innerHTML = \"Thanks! Your message was saved!\";\`

- [ ] TEST: when you post, the page shows some feedback to let you know it saved your post.
- [ ] TEST: the page doesn't show the feedback until you post something.
`},
{'title': 'copy across ToastToppings',
'body': `We'll use the previous activity as a base for our project. Copy across the code from last time, maybe clean it up a little too.\n`},
]

let mainEl = document.querySelector('main')
//let cleanIssues = "["
issues.reverse()

function fragment (text) {
  return document.createRange().createContextualFragment(text)
}

function escapeForHTML (text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

for (let issue of issues) {
  let issueEl = document.createElement('div')
  issueEl.classList.add('issue')
  mainEl.appendChild(issueEl)

//  let cleanIssue = issue
//  cleanIssues = cleanIssues + JSON.stringify(cleanIssue) + ",\n"

  issueEl.appendChild(fragment(`<h3 class="selectAll title">${escapeForHTML(issue.title)}</h3>`))
  issueEl.appendChild(fragment(`<a href="#" class="close hidden">Close</button>`))
  issueEl.appendChild(fragment(`<button class="btn addToProject">Add to project</button>`))
  issueEl.appendChild(fragment(`<a class="viewMarkdown linkButton" href="#">view markdown</div>`))
  issueEl.appendChild(fragment(`<a class="viewFormatted linkButton" href="#">view formatted</div>`))
  issueEl.appendChild(fragment(`<div class="issueBody hidden selectAll">${escapeForHTML(issue.body)}</div>`))

  issueEl.addEventListener('click', function (e) {
    const isAction = (action) => e.target.classList.contains(action)
    const hide = (selector) => e.currentTarget.querySelector(selector).classList.add('hidden')
    const show = (selector) => e.currentTarget.querySelector(selector).classList.remove('hidden')

    if (isAction('close')) {
      hide('.issueBody')
      hide('.close')
      hidePreview(e.currentTarget)
      e.preventDefault()
    } else if (isAction('addToProject')) {
      hide('.addToProject') // immediately hide to prevent double clicks
      addIssueToProject(issue.title, issue.body)
    } else if (isAction('viewMarkdown')) {
      e.preventDefault()
      show('.issueBody')
      hidePreview(e.currentTarget)
      e.currentTarget.querySelector('.close').classList.remove('hidden')
    } else if (isAction('viewFormatted')) {
      e.preventDefault()
      addPreviewTo(e.currentTarget)
      hide('.issueBody')
      show('.close')
    }
    if (isAction('selectAll')) {
      window.getSelection().selectAllChildren(e.target)  
    }
  })

}
//cleanIssues = cleanIssues + "]"

//to export: console.log(cleanIssues)

function hidePreview (parentEl) {
  const preexisting = parentEl.querySelector('.preview')
  if (preexisting) {
    preexisting.classList.add('hidden')
  }
}

function addPreviewTo (parentEl) {
  const preexisting = parentEl.querySelector('.preview')
  if (preexisting) {
    preexisting.classList.remove('hidden')
    return
  }
  const converter = new showdown.Converter()
  converter.setFlavor('github')
  const el = parentEl.querySelector('.issueBody')
  let source = el.innerHTML
  source = source.replace(/&lt;/g, '<')
  source = source.replace(/&gt;/g, '>')
  source = source.replace(/&amp;/g, '&')
  const result = converter.makeHtml(source)
  parentEl.innerHTML += "<div class='preview'><div class='markdown-body'>" + result + '</div></div>'
}

document.querySelector('.expandAllButton').addEventListener('click', function () {
  document.querySelectorAll('.issueBody').forEach(function (el) {
    el.classList.remove('hidden')
    el.parentNode.querySelector('.close').classList.remove('hidden')
  })  
})

function refreshUsedIndicators() {

  fetch(`https://api.github.com/repos/girlcodeakl/${getProjectName()}/issues?state=all&per_page=100`,
    {
      headers: {
        'Authorization': 'token ' + getToken()
      }
    }
  )
  .then(function (response) {return response.json()})
  .then(function(issues) {
    for (let issue of issues) {
      markIssueAsUsed(issue.title)
    }
  })

  function markIssueAsUsed (title) {
    const titleElements = document.querySelectorAll('.title')
    for (var i = 0; i < titleElements.length; i++) {
      if (titleElements[i].textContent.toLowerCase() == title.toLowerCase()) {
        titleElements[i].parentNode.classList.add('used')
        titleElements[i].parentNode.querySelector('.addToProject').classList.add('hidden')
        break
      }
    }
  }
}

function addIssueToProject(title, body) {
  let data = {}
  data.title = title
  data.body = body
  fetch(`https://api.github.com/repos/girlcodeakl/${getProjectName()}/issues`,
  {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Authorization': 'token ' + getToken()
    }
  })
  .then(function (response) {return response.json()})
  .then(function(response) {
    console.log(response.title + ' created')
    refreshUsedIndicators()
  })
}

refreshUsedIndicators()

const settingsWarning = document.querySelector('.settingsWarning')

if (getToken() === null || getToken() === '') {
  settingsWarning.classList.remove('hidden')
}

document.querySelector('.showSettings').addEventListener('click', 
  function (e) {
      document.querySelector('.settings').classList.toggle('hidden')
      settingsWarning.classList.add('hidden')
    }
  )


const projectNameInput = document.querySelector('.projectNameInput')
projectNameInput.value = getProjectName()
projectNameInput.addEventListener('keyup', function (e) {
  setProjectName(projectNameInput.value)
})

const tokenInput = document.querySelector('.tokenInput')
tokenInput.value = getToken()
tokenInput.addEventListener('keyup', function (e) {
  setToken(tokenInput.value)
})

function getToken () {
  return window.localStorage.getItem('token')
}

function setToken (value) {
  window.localStorage.setItem('token', value)
}

//could be shared
function getProjectName () {
  return window.localStorage.getItem('projectName')
}

function setProjectName (value) {
  window.localStorage.setItem('projectName', value)
}
