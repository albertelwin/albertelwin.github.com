
firebase.initializeApp({ "apiKey": "AIzaSyDu2nRZk4WMXONFF216QNM12sNuatJmW3o", "databaseURL": "https://taru-25fc8.firebaseio.com", "storageBucket": "taru-25fc8.appspot.com", "authDomain": "taru-25fc8.firebaseapp.com", "messagingSenderId": "342278577480", });

var DB_FIELD_TYPE = {
	STR: 0,
	INT: 1,
};

var DB_USER_FIELD_LIST = [
	{ key: "name", type: DB_FIELD_TYPE.STR, },
	{ key: "email", type: DB_FIELD_TYPE.STR, },
	{ key: "type", type: DB_FIELD_TYPE.STR, },
	{ key: "silver_tals", type: DB_FIELD_TYPE.INT, },
	{ key: "copper_tals", type: DB_FIELD_TYPE.INT, },
	{ key: "sodium_tals", type: DB_FIELD_TYPE.INT, },
];

var DB_USER_TYPE_LIST = [
	{ value: "creative_founder", caption: "Creative Founder", },
	{ value: "team_member", caption: "Team Member", },
	{ value: "inactive_member", caption: "Inactive Member", },
];
var DB_USER_DEFAULT_TYPE = "team_member";

function db_prepare_str(val) {
	return (val !== undefined && val !== null) ? val.trim() : "";
};

function db_prepare_int(val) {
	return val | 0;
};

function db_prepare_record(record, field_list) {
	for(var field_index = 0; field_index < field_list.length; field_index++) {
		var field = field_list[field_index];
		if(field.type === DB_FIELD_TYPE.INT) {
			record[field.key] = db_prepare_int(record[field.key]);
		}
		else {
			record[field.key] = db_prepare_str(record[field.key]);
		}
	}
};

function db_prepare_user(user) {
	db_prepare_record(user, DB_USER_FIELD_LIST);
};

function db_gen_key() {
	var key = "";

	//TODO: Better key gen!!
	var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for(var i = 0; i < 16; i++) {
		var index = Math.floor(Math.random() * chars.length);
		key += chars[index];
	}

	return key;
};

function db_user_to_project_key(user_key, callback) {
	if(callback !== undefined) {
		var database_ref = firebase.database().ref();
		database_ref.child("user_index/" + user_key).once("value").then(function(user_index) {
			var project_key = user_index.child("project_key").val();
			callback(project_key);
		});
	}
};

function db_for_each_project(callback) {
	if(callback !== undefined) {
		var database_ref = firebase.database().ref();
		var projects_ref = database_ref.child("projects");
		projects_ref.orderByChild("name").once("value").then(function(projects_data) {
			projects_data.forEach(function(project_data) {
				var project = {};
				project.key = project_data.key;
				project.name = project_data.child("name").val();

				callback(project);
			});
		});
	}
};

function db_get_project(project_key, callback) {
	if(callback !== undefined) {
		var database_ref = firebase.database().ref();
		var project_ref = database_ref.child("projects/" + project_key);
		project_ref.once("value").then(function(project_data) {
			var project = null;

			var project_name = project_data.child("name").val();
			if(project_name !== null) {
				var rev_count = project_data.child("rev_count").val() | 0;
				if(rev_count > 0) {
					var rev_index = (rev_count - 1) | 0;
					var rev = project_data.child("rev" + rev_index);

					project = {};
					project.key = project_key;
					project.name = project_name;
					project.approved = ((project_data.child("approved").val() | 0) === 1) ? true : false;
					project.rev = rev_index;
					project.description = rev.child("description").val();
					project.total_tals = rev.child("total_tals").val() | 0;

					var users = [];
					var users_data = rev.child("users");
					users_data.forEach(function(user_data) {
						var user = {};
						user.key = user_data.key;

						for(var field_index = 0; field_index < DB_USER_FIELD_LIST.length; field_index++) {
							var field = DB_USER_FIELD_LIST[field_index];
							user[field.key] = user_data.child(field.key).val();
						}
						db_prepare_user(user);

						users[users.length] = user;
					});

					users.sort(function(x, y) {
						var order = 1;
						if(x.name.toUpperCase() < y.name.toUpperCase()) {
							order = -1;
						}

						return order;
					});

					project.users = users;
				}
			}

			callback(project);
		});
	}
};

function db_check_project_changes(project, callback) {
	if(callback !== undefined) {
		db_get_project(project.key, function(stored_project) {
			var modified = false;

			if(stored_project === null) {
				modified = true;
			}
			else {
				if(project.description !== stored_project.description) {
					modified = true;
				}
				if((project.total_tals | 0) !== (stored_project.total_tals | 0)) {
					modified = true;
				}

				if(project.users.length !== stored_project.users.length) {
					modified = true;
				}
				else {
					var users = project.users;
					var stored_users = stored_project.users;
					for(var user_index = 0; user_index < users.length; user_index++) {
						var user = users[user_index];

						var stored_user = null;
						for(var i = 0; i < stored_users.length; i++) {
							var it = stored_users[i];
							if(user.key === it.key) {
								stored_user = it;
								break;
							}
						}

						if(stored_user === null) {
							modified = true;
						}
						else {
							if(user.name !== stored_user.name) {
								modified = true;
							}
							if(user.email !== stored_user.email) {
								modified = true;
							}
							if(user.type !== stored_user.type) {
								modified = true;
							}
							if(user.silver_tals !== stored_user.silver_tals) {
								modified = true;
							}
							if(user.copper_tals !== stored_user.copper_tals) {
								modified = true;
							}
							if(user.sodium_tals !== stored_user.sodium_tals) {
								modified = true;
							}
						}
					}
				}
			}

			callback(modified);
		});
	}
};

function db_save_project(project, callback) {
	var errors = [];

	project.name = db_prepare_str(project.name);
	if(project.name.length === 0) {
		errors[errors.length] = "project name is a required field.";
	}
	project.description = db_prepare_str(project.description);
	if(project.description.length === 0) {
		errors[errors.length] = "project description is a required field.";
	}
	project.total_tals = db_prepare_int(project.total_tals);
	if(project.total_tals === 0) {
		errors[errors.length] = "project total tals must be at least 1.";
	}

	var creative_founders = 0;
	var allocated_tals = 0;
	for(var user_index = 0; user_index < project.users.length; user_index++) {
		var user = project.users[user_index];
		db_prepare_user(user);

		if(user.name.length === 0) {
			errors[errors.length] = "user name is a required field.";
		}
		if(user.email.length === 0) {
			errors[errors.length] = "user email is a required field.";
		}
		if(user.type.length === 0) {
			errors[errors.length] = "user type is a required field.";
		}
		else {
			if(user.type === "creative_founder") {
				creative_founders++;
			}
		}

		allocated_tals += user.silver_tals;
		allocated_tals += user.copper_tals;
		allocated_tals += user.sodium_tals;
	}

	if(creative_founders === 0) {
		errors[errors.length] = "project must have at least 1 creative founder.";
	}

	if(allocated_tals > project.total_tals) {
		errors[errors.length] = allocated_tals + " tals are allocated but only " + project.total_tals + " total tals are available.";
	}

	var project_id = "[" + project.key + "]";

	if(errors.length === 0) {
		db_check_project_changes(project, function(modified) {
			var database_ref = firebase.database().ref();
			var project_ref = database_ref.child("projects/" + project.key);

			if(project.rev < 0) {
				project_ref.child("name").set(project.name);
				project_ref.child("rev_count").set(1);
				project.rev = 0;
			}
			else {
				if(modified) {
					project.rev++;
					project_ref.child("rev_count").set(project.rev + 1);

					console.log(project_id + " revision " + project.rev + " added.");
				}
			}

			project_ref.child("approved").set(project.approved === true ? 1 : 0);

			var rev_ref = project_ref.child("rev" + project.rev);
			rev_ref.child("description").set(project.description);
			rev_ref.child("total_tals").set(project.total_tals);

			var users_ref = rev_ref.child("users");
			for(var user_index = 0; user_index < project.users.length; user_index++) {
				var user = project.users[user_index];
				var user_ref = users_ref.child(user.key);

				for(var field_index = 0; field_index < DB_USER_FIELD_LIST.length; field_index++) {
					var field = DB_USER_FIELD_LIST[field_index];
					user_ref.child(field.key).set(user[field.key]);
				}

				database_ref.child("user_index/" + user.key).set({ project_key: project.key, });
			}

			console.log(project_id + " saved.");

			if(callback !== undefined) {
				callback(project, null);
			}
		});
	}
	else {
		for(var i = 0; i < errors.length; i++) {
			console.log(project_id + " " + errors[i]);
		}
		console.log(project_id + " save failed.");
		callback(project, errors[0]);
	}
};

function db_add_project_user(project, name, email, type, silver_tals, copper_tals, sodium_tals) {
	var user = {};
	user.key = db_gen_key();
	user.name = name;
	user.email = email;
	user.type = type;
	user.silver_tals = silver_tals;
	user.copper_tals = copper_tals;
	user.sodium_tals = sodium_tals;

	db_prepare_user(user);
	project.users[project.users.length] = user;

	return user;
};

function db_create_project(project_name, callback) {
	var project = {};
	project.key = db_gen_key();
	project.name = db_prepare_str(project_name);
	project.rev = -1;
	project.approved = false;
	project.description = "";
	project.total_tals = 0;

	project.users = [];

	return project;
};

function db_destroy_entire_database() {
	firebase.database().ref().remove();
};
