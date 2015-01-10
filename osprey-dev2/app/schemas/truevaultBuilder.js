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
 
function TrueVaultBuilder() {}

TrueVaultBuilder.prototype.vendDocument = function( schema, vault, info ) {
	return doc = {
		"schema_id" : schema, 
		"vault_id" : vault, 
		"document" : info
	}
}

TrueVaultBuilder.prototype.vendFilter = function( schema, vault, filter, fullDoc ) {
	return filter = { 
		"schema_id" : schema,
		"vault_id" : vault, 
		"filter" : filter,
		"full_document" : fullDoc,
		"per_page": 1000
	}
}

TrueVaultBuilder.prototype.vendFilterAttributes = function( type, value ) {
	return attributes = {
		"type":type,
		"value":value
	}
}

TrueVaultBuilder.prototype.updateDocument = function( schema, vault, id, document ) {
	return doc = {
		"schema_id" : schema, 
		"vault_id" : vault, 
		"id" : id, 
		"document" : document
	}
}

TrueVaultBuilder.prototype.vendLogin = function( userDetails, accId ) {
	return login = {
		"username":userDetails.body.email,
		"password":userDetails.body.password, 
		"account_id":accId
	}
}

module.exports = TrueVaultBuilder; 