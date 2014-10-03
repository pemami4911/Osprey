# Osprey App

An app built with MEAN (MongoDB, Express, AngularJS, Node.js). For demonstration purposes and a tutorial.

Node provides the RESTful API. Angular provides the frontend and accesses the API. MongoDB stores like a hoarder.

# First Sprint

We have set up a development directory and began testing and implementing our splash page and log-in/sign-up pages. 

# Testing

Run our tests with 
  
    $ grunt test 
    
  When you run our mocha tests, the current configuration will empty out our "users" collection in the mean-dev database. If you don't want this to happen, then comment out the code at the very bottom of app/tests/unit/*.js
