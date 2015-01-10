/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
function userSchema() {}

userSchema.prototype.createSchema = function() {
     return user = {
       "name": "user",
       "fields": [
            {
                "name": "user_id",
                "index": true,
                "type": "string"
            },
            {
                "name": "username", 
                "index": true,
                "type": "string"
            },
            {
                 "name": "firstName",
                 "index": true,
                 "type": "string"
            },
            {
                 "name": "lastName",
                 "index": true,
                 "type": "string"
            },
            {
                 "name": "middleInitial",
                 "index": false,
                 "type": "string"
            },
            {
                 "name": "userType",
                 "index": true,
                 "type": "string"
            },
            //only for parents
            { 
                "name": "parPhysicianId", 
                "index": true,
                "type": "string"
            },
            // only for physicians
            {
                 "name": "phyShowEmail", 
                 "index": false,
                 "type": "boolean"
            },
            {  
                 "name": "phyShowAge",
                 "index": false,
                 "type": "boolean"
            },
            {
                 "name": "phyShowWeight",
                 "index": false,
                 "type": "boolean"
            },
            // for both users
            {
                "name": "confirmationToken",
                "index": true,
                "type": "string"
            },
            {
                 "name": "isConfirmed",
                 "index": false,
                 "type": "boolean"
            }
        ]
    }
}

userSchema.prototype.createUser = function( id, attributes, token ) {
   var user = {
        "user_id":id, 
        "username":attributes.body.email,
        "userType":attributes.body.userType,
        "firstName":attributes.body.firstName,
        "midInit":attributes.body.middleInitial,
        "lastName":attributes.body.lastName,
        "isConfirmed":false,
        "confirmationToken":token
    }

    if ( user.userType === "Physician" ) {
        user.phyShowEmail = true;
        user.phyShowAge = true;
        user.phyShowWeight = true;
    }
    else {
        user.parPhysicianId = attributes.body.physicianID; 
    }

    return user; 
}

module.exports = userSchema; 