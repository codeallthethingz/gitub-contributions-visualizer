# Github Contributions Visualizer

Simple static webpage that connects to githubs api and pulls down daily contributions.

![Alt text](example.png?raw=true "Screenshot")

## Setup

- Create an access token in github https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
- Create a `token.js` file in the root of the project and put your github token in it like so.
    ```javascript
    let token = "my token";
    ```
- In `index.js` change the username and start/end years to whatever you desire.

Open the `index.html` in a browser.