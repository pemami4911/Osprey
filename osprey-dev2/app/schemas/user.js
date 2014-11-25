var userSchema = {
   "name": "user",
   "fields": [
   	  {
   	  	 "name": "username",
   	  	 "index": true,
   	  	 "type": "string"
   	  },
   	  {
   	  	"name" : "password",
   	  	"index" : false, 
   	  	"type" : "string"
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
      }
   ]
};

module.exports = userSchema; 