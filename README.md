Kiwee
=====

CEN3031 Intro to Software Engineering

This software was authored as a joint effort between August 2014-December 2014 by: 

-Nick Jiang
-Patrick Emami (pemami@ufl.edu)
-Gabe Martins
-Peyt Dewar

Tests
=====

Our front-end unit tests and back-end unit tests tests can be ran from the 
command line with 'grunt test'. 

They can be found at osprey-dev2/public/tests and osprey-dev2/app/tests

Our Protractor End-To-End tests currently break with multiple errors and will need to be 
debugged. 

TrueVault Node.js Wrapper
=========================

We used an open-source TrueVault Node.js-wrapper to write our server-side code. This library is located at osprey-dev2/truevault 
and is licensed under the MIT License

TrueVault info
===============

The name of the production vault is "kiwee". The vault-id is set as an environment variable in the server.js file. 

Our schemas are defined at osprey-dev2/app/schemas.
The architecture we came up with is to have both a user schema and a child schema. Both Physicians and Parents utilize the user schema. 
All parents have the user_id of their respective physician stored in TrueVault by their user schema. All children have the id's of
their parents stored in TrueVault by their child schema. 
We are able to populate the Physician's dashboard with all of their patients by searching for all parents containing that specific 
Physician's ID, and then grabbing all children that contain that parent's ID. 
The source code for this is at osprey-dev2/app/routes. 

Accessing the remove MEAN server
================================

The application is located at /opt/mean
Use scp to send the directories or files you are interested in to /opt/mean on the server 
The command "grunt" runs the application 






