//Listen for auth state changes

let currentUser;
auth.onAuthStateChanged(user => {
  if (user) {
    console.log('User logged in:' + user.email)
    currentUser = user;
    //Getting Firestore Data
    db.collection('guide').orderBy('lastUpdate', 'desc')
      .onSnapshot(snapshot => setUpGuides(snapshot.docs)
        , err => console.log(err.message));
  }
  else {
    console.log('User logged out')
    currentUser = null;
    setUpGuides([]);
  }
  setUpUI(user);
});

//Create a new guide
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  //update author's guide list
  db.collection('users').doc(currentUser.uid).update({
    guides: firebase.firestore.FieldValue.arrayUnion(createForm.title.value),
  })
    //get author's account information to add it as a property for
    //the new guide document
    .then(() => {
      return db.collection('users').doc(currentUser.uid).get().then(doc => {

        updateUserInfo(doc.data());

        const createDate = new Date().getTime();
        const guide = {
          title: createForm.title.value,
          content: createForm.content.value,
          createDate: createDate,
          lastUpdate: createDate,
          authorAccount: doc.data(),
        }
        //console.log(guide)
        //add the new guide to the database
        return db.collection('guide').add(guide);
      })
        .then((response) => {
          // console.dir(response.message);

          //Reset modal and create form
          const modal = document.querySelector('#modal-create');
          M.Modal.getInstance(modal).close();
          createForm.reset();
        })
        .catch(err => console.log(err.message));
    })
});

//update user account across the database after an update to its information
const updateUserInfo = (user) => {
  db.collection('guide').where('authorAccount.email', '==', currentUser.email).get()
    .then(querySnapshot => {

      querySnapshot.forEach(async (doc) => {
        console.log(doc.data());
        await db.collection('guide').doc(doc.id).update({
          authorAccount: user,
        });
      })
    }).catch(err => console.log(err.message));
}

//Sign up
const signUpForm = document.querySelector('#signup-form');
signUpForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  //Get user info
  const email = signUpForm['signup-email'].value;
  const password = signUpForm['signup-password'].value;

  //Create user
  auth.createUserWithEmailAndPassword(email, password)
    .then((cred) => {
      console.log(`New user added: ${email}`)
      return db.collection('users').doc(cred.user.uid).set({
        bio: signUpForm['signup-bio'].value,
        email: email,
        guides: [],
      });
    }).then(() => {
      //reset modal and signup form
      const modal = document.querySelector('#modal-signup');
      M.Modal.getInstance(modal).close();
      signUpForm.reset();
    });
})

//Sign out
const signOut = document.querySelector('#logout');
signOut.addEventListener('click', (evt) => {
  evt.preventDefault();

  //Sign out current user
  auth.signOut();
});

//Log In
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  //Get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  auth.signInWithEmailAndPassword(email, password)
    .then((cred) => {

      //Reset modal and log in form
      const modal = document.querySelector('#modal-login');
      M.Modal.getInstance(modal).close();
      loginForm.reset();
    });
});
