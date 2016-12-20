(function() {

// Initialize Firebase
  var config = {
    apiKey: "*******",
    authDomain: "*****",
    databaseURL: "*******",
    storageBucket: "******",
    messagingSenderId: "*********"
  };
  firebase.initializeApp(config);

  // Getting Elements
  var appText = document.getElementById('app-text');
  var appList = document.getElementById('app-list');
  var appBtnAdd = document.getElementById('app-btnAdd');
  var btnDelete = document.getElementById('button');
  var btnSignIn = document.getElementById('signin');
  var btnSignOut = document.getElementById('signout');


  // Referencing Database
  var dbRefApp = firebase.database().ref().child('app');
  var dbPass = firebase.database().ref().child('Password');

  var provider = new firebase.auth.GoogleAuthProvider();
  var auth = firebase.auth();

  btnSignIn.addEventListener('click', e => {
  	auth.signInWithPopup(provider).then(result => {
		location.reload();
  	});
  }); 

  btnSignOut.addEventListener('click', e => {
  	auth.signOut();
  	location.reload();
  });

 
  // Once Add button has been clicked
  appBtnAdd.addEventListener('click', e => {
  	// Add item to database
  	dbRefApp.push({
  		priority: 0 - Date.now(),
  		URL: appText.value,
  		time: Date()
  	});
  	// Reset text field
  	appText.value = "";

  });
  
  // Listening for new child to be added
  dbRefApp.orderByChild('priority').on('child_added', snap => {
  	// create a new li variable
  	var liDiv = document.createElement('div');
  	var liText = document.createElement('a');
  	var liDate = document.createElement('li');
  	var btnDelete = document.createElement('button');

  	btnDelete.id = snap.val().priority;
  	btnDelete.innerText = 'Delete';

  	// populate its text with URL info
  	liText.innerText = snap.val().URL;
  	liDate.innerText = snap.val().time;

  	liText.id = 'text';
  	liText.href = snap.val().URL;
  	liDate.id = 'date';
  	liDiv.id = 'urlData';
  	liDiv.className = snap.key;

  	appList.appendChild(liDiv);
  	liDiv.appendChild(liText);
  	liDiv.appendChild(liDate);
  	liDiv.appendChild(btnDelete);

  	liText.addEventListener('click', e => {
  		e.preventDefault();
  		window.location.href = liText.href;

  	});

  	var pass = 'a';
  	dbPass.once('value', snap => {
  		pass = snap.val();
  	});

  	btnDelete.addEventListener('click', e => {
  		var confirm = prompt("Enter the password to delete: " + snap.val().URL);
  		
		if (confirm == pass) {
  			dbRefApp.child(snap.key).remove();
  			location.reload();
  		} else {
  			alert("Wrong password");
  		}

  	});

  });


  // Only called when children have been changed
  dbRefApp.on('child_changed', snap => {
  	// get a list item from dom using the key
  	var liChanged = document.getElementById(snap.key);
  	liChanged.innerText = snap.val().URL;
  });


})();

