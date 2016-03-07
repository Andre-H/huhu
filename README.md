# huhu
###What's this

I think everyone using Protractor to test their AngularJS web app should be able to straightaway:
- Run the same tests once in each different browser (multi capabilities)
- For each browser type they have, run their test specs in parallel (file sharding)
- For this setup, have a XML JUnit format report already consolidated for easy integration with CI such as Jenkins
- For this setup, have a HTML format report easily readable to summarize execution and with screen captures
- Be able to run all tests in this setup with a simple command (we used grunt)

So this is a gist showing how to achieve just that.

###Requirements:

1. Install Node.js

2. Install Grunt-cli

###Give it a go

1. Clone this repository

2. **npm install**

3. **grunt install**

4. **grunt**

###From here on

Create test specs in tests/e2e/specs

Create page objects in tests/e2e/pageobjects

And test away.

##What is a huhu?
The huhu is the morepork owl http://www.doc.govt.nz/nature/native-animals/birds/birds-a-z/morepork-ruru/ In Maori tradition this owl is seen as a guardian, its "hu-hu" chant can mean a good sign of things to come or its high pitched cry can mean bad news.
