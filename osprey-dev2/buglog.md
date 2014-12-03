In /auth/verify, duplicate verification sends same error as wrong confirmation token

If there are multiple user documents with the same username (e.g. a user is deleted from the truevault dashboard without deleting its user document, then another user with the same username is registered), logging in might try to log in with the wrong user document