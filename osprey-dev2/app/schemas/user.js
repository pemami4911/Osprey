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