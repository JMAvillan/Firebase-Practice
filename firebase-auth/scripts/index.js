const guideList = document.querySelector('.guides');
const loggedInLinks = document.querySelectorAll('.logged-in');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const accountDetails = document.querySelector('.account-details');

//setup the guides
const setUpGuides = (data) => {

  let html = "";
  if (data.length) {
    //Loop through each document and create an html template with the data
    data.forEach((doc) => {
      const guide = doc.data();
      let lastUpdate = new Date(guide.lastUpdate).toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" });
      const li =
        `<li>
        <div class="collapsible-header grey lighten-4"> ${guide.title}</div>
        <div class="collapsible-body white"> 
        Last Updated: ${lastUpdate}
        <p>${guide.content}</p>
        </div>
      </li>`;
      html += li;
    });
  } else {
    html += "<h5>Login to view guides</h5>";
  }
  //Add the html template to the ul element
  guideList.innerHTML = html;
}

//setupUI
const setUpUI = (user) => {
  if (user) {

    //Acount info
    db.collection('users').doc(user.uid).get()
      .then(doc => {
        const html =
          `<div> Logged in as ${user.email}</div>
            <div>${doc.data().bio}</div>`;
        accountDetails.innerHTML = html;
      });

    //toggle UI elements
    loggedInLinks.forEach(item => item.hidden = false);
    loggedOutLinks.forEach(item => item.hidden = true);
  }
  else {
    //hide account info
    accountDetails.innerHTML = ''

    //toggle UI elements
    loggedInLinks.forEach(item => item.hidden = true);
    loggedOutLinks.forEach((item) => item.hidden = false);
  }
}

// setup materialize components
document.addEventListener('DOMContentLoaded', function () {

  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);

});