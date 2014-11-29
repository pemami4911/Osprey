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
		"full_document" : fullDoc
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