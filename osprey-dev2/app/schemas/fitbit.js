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

 function fitbitSchema() {}

fitbitSchema.prototype.createSchema = function() {
	return fitbit = {
		"name" : "fitbit",
		"fields" : [
			{
		   	  	"name": "childID", // id of child
		   	  	"index": true,
		   	  	"type": "string"
		   	},
		   	{	
		   		"name": "timeActiveStrenuous",
		   	  	"index": false,
		   	  	"type": "float"
		   	},
			{
				"name": "timeActiveNotStrenuous", 
				"index": false,
				"type": "float"
			},
			{
				"name": "timeSedentary", 
				"index": false,
				"type": "float"
			},
			{
				"name": "timestamp", 
				"index": true,
				"type": "date"
			},
			{
				"name": "caloriesBurned",
				"index": false,
				"type": "integer"
			}
		]
	}
}

fitbitSchema.prototype.createFitbit = function( id, timeStren, timeNotStren, timeSedentary, timestamp, calories) {
	return fitbit = {
		"childID":id,
		"timeActiveStrenuous":timeStren,
		"timeActiveNotStrenuous":timeNotStren,
		"timeSedentary":timeSedentary,
		"timestamp":timestamp,
		"calories":calories
	}
}

module.exports = fitbitSchema; 