# CS546App

Notes:
* No non source should be checked into Git (node_modules folder, .vscode folder, npm-debug.log file) 
* I changed the bcrypt module to bcryptjs to avoid native dependencies 

TODO List:
* after user is authenticated in POST /login, create server session with userId and return session guid as cookie for subsequent reqs.
* data getPostbyId() and removePost() need to take the userid of the post and check it against the actual post before returning or delting the post


Questions:
* why is rewriteUnsupportedBroserMethod() necessary in app.js?