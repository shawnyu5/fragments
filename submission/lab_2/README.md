<!-- vim-markdown-toc GFM -->

* [Lab 2](#lab-2)
   * [AWS Academy Learner Lab](#aws-academy-learner-lab)
   * [AWS Management Console](#aws-management-console)
   * [Amazon Cognito User Pool Setup](#amazon-cognito-user-pool-setup)
   * [Create the `fragments-ui` web app and repo](#create-the-fragments-ui-web-app-and-repo)
   * [Client App Setup](#client-app-setup)
   * [Connect Web App to User Pool](#connect-web-app-to-user-pool)
   * [Test Authentication Flows](#test-authentication-flows)
   * [Secure fragments Routes](#secure-fragments-routes)
   * [Connect Client Web App to Secure Microservice](#connect-client-web-app-to-secure-microservice)
   * [Submission](#submission)

<!-- vim-markdown-toc -->

# Lab 2

This is lab covers some critically important concepts and technologies. It will
get you started working with AWS and guide you through securing your `fragments`
microservice. It will also show you how to create a simple web client,
`fragments-ui`, for manual testing of your `fragments` microservice API.

This lab will take you some time to complete, so please give yourself lots of
time to work on it. You don't need to finish it in a single sitting and are
encouraged to break it up over a series of sessions. As you work, remember to
use git to `add` and `commit` your changes (e.g., whenever you get something
working, or make a significant change).

The cloud is big and complicated by the fact that you have to worry about
security from day one. Everyone doing this lab is going to get stuck or run into
problems. That's OK! Write down any questions or problems you encounter and
bring them up in the course Discussions. I promise you won't be the only person
who struggles with something.

Take your time. Don't give up if you get stuck. Ask questions. You can do this!

## AWS Academy Learner Lab

1. You will have received an email with links to create your **AWS Academy Learn
   Lab account**. If you did not receive one, please contact your professor.
   Once you create your account, please read the **AWS Academy Learner Lab -
   Student Guide.pdf** in the **Modules** section of the course.

2. Once you're ready to start the lab, click **Modules** and then **Learner Lab
   - Foundational Services**. Start the lab environment by clicking the **Start
     Lab** button. It takes a while to start, especially the first time, since
     cloud resources have to be provisioned. Your lab session (and AWS Learner
     Lab account environment) will be available for **4 hours** from the time
     you start the lab. You can monitor your remaining lab time at the top of
     the lab. If you need more time and are going to run out, you can always
     click **Start Lab** again to **restart** the clock. When you're done
     working, click **End Lab** to pause your AWS resources. NOTE: nothing will
     be deleted, and you can carry on later by restarting the lab. Be careful
     not to hit the **Reset** button, which **will** delete everything.


3. When the lab is stopped, the **AWS** button will have a red dot next to it.
   When the lab is starting, the button will have a yellow dot. Once the lab
   environment is fully started, the **AWS** button will have a green dot next
   to it. Once it goes green, you can click it to open the [AWS Management
   Console](https://aws.amazon.com/console/faq-console/) in a new tab.

4. You are now logged into AWS with a **temporary account and session**. This
   account is able to access more than 50 AWS services. Any resources that you
   provision in the AWS Console will continue to exist after you end the lab
   session. NOTE: some services will continue to work when the lab session is
   ended and others will be paused (e.g., EC2 instances). When you click **Start
   Lab** again, all of your resources will be available/re-started.

5. You have **$100 AWS credits** available to your account. This **cannot** be
   increased and once you spend it, it's gone. You must pay careful attention to
   your spending, and not waste money on services not needed for the labs and
   assignments. You can monitor your spending using the information at the top
   of the lab, which will say how many of your $100 AWS credits have been used.
   NOTE: this value is often delayed by up to **8 hours**.

6. Back in the **AWS Academy Learner Lab** browser tab, clicking the **AWS
   Details** button will show you various details about your session, including
   the **AWS CLI Show** button. Clicking the **Show** button will reveal your
   [AWS Security
   Credentials](https://docs.aws.amazon.com/general/latest/gr/aws-security-credentials.html).
   They include a [Profile
   name](https://docs.aws.amazon.com/sdkref/latest/guide/file-format.html), an
   [Access
   Key](https://docs.aws.amazon.com/sdkref/latest/guide/setting-global-aws_secret_access_key.html),
   [Secret
   Key](https://docs.aws.amazon.com/sdkref/latest/guide/setting-global-aws_secret_access_key.html),
   and [Session
   Token](https://docs.aws.amazon.com/sdkref/latest/guide/setting-global-aws_session_token.html)
   and will look something like this:

```ini
[default]
aws_access_key_id=AKIAIOSFODNN7EXAMPLE
aws_secret_access_key=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
aws_session_token=AQoEXAMPLEH4aoAH0gNCAPy...rkuWJOgQs8IZZaIv2BXIa2R4Olgk
```

Here the credentials for the `default` profile are defined. NOTE: in the future
we will store these credentials in an [`.aws/` folder in your home
directory](https://docs.aws.amazon.com/sdkref/latest/guide/file-location.html),
for example: `~/.aws/credentials`. For now, you don't need to do anything with
them, other than learn where to find them.

We'll need these values in order to work with many AWS tools and SDKs locally. Your credentials should be kept **secret**. Don't share them, check them into git, or lose them.

Also be aware that **your Account credentials (e.g., session token) will change each time you start and stop the lab environment**. Whenever you need to work with AWS credentials on your local machine, you'll have to get the updated ones for your current lab session (it's annoying, but we'll work around it with some scripts later on).

7. An **AWS CLI** terminal is also available in the lab view. It is automatically configured with your current **AWS Security Credentials**, and you can use the [AWS CLI](https://aws.amazon.com/cli/) to manage your AWS services. Type `aws help` to see help info (press `space` to scroll, `q` to exit).

## AWS Management Console

8. Click the **AWS** button to open the **AWS Management Console** logged into your student account. At the top, click the **Services** button to see a list of all AWS Services, or **Search for services, features, blogs, docs and more**.

9. The first service we'll use is [Amazon Cognito](https://aws.amazon.com/cognito/), which lets you add [user sign-up, sign-in, and access control](https://aws.amazon.com/cognito/details/) to any app. Amazon will automatically manage and securely store your user accounts, providing APIs and UI to authenticate, authorize, and manage users. The service is [free (forever) to use for the first 50,000 users each month](https://aws.amazon.com/cognito/pricing/?loc=ft#Free_Tier), and is then billed per monthly user activity. The [docs](https://aws.amazon.com/cognito/getting-started/) have more details about [User Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/getting-started-with-cognito-user-pools.html) and how to use them.

10. In the **AWS Management Console** search bar, type `Cognito` to find the Amazon Cognito service.

## Amazon Cognito User Pool Setup

A [User Pool](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html) is a user directory (i.e., account database). Instead of building and maintaining our own auth system, we'll use an Amazon cloud service. We'll rely on a User Pool to [authenticate users in a web app](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-scenarios.html#scenario-basic-user-pool) and to [authorize users of our back-end microservice](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-scenarios.html#scenario-backend).

11. To create a **User Pool**, click the **Manage User Pools** button in the AWS Console Amazon Cognito page. NOTE: there is both a legacy _and_ new user interface for Amazon Cognito, and these instructions will use the old UI. You're free to use whichever you want, but be aware of different naming if you use the newer UI.

12. Click the **Create a user pool** button, and give your pool a name. For example, `fragments-users`.

13. Click the **Step through settings** button so that we can configure our user pool's options one-by-one.

14. Set the **User Sign In** options to use **Username** and **Also allow sign in with verified email address**. Make sure **Enable case insensitivity for username input** is selected.

15. Set the **Standard Attributes** for user profiles. These will be required when users sign-up. In our case, `email` and `name` is probably all that we need, but you can add others if you want. Whenever possible, try to reduce the amount of data you ask for and collect about your users. Any data that you collect becomes **your** responsibility to secure, maintain, and manage. The less data you store about your users, the better, especially if you ever get hacked or have a data breach. We don't need any **Custom Attributes** in our user pool, so click **Next step**.

16. Set the **Password** options that you want to use. The defaults are OK, but you can decide and adjust things as you wish. When you're finished, click **Next step**.

17. Set the **Multi-Factor Authenticate (MFA) and Account Recovery** options. There are extra charges associated with MFA, which we won't use. The only attribute that we'll verify is the user's **Email** (i.e., a user will have to prove they own an email address before we allow them to sign up). Also make sure that you select **Email** under **Which attributes do you want to verify?**. This will allow Cognito to email a verification code to a user's email address in order to validate their ownership of the email address. The other defaults are OK as they are. Click **Next step**.

18. Set the **Message Customization** options that you want to use. When a user signs up, these are the email messages that get sent. The defaults are OK, but you can modify the **Verification and Invitation** messages if you like. Click **Next step** when you are done.

19. Create any **Tags** that you want to use for this resource. [AWS Tags](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html) are used to help identify services and resources for billing purposes. We won't use any tags, so you can click **Next step**.

20. Set the **Devices** options that you want to use. The defaults are OK (i.e., we don't need to remember device logins). Click **Next step**.

21. Set the **App Clients** options that you want to use. In the next sections, we'll create a web app to test our `fragments` API, so we need to register an App Client now. Click **Add an app client**. Give your App Client a name: `fragments-ui`. Next (and this is important), **uncheck** the **Generate client secret** checkbox: since we're building a web app, we can't use a client secret (i.e., you can't hide a secret in JavaScript run in a browser, because it gets downloaded as plain text). The other settings are fine using the defaults. Click **Create app client**. The `fragments-ui` should be listed as one of the app clients that will have access to this User Pool. Click **Next Step**.

22. Set the **Workflow Triggers** options that you want to use. These triggers represent calls to serverless cloud functions (i.e., [Lambda functions](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)) that happen at different stages of authentication and authorization. We won't be using any custom triggers or functions, so you can click **Next Step**.

23. Review all the **User Pool** settings and edit any options that you want to change (i.e., click the pencil icons to edit a section). When you are happy, click **Create pool**.

24. Pay attention to the **User Pool's** details. For example, the `Pool_Id`, which includes the AWS Region (e.g., `us-east-1_...`) and an [Amazon Resource Name (ARN)](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html), which uniquely identifies this AWS resource (i.e., like a URI). We'll need the `Pool_Id` later on in this lab. You can also manage the pool's users by clicking on the **Users and groups** option under **General settings** on the left-hand menu (currently, there are none).

If you make a mistake, or need to redo the steps above, you can always delete this user pool and start again. When you are satisfied that you've done it correctly, move on to create your web app client.

## Create the `fragments-ui` web app and repo

25. Before going any further, we need to create a simple web app to manage authentication with our User Pool and test our back-end `fragments` microservice.

26. Similar to what you did in [Lab 1](../lab-01/readme.md) (i.e., you can follow the same basic steps), [create a new **Private GitHub Repo**](https://github.com/new) named `fragments-ui` with a `.gitignore` (for `node`) and a `README.md`.

27. [Clone](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) your `fragments-ui` repo to your local machine and go into the `fragments-ui` directory. I would suggest cloning your `fragments-ui` and `fragments` repos in the same parent folder:

```
cloud-for-programmers/
├─ fragments/
├─ fragments-ui/
```

NOTE: these are separate repos, but since we'll often be working on them together, it's nice to have them close to each other. You can always move a git repo to a new location, or rename it, using the `mv` command (i.e., it's just a directory that contains a `.git/` sub-directory, there's nothing special about it from a filesystem point of view).

28. Set up your web project using `npm`:

```sh
cd fragments-ui
npm init -y
```

Edit your `package.json` file to look something like this (change the details to use your own info):

```json
{
  "name": "fragments-ui",
  "private": true,
  "version": "0.0.1",
  "description": "Fragments UI testing web app",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/humphd/fragments-ui.git"
  },
  "author": "David Humphrey <david.humphrey@senecacollege.ca>",
  "license": "UNLICENSED"
}
```

29. You're creating a simple web app for testing your microservice, and you can choose any web framework/libraries that you want to use. It doesn't matter what you use, including React, Angular, Vue, Svelte, etc. or no framework at all (i.e., just HTML and JavaScript or TypeScript). We aren't building a production-grade web app, just a very simple test UI. You can use this as a way to play with a new framework if you want, or keep things easy and use none; it's up to you. In my sample code below, I'll use no framework and just write basic HTML, CSS, and JavaScript.

If you choose to use a web framework, install the necessary dependencies and get it set up.

If you choose not to use a framework, at least use [Parcel](https://parceljs.org/) to bundle your JavaScript, manage environment variables, and provide hot-reloading. Follow the [installation instructions for using Parcel with a web app](https://parceljs.org/getting-started/webapp/). NOTE: Parcel generates build files (`dist/` directory) and a cache (`.parcel-cache/` directory) that you should add to your `.gitignore`. Build artifacts (things you generate) don't belong in git.

Because you have already completed all of the web stream courses, I assume that you can create and set up a web app on your own. However, I will give you specific instructions and code related to working with the AWS Cognito User Pool.

30. Make a note of the **Port** and **Hostname** that your web app runs on locally (i.e., when you `npm start` your app). For example: many React apps run on <http://localhost:3000>; Angular apps on <http://localhost:4200>; and Parcel uses <http://localhost:1234>. We'll need this info in the next steps.

## Client App Setup

We need to tell Amazon Cognito about our web app. For security reasons, Cognito
won't allow just any app to access your user pool, it has to be pre-registered
and configured first.

31. Go back to the **AWS Management Console**, and to your **Cognito User Pool**, where we need to configure our **App integration**. That is, we have to tell our User Pool details about our web app so that it can be configured, and authentication redirect URLs set up.

32. Click the **App client settings** option on the left. Make a note of the **ID** (i.e., the **Client App ID**) for your `fragments-ui` App client, which is a 26 character string (e.g., something like `a1b2c3d4e5f6g7h8i9j0k1l2m3`). We'll use this id in a number of places below.

33. Click the **Cognito User Pool** checkbox under **Enabled Identity Pools**, in order to allow our app to access our User Pool.

34. Add **Callback** and **Sign out** URLs. When users sign-in with our web app, they will be redirected to Amazon Cognito's hosted login, which will handle the authentication for us. These URLs point Amazon Cognito back to our web app, indicating where to redirect a user when they successful sign-in or sign-out. You can use the main URL for your web app from above, e.g., <http://localhost:1234> (or whatever host/port you are using). NOTE: pay attention to the final slash `/`, and either leave it out, or include it, but do the same thing in all config/code (i.e., it must match exactly). If we were building a more complete web app, we might have different URLs for the login and logout cases, but in this case, using the same URL for both is fine. NOTE: you could include multiple URLs separated by commas to authorize multiple end-points. This would be common for having separate development, staging, and production URLs. We will only focus on development for now, but you can come back and add more later if you like.

> NOTE: these redirect URLs normally need to be HTTPS (secure), but you can use HTTP with `localhost` development URLs. We won't be worrying about doing a proper deployment of our web app, so <http://localhost> is fine for our testing purposes.

35. Choose the [**OAuth 2.0**](https://oauth.net/2/) flows to allow. In our case, since we're building a web app, we'll choose **Authorization code grant**, which [allows clients to obtain tokens](https://www.oauth.com/oauth2-servers/single-page-apps/) that we'll then use to access our microservice securely.

36. Choose the **OAuth Scopes** to allow. [OAuth Scopes](https://oauth.net/2/scope/) allow us to define which aspects of a user's identity and account information an application should be able to access. We'll need `email`, `openid`, and `profile`.

37. Click **Save changes**

38. Set up the **Hosted UI**. Cognito can manage a user sign-in and sign-up domain and web page for us, without us having to write or deploy any code! To use it, we first have to configure a custom domain. Click **Domain name** in the options on the left. Pick a prefix for your domain, which will be of the form: <https://your-domain.auth.us-east-1.amazoncognito.com>. A good choice for your domain prefix would be `fragments-{yourname}` (i.e., use your name in place of `-{yourname}`), giving you a hosted UI at <https://fragments-yourname.auth.us-east-1.amazoncognito.com>. The actual URL you use here isn't really that important, but everyone must have a unique domain name. Check that your domain is available (i.e., click **Check availability**) and when you have confirmed that your domain name is good, click **Save changes**. Write down your domain name. We'll need it below.

39. Customize your **Hosted UI**. Click **UI Customization** on the left in order to modify the look of the hosted auth UI. You can add a logo and change the CSS for various sections if you like. The defaults are also fine.

## Connect Web App to User Pool

Authentication and Authorization are a complicated dance, involving redirects, access codes, tokens, etc. We could write code to do it all manually, but it's hard to get right, and a waste of time for everyone to implement manually.

In order to simplify connecting our web app to our Cognito User Pool and Hosted UI, we'll use Amazon's [aws-amplify](https://www.npmjs.com/package/aws-amplify) JavaScript SDK, which includes an `auth` module.

> NOTE: The [aws-amplify](https://www.npmjs.com/package/aws-amplify) SDK includes all kinds of features we won't use. The docs discuss lots of setup and configuration we don't need to do, since we're only using Cognito.

40. In your `fragments-ui` web app's root folder, run the following command:

```sh
npm install --save aws-amplify
```

If you are using a web framework (React, Angular, Vue), you can also [install the appropriate custom components](https://docs.amplify.aws/lib/auth/getting-started/q/platform/js/#option-1-use-pre-built-ui-components) to use pre-built auth components.

> NOTE: some students have reported issues getting the custom React components to work with Amplify (i.e., not using the proper domain, not showing email for sign-up, etc). Make sure you specify the `signUpAttributes` you want to use:

```js
export default withAuthenticator(App, {
  signUpAttributes: ['email', 'name'],
});
```

If you can't get it to work, you can always write your own login/logout button components, based on my code below.

If you're not using a web framework, create some simple HTML buttons for `Login` and `Logout`, as well as a place to display the user's `username` once authenticated. Here's a basic sample, but you can make it look like whatever you want (i.e., this is just to get you started):

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Fragments UI</title>
    <link rel="stylesheet" href="https://unpkg.com/bamboo.css" />
    <script type="module" src="src/app.js"></script>
  </head>
  <body>
    <h1>Fragments UI</h1>
    <section>
      <nav><button id="login">Login</button> <button id="logout">Logout</button></nav>
    </section>
    <section hidden id="user">
      <h2>Hello <span class="username"></span>!</h2>
    </section>
  </body>
</html>
```

41. In the root of your `fragments-ui` web app repo (i.e., beside your `package.json` file), create an `.env` file to define some [Environment Variables](https://en.wikipedia.org/wiki/Environment_variable). We use an environment file (`.env`) to separate configuration settings from our source code. Our `.env` file will include things like our Cognito configuration settings.

Because an `.env` file often contains secrets, we **never** commit them to git. Our [`.gitignore`](https://git-scm.com/docs/gitignore) tells git which files and folders to ignore in a project. Confirm that your `.gitignore` file includes `.env`. If it doesn't, you can put the following lines at the end of the `.gitignore` file:

```ini
# Don't include .env, which might have sensitive information
.env
```

Your `.env` file contains lines that look like this: `VARIABLE=VALUE` (NOTE: no spaces, no quotes). It also contains comments, which begin with a `#` character: `# This is a comment`.

A process has access to its environment (variables). If you're using Parcel, it can [automatically read environment variables from an `.env` in the root of the project](https://parceljs.org/features/node-emulation/#environment-variables). You can do something similar in [React](https://create-react-app.dev/docs/adding-custom-environment-variables/) and [Angular](https://www.digitalocean.com/community/tutorials/angular-environment-variables) too. Make sure your chosen web framework can work with environment variables so that you don't have to commit these to with our source code.

> NOTE: you will need the configuration info that you recorded above for your User Pool and App Client ID (replace `xx...` values below):

```ini
# .env

# fragments microservice API URL (make sure this is the right port for you)
API_URL=http://localhost:8080

# AWS Amazon Cognito User Pool ID (use your User Pool ID)
AWS_COGNITO_POOL_ID=us-east-1_xxxxxxxxx

# AWS Amazon Cognito Client App ID (use your Client App ID)
AWS_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx

# AWS Amazon Cognito Host UI domain (user your domain)
AWS_COGNITO_HOSTED_UI_DOMAIN=xxxxxxxx.auth.us-east-1.amazoncognito.com

# OAuth Sign-In Redirect URL (use the port for your fragments-ui web app)
OAUTH_SIGN_IN_REDIRECT_URL=http://localhost:1234

# OAuth Sign-Out Redirect URL (use the port for your fragments-ui web app)
OAUTH_SIGN_OUT_REDIRECT_URL=http://localhost:1234
```

Also create a `src/auth.js` file to do the [OAuth2 Authorization Code Grant](https://developer.okta.com/blog/2018/04/10/oauth-authorization-code-grant-type). To do so, we first need to configure the `Auth` client with our User Pool details, and provide a way to get the authenticated user's info. We'll use the `process.env` global to access our environment variables:

```js
// src/auth.js

import { Amplify, Auth } from 'aws-amplify';

// Configure our Auth object to use our Cognito User Pool
Amplify.configure({
  Auth: {
    // Amazon Region
    region: 'us-east-1',

    // Amazon Cognito User Pool ID
    userPoolId: process.env.AWS_COGNITO_POOL_ID,

    // Amazon Cognito App Client ID (26-char alphanumeric string)
    userPoolWebClientId: process.env.AWS_COGNITO_CLIENT_ID,

    // Hosted UI configuration
    oauth: {
      // Amazon Hosted UI Domain
      domain: process.env.AWS_COGNITO_HOSTED_UI_DOMAIN,

      // These scopes must match what you set in the User Pool for this App Client
      scope: ['email', 'profile', 'openid'],

      // NOTE: these must match what you have specified in the Hosted UI
      // app settings for Callback and Redirect URLs (e.g., no trailing slash).
      redirectSignIn: process.env.OAUTH_SIGN_IN_REDIRECT_URL,
      redirectSignOut: process.env.OAUTH_SIGN_OUT_REDIRECT_URL,

      // We're using the Access Code Grant flow (i.e., `code`)
      responseType: 'code',
    },
  },
});

/**
 * Get the authenticated user
 * @returns Promise<user>
 */
async function getUser() {
  try {
    // Get the user's info, see:
    // https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    const currentAuthenticatedUser = await Auth.currentAuthenticatedUser();

    // If that didn't throw, we have a user object, and the user is authenticated
    console.log('The user is authenticated');

    // Get the user's username
    const username = currentAuthenticatedUser.username;

    // Get the user's Identity Token, which we'll use later with our
    // microservce. See discussion of various tokens:
    // https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-with-identity-providers.html
    const idToken = currentAuthenticatedUser.signInUserSession.idToken.jwtToken;
    const accessToken = currentAuthenticatedUser.signInUserSession.accessToken.jwtToken;

    // Return a simplified "user" object
    return {
      username,
      idToken,
      accessToken,
      // Include a simple method to generate headers with our Authorization info
      authorizationHeaders: (type = 'application/json') => {
        const headers = { 'Content-Type': type };
        headers['Authorization'] = `Bearer ${idToken}`;
        return headers;
      },
    };
  } catch (err) {
    console.log(err);
    // Unable to get user, return `null` instead
    return null;
  }
}

export { Auth, getUser };
```

42. Create the `src/app.js` file to run your web app. It should use `src/auth.js` to handle authentication, get the `user`, and update the UI. It doesn't need to do anything more complicated (yet):

```js
// src/app.js

import { Auth, getUser } from './auth';

async function init() {
  // Get our UI elements
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');

  // Wire up event handlers to deal with login and logout.
  loginBtn.onclick = () => {
    // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    Auth.federatedSignIn();
  };
  logoutBtn.onclick = () => {
    // Sign-out of the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-out
    Auth.signOut();
  };

  // See if we're signed in (i.e., we'll have a `user` object)
  const user = await getUser();
  if (!user) {
    // Disable the Logout button
    logoutBtn.disabled = true;
    return;
  }

  // Log the user info for debugging purposes
  console.log({ user });

  // Update the UI to welcome the user
  userSection.hidden = false;

  // Show the user's username
  userSection.querySelector('.username').innerText = user.username;

  // Disable the Login button
  loginBtn.disabled = true;
}

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);
```

## Test Authentication Flows

43. Your web app should be ready for you to try connecting to your User Pool. Start your web app locally (`npm start`) and open your browser to it. Open your browser's **Dev Tools** so you can see the **Console**. Click the **Login** button. You should be redirected to your Hosted UI domain. If you aren't, look for errors and debug.

44. In the Hosted UI, create a new user by clicking the **Sign up** link. Enter your desired **Username**, **Name**, **Email**, and **Password** (this is a test account, and you can make as many as you like, ideally fewer than 50,000 this month!). Click the **Sign up** button. You will be asked to verify your email by entering a **Verification Code** (check your the email you entered above for the code). Once you enter it, you should be redirected back to your local web app (you're now signed in!).

45. Try clicking **Logout** and then trying the **Login** flow (i.e., click the **Login** again). Make sure you can login and logout, and your UI works as you expect.

46. After successfully logging in, inspect the `user` object in the Dev Tools console. Make sure the `username` is correct, and that you have an `idToken` and `accessToken` [JSON Web Tokens (JWT)](https://jwt.io/introduction). One-by-one, copy these JWTs and paste them into the **JWT Debugger** at [jwt.io](https://jwt.io/). Make sure the tokens are valid and can be decoded, and that the [claims](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-claims) you see make sense (i.e., match the user you logged in with).

47. Go back to the **AWS Console** and the **Cognito** page and select the **Users and groups** option under **General settings** on the left-hand menu. Find the user you just created in your User Pool.

Congratulations, you've provisioned, configured, and programmed your very first AWS service. Well done! You should `add` and `commit` everything in your `fragments-ui` repo:

```sh
$ git status
...see what's been added and updated
$ git add ...
$ git commit -m "..."
```

## Secure fragments Routes

Now that we have a way to Authenticate users against our Amazon Cognito User Pool, and a way to get Authorization tokens, it's time to secure our `fragments` microservice routes. We'll add the infrastructure we need to properly authorize users with a Cognito **Identity token**.

48. In the root of the `fragments` repo, install the [dotenv](https://www.npmjs.com/package/dotenv) module to your dependencies. We'll use it to read [Environment Variables](https://en.wikipedia.org/wiki/Environment_variable) from an `.env` file, and load the into our node server's environment at startup:

```sh
npm install --save dotenv
git add package.json package-lock.json
git commit -m "Add dotenv"
```

49. We'll change the default entry point of our server, from `src/server.js` to use a new file: `src/index.js`. In this file, we'll begin by loading environment variables from an `.env` file as the first thing we do. We'll create the `.env` file in a minute:

```js
// src/index.js

// Read environment variables from an .env file (if present)
require('dotenv').config();

// We want to log any crash cases so we can debug later from logs.
const logger = require('./logger');

// If we're going to crash because of an uncaught exception, log it first.
// https://nodejs.org/api/process.html#event-uncaughtexception
process.on('uncaughtException', (err, origin) => {
  logger.fatal({ err, origin }, 'uncaughtException');
  throw err;
});

// If we're going to crash because of an unhandled promise rejection, log it first.
// https://nodejs.org/api/process.html#event-unhandledrejection
process.on('unhandledRejection', (reason, promise) => {
  logger.fatal({ reason, promise }, 'unhandledRejection');
  throw reason;
});

// Start our server
require('./server');
```

50. Create an [`.env` file](https://github.com/motdotla/dotenv#usage) in the root of your `fragments` repo (e.g., in the same folder as `package.json`). Just like the one we made for `fragments-ui`, your `.env` file contains lines of the form `VARIABLE=VALUE` (NOTE: no spaces, no quotes), and comments beginning with the `#` character: `# This is a comment`. Try setting your `PORT` in the `.env` file:

```ini
# port to use when starting the server
PORT=8080
```

Run your server (e.g., `npm start`) and see if it starts on port `8080`. Now stop the server and change your `.env` file to use `PORT=9000`. Restart your server and make sure it runs on port `9000`. Finally, try commenting out the port in your `.env` (i.e., `#PORT=8080`) and see if it still starts. It should default to use port `8080` if there is no `PORT` defined on the environment (e.g., `const port = parseInt(process.env.PORT || 8080, 10);` in `src/server.js`). When you're done, change the `.env` back to `PORT=8080` so we define (and document) a default value.

51. Confirm that your `.gitignore` file includes `.env`. Remember, we don't **ever** want this file committed to git, since it will eventually contain secrets that shouldn't be shared (e.g., on GitHub). You can put the following lines at the end of the `.gitignore` file if they aren't already included:

```
# Don't include .env, which might have sensitive information
.env
```

52. Modify all of your startup **scripts** in `package.json` to use `src/index.js` vs. `src/server.js` when starting the server. Confirm that `npm start`, `npm run dev`, and `npm run debug` all continue to work. Once you're satisfied that they do, `add` everything to git and `commit` (hint: use `git status` to see all of the files that have been added or changed). Use a commit message that helps you remember what you did (e.g., `"Switch to src/index.js as main entry point"`).

53. Update your project structure to add a `src/routes/*` folder, and associated files. We'll put all of our server's routes into separate files and folders, to avoid having `src/app.js` get too big. Here's how it should look:

```
fragments/
├─ package.json
├─ node_modules/
├─ src/
│  ├─ routes/
│  │  ├─ index.js
│  │  ├─ api/
|  │  │  ├─ index.js
|  │  │  ├─ get.js
│  ├─ index.js
│  ├─ server.js
│  ├─ app.js
│  ├─ logger.js
├─ ...
```

You can do that at the command-line with:

```sh
mkdir -p src/routes/api
touch src/routes/index.js
touch src/routes/api/index.js
touch src/routes/api/get.js
```

54. Modify your `src/app.js` file to remove the current health check route (and associated code), and move that logic into `src/routes/index.js` instead:

```js
// modifications to src/app.js

// Remove `app.get('/', (req, res) => {...});` and replace with:

// Define our routes
app.use('/', require('./routes'));
```

Now update the code in `src/routes/index.js` to define our routes:

```js
// src/routes/index.js

const express = require('express');

// version and author from package.json
const { version, author } = require('../../package.json');

// Create a router that we can use to mount our API
const router = express.Router();

/**
 * Expose all of our API routes on /v1/* to include an API version.
 */
router.use(`/v1`, require('./api'));

/**
 * Define a simple health check route. If the server is running
 * we'll respond with a 200 OK.  If not, the server isn't healthy.
 */
router.get('/', (req, res) => {
  // Client's shouldn't cache this response (always request it fresh)
  res.setHeader('Cache-Control', 'no-cache');
  // Send a 200 'OK' response
  res.status(200).json({
    status: 'ok',
    author,
    // Use your own GitHub URL for this...
    githubUrl: 'https://github.com/humphd/fragments',
    version,
  });
});

module.exports = router;
```

55. Start to define the `fragments` API endpoints in `src/routes/api/index.js` (we'll add more here as we expand our implementation in future labs):

```js
// src/routes/api/index.js

/**
 * The main entry-point for the v1 version of the fragments API.
 */
const express = require('express');

// Create a router on which to mount our API endpoints
const router = express.Router();

// Define our first route, which will be: GET /v1/fragments
router.get('/fragments', require('./get'));

// Other routes will go here later on...

module.exports = router;
```

56. Start an initial implementation of the `GET /v1/fragments` route in `src/routes/api/get.js`:

```js
// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */
module.exports = (req, res) => {
  // TODO: this is just a placeholder to get something working...
  res.status(200).json({
    status: 'ok',
    fragments: [],
  });
};
```

57. Test that everything still works, and make sure that `curl localhost:8080` and `curl localhost:8080/v1/fragments` give you the responses you expect. If you have problems, debug and get everything working. Once you're satisfied things work, `add` everything you changed to git and `commit` your changes (hint: you can add an entire directory to git at once in order to include all of the new/updated files within it: `git add src/app.js src/routes`).

58. Add the necessary dependencies in order to use a JWT token to secure our Express routes with [Passport.js](https://www.passportjs.org/), including [passport](https://www.npmjs.com/package/passport), [passport-http-bearer](https://www.npmjs.com/package/passport-http-bearer), and [aws-jwt-verify](https://www.npmjs.com/package/aws-jwt-verify)). Our microservice will use Passport.js to parse the `Authorization` header of all incoming requests and look for a `Bearer` token. We'll then verify this token with the **AWS JWT Verifier** module, and make sure that we can trust the user's identity.

> NOTE: the [aws-jwt-verify](https://www.npmjs.com/package/aws-jwt-verify) module currently needs to be set to `2.1.3` vs. `3.x` due to a [bug](https://github.com/awslabs/aws-jwt-verify/issues/66) in how it [interacts with Jest](https://github.com/facebook/jest/issues/12270). Until this is fixed upstream, avoid using the latest version.

```sh
npm install --save passport passport-http-bearer aws-jwt-verify@2.1.3
```

59. Add configuration information to your `.env` so that the **AWS JWT Verifier** knows about your Cognito User Pool (NOTE: use the values you wrote down above for the Amazon Cognito IDs):

```ini
# Port for the server
PORT=8080

# AWS Amazon Cognito User Pool ID (use your User Pool ID)
AWS_COGNITO_POOL_ID=us-east-1_xxxxxxxxx

# AWS Amazon Cognito Client App ID (use your Client App ID)
AWS_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
```

60. Create a `src/authorization.js` file to define our Passport strategy and authentication functions:

```js
// src/authentication.js

// Configure a JWT token strategy for Passport based on
// Identity Token provided by Cognito. The token will be
// parsed from the Authorization header (i.e., Bearer Token).

const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const { CognitoJwtVerifier } = require('aws-jwt-verify');

const logger = require('./logger');

// Create a Cognito JWT Verifier, which will confirm that any JWT we
// get from a user is valid and something we can trust. See:
// https://github.com/awslabs/aws-jwt-verify#cognitojwtverifier-verify-parameters
const jwtVerifier = CognitoJwtVerifier.create({
  // These variables must be set in the .env
  userPoolId: process.env.AWS_COGNITO_POOL_ID,
  clientId: process.env.AWS_COGNITO_CLIENT_ID,
  // We expect an Identity Token (vs. Access Token)
  tokenUse: 'id',
});

// At startup, download and cache the public keys (JWKS) we need in order to
// verify our Cognito JWTs, see https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-key-sets
// You can try this yourself using:
// curl https://cognito-idp.us-east-1.amazonaws.com/<user-pool-id>/.well-known/jwks.json
jwtVerifier
  .hydrate()
  .then(() => {
    logger.info('Cognito JWKS cached');
  })
  .catch((err) => {
    logger.error({ err }, 'Unable to cache Cognito JWKS');
  });

module.exports.strategy = () =>
  // For our Passport authentication strategy, we'll look for the Bearer Token
  // in the Authorization header, then verify that with our Cognito JWT Verifier.
  new BearerStrategy(async (token, done) => {
    try {
      // Verify this JWT
      const user = await jwtVerifier.verify(token);
      logger.debug({ user }, 'verified user token');

      // Create a user, but only bother with their email
      done(null, user.email);
    } catch (err) {
      logger.error({ err, token }, 'could not verify token');
      done(null, false);
    }
  });

module.exports.authenticate = () => passport.authenticate('bearer', { session: false });
```

61. Update the `src/app.js` file to use the new `strategy` we just defined in `src/authentication.js`, and to initialize [Passport.js](https://www.passportjs.org/):

```js
// modifications to src/app.js
...
const passport = require('passport');
...
const authorization = require('./authorization');
...
// Use gzip/deflate compression middleware
app.use(compression());

// Set up our passport authorization middleware
passport.use(authorization.strategy());
app.use(passport.initialize());

// Define our routes
app.use('/', require('./routes'));
...
```

Try starting your server (`npm run dev`) and check to see if the `Cognito JWKS cached` message gets logged. If you instead see `Unable to cache Cognito JWKS`, something is wrong, and you should debug and fix.

62. Update `src/routes/index.js` to use our `authenticate` middleware for all of the `/v1/*` routes:

```js
// modifications to src/routes/index.js
...
// Our authorization middleware
const { authenticate } = require('../authorization');
...
/**
 * Expose all of our API routes on /v1/* to include an API version.
 * Protect them all so you have to be authenticated in order to access.
 */
router.use(`/v1`, authenticate(), require('./api'));
...
```

Start your server and make sure that `curl -i localhost:8080` returns a `200`, but that `curl -i localhost:8080/v1/fragments` instead returns a `401 Unauthorized`. If they don't work how you expect, debug and fix things until they do, then `add` and `commit` all your updates/changes to git.

## Connect Client Web App to Secure Microservice

We **finally** have all the pieces in place to connect everything together: our Amazon Cognito User Pool; a simple client Web App that can authenticate and get tokens; and a microservice that can secure HTTP access via JWT tokens.

Let's prove that everything works. Our goal is to have a user sign-in via our web app, then use the token we get back from AWS to do a secure `GET` request to our microservice. If all goes we'll we'll get back a `200` with some data that we can log to the browser console.

63. Add a new file to your `fragments-ui` web app repo called `src/api.js`. In it, define a function to get a user's fragments from the `fragments` microservice:

```js
// src/api.js

// fragments microservice API, defaults to localhost:8080
const apiUrl = process.env.API_URL || 'http://localhost:8080';

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user) {
  console.log('Requesting user fragments data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Got user fragments data', { data });
  } catch (err) {
    console.error('Unable to call GET /v1/fragment', { err });
  }
}
```

64. Call your `getUserFragments()` function in `src/app.js` when a user is authenticated on page load:

```js
// modifications to src/app.js
...
import { getUserFragments } from './api';
...
async function init() {
  ...
  const user = await getUser();
  ...
  // Do an authenticated request to the fragments API server and log the result
  getUserFragments(user);
}
```

65. Open two terminals to run your web app client and microservice at the same time.

In the first terminal, start your `fragments` server on port `8080` (or whatever port you specified in your `.env` and `src/app.js`) using `npm run dev` (HINT: use the `dev` script to start your server in debug mode, so the logs are pretty-printed and easier to read).

In the second terminal, start your `fragments-ui` web app client on port `1234` (or whatever port you've used). Browse to your `fragments-ui` front-end web app and open your browser's **Dev Tools** so that you can see the **Console**.

Click the **Login** button and sign-in with Cognito. When you are redirected back to your web app, make sure the console shows a successful result for the authenticated `GET /v1/fragment` request. If it doesn't, debug and fix.

Take a look at the logs that your `fragments` server produced. Make sure you see the successful request and response, and that the token is being sent in the `Authorization` header.

## Submission

In order to submit your lab, please do all of the following steps and submit the results to Blackboard:

1. Make sure that all of the changes in both the `fragments` repo and `fragments-ui` repo are committed in git (i.e., `add`, `commit`). Once you have done that for each repo, `push` your commits to GitHub (i.e., `git push origin main`) for both repos one-by-one. Confirm that the code in GitHub is what you expect for both repos. If it isn't, fix things, `add`, `commit` and `push` again until it is.

2. [Invite your professor (@humphd) as a collaborator](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-user-account/managing-access-to-your-personal-repositories/inviting-collaborators-to-a-personal-repository) to your private `fragments-ui` web front-end repo. NOTE: only you and your professor should have access to this code. Do not share it with other students. You can use the [Discussions](https://github.com/humphd/cloud-computing-for-programmers-summer-2022/discussions) to talk about your code, but not share it directly.

3. Submit the links to both your `fragments` and `fragments-ui` repos.

4. Open your browser with the **Dev Tools** and **Console** showing, and take screenshots of all of the following scenarios (include the entire browser in the screenshot, including the address bar and URL):
   3.1 Page load when not logged in
   3.2 Clicking the **Login** button and being redirected to the **Hosted UI**
   3.3 Page load when logged in (should display the username) and the Console should show a successful request to get the user's fragments.

5. Take a screenshot of the **AWS Console Cognito** page in the **Users and groups** section for your User Pool, showing the user you created when you signed up.

6. After you successfully log in, copy the `idToken` value from the `user` object in the console to your clipboard and paste it into the JWT Debugger at [jwt.io](https://jwt.io). Take a screenshot of the **Decoded** payload.
