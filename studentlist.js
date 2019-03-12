"use strict";

window.addEventListener("DOMContentLoaded", init);

let myFullName = "Ludwina Joanna Otto-Dlugajczyk";
let nameDiv = document.querySelector(".name");
let houseDiv = document.querySelector(".house");
let template1 = document.querySelector(".student");
let template2 = document.querySelector(".location");
let modal = document.querySelector(".modal");
let modalClose = document.querySelector(".modalClose");
let selectHouse = document.querySelector("#select");
//let selectSorting = document.querySelector("#sort");
//let filteringEffect = [];
const arrayOfHouses = []; //to use with select
const arrayOfStudents = []; //array that is used with the student template
let urlToImages;
let urlToCrests;
let families = [];
let expelledStudentsNo = 0;

function init() {
  //console.log("init");

  document
    .querySelector("#filterButton")
    .addEventListener("click", showFilteredList);

  // register remove-button

  //document.querySelector("#sortingButton").addEventListener("click", sort);
  getFamilies();
}

//-----------------------------------removing----------------------------------------------

function clickRemove(toBeRemoved) {
  if (checkifItsMe(toBeRemoved)) {
    let soonToBeRemoved = translateIdToStudent(toBeRemoved); //toBeRemoved - id of student clicked to delete
    //loop through all array to show - The findIndex() method returns the index of the first element in the array that satisfies the provided testing function. Otherwise, it returns -1, indicating no element passed the test.
    arrayOfStudents.splice(soonToBeRemoved, 1);
    expelledStudentsNo++;

    filterAndSort();
    countStudents();
  } else {
    //show visual warning
    showVisualWarning();
  }
}

function showVisualWarning() {
  //console.log("visual");
  document.querySelector(".visualWarning").style.display = "block";
  setTimeout(function() {
    document.querySelector(".visualWarning").style.display = "none";
  }, 3000);
  return false;
}

function translateIdToStudent(id) {
  return arrayOfStudents.findIndex(student => student.studentID == id);
}

function checkifItsMe(toBeRemoved) {
  let soonToBeRemoved = translateIdToStudent(toBeRemoved);
  let name = myFullName; //this variable is used in string manipulations below
  if (
    arrayOfStudents[soonToBeRemoved].firstName ==
    name.substring(0, name.indexOf(" "))
  ) {
    return false;
  } else {
    return true;
  }
}

function getJSON() {
  fetch("https://petlatkea.dk/2019/hogwarts/students.json")
    .then(promise => promise.json())
    .then(data => prepareObject(data));
}

function getFamilies() {
  fetch("https://petlatkea.dk/2019/hogwarts/families.json")
    .then(pro => pro.json())
    .then(nameChecking);
}

function nameChecking(bloodList) {
  families = bloodList;
  //console.log(families);
  getJSON();
}
/* --------------------------Counting-------------------------------------------------------------------- */

function countStudents() {
  let housesNo = document.querySelector("#HousesNo");
  housesNo.innerHTML = "<br />";
  for (let i = 0; i < arrayOfHouses.length; i++) {
    let countList = arrayOfStudents.filter(function(pupil) {
      return pupil.house === arrayOfHouses[i];
    }); //creates a filtered array of students of only one house (loops through array of houses,then thtough array of students to filter students belonging to house with chosen name)
    housesNo.innerHTML += arrayOfHouses[i] + ": " + countList.length + "<br />"; //adds name of house (arrayOfHouses[i]), number of students to display in counter
  }
  //add no of expelled
  let span = document.querySelector("#ExpelledNo");
  span.innerHTML = expelledStudentsNo;
}

function prepareHouses() {
  arrayOfStudents.forEach(pupil => {
    if (arrayOfHouses.includes(pupil.house) != true) {
      arrayOfHouses.push(pupil.house);
    }
  });
} //prepare array of houses, so we are not hardcoding them (array with 4 houses)

/* --------------------------Preparing additional object that is needed for filtering-------------------- */

//A template for created object
const student = {
  firstName: "-first name-",
  lastName: "-last name-",
  additionalName: "-additional name-",
  house: "-house-",
  studentID: 0,
  bloodstatus: "-student blood type-",
  imageUrl: "-student image-",
  crestUrl: "-image-",
  squad: "no",
  squadDate: new Date()
};

function prepareObject(studentlist) {
  addMe(); //as I'm the most important student, so first add me
  let studentID = 1;
  studentlist.forEach(element => {
    let pupil = Object.create(student); //New object called "pupil" - Object.create() method creates a new object, using an existing object as the prototype of the newly created object.
    //console.log(pupil);
    let name = element.fullname; //this variable is used in string manipulations below
    pupil.firstName = name.substring(0, name.indexOf(" ")); //creates content of firstName - takes a part of firstname string from index 0 to the first space
    pupil.lastName = name.substring(name.lastIndexOf(" ") + 1); //creates content of lastName takes a part of lastname - what is after first space
    pupil.additionalName = name.substring(
      name.indexOf(" ") + 1,
      name.lastIndexOf(" ") //it will be a part of an array, but it will not be displayed in the first part
    );
    pupil.house = element.house; //no string manipulations needed in this element

    pupil.studentID = studentID;
    pupil.imageUrl =
      "images/" +
      pupil.lastName.toLowerCase() +
      "_" +
      name.substring(0, 1).toLowerCase() +
      ".png"; //exemplary img filename: brown_l.png
    urlToImages + pupil.firstName + " " + pupil.lastName + ".jpg";
    pupil.crestUrl = "images/" + pupil.house + ".png";
    pupil.expelled = 0; //all students are not yet expelled

    const lastN = pupil.lastName;

    function checkblood(lastN) {
      //console.log(lastN);
      if (families.half.includes(lastN)) {
        pupil.bloodstatus = "Half";
      } else if (families.pure.includes(lastN)) {
        pupil.bloodstatus = "Pure";
      } else {
        pupil.bloodstatus = "Muggle";
      }
    }
    checkblood(lastN);

    arrayOfStudents.push(pupil); //puts created student entry into an array
    studentID++;
  });
  prepareHouses(); //prepare array with houses
  countStudents(); //show no of students in houses
  filterAndSort("All"); //no filtering needed now
} //creates array of students (for each student element in JSON file a "pupil" object is created according to the template defined in const "student" and pushed to the array that was defined before)
//to each element in "pupil" a defined element from JSON is assigned

/* --------------------------Filtering--------------------------------------------------------------------------------- */
function showFilteredList() {
  filterAndSort(selectHouse.value);
} //function activated on onclick in init function

function filterAndSort() {
  let select = document.querySelector("#select");
  let sort = document.querySelector("#sort");
  let filteredList = arrayOfStudents;
  //console.log(select.value);

  if (select.value === "All") {
    filteredList = arrayOfStudents;
  } else if (select.value === "Hufflepuff") {
    filteredList = arrayOfStudents.filter(function(pupil) {
      return pupil.house === "Hufflepuff";
    });
  } else if (select.value === "Gryffindor") {
    filteredList = arrayOfStudents.filter(function(pupil) {
      return pupil.house === "Gryffindor";
    });
  } else if (select.value === "Ravenclaw") {
    filteredList = arrayOfStudents.filter(function(pupil) {
      return pupil.house === "Ravenclaw";
    });
  } else if (select.value === "Slytherin") {
    filteredList = arrayOfStudents.filter(function(pupil) {
      return pupil.house === "Slytherin";
    });
  }
  if (sort.value == "First Name") {
    //sort the array
    displayList(filteredList.sort(sortByFirstName));
    //displayList(filteredList.sort(sortByFirstName));
  } else if (sort.value == "Last Name") {
    //sort the array
    displayList(filteredList.sort(sortByLastName));
  } else if (sort.value == "House") {
    //sort the array
    displayList(filteredList.sort(sortByHouse));
  } else {
    //show unsorted
    displayList(filteredList.sort(sortByID));
  } //this "else" decides what is shown if user does not use sorting, just filtering
}

/* --------------------------Sorting--------------------------------------------------------------------------------- */

function sortByLastName(a, b) {
  if (a.lastName < b.lastName) {
    return -1;
  } else {
    return 1;
  }
}

function sortByFirstName(a, b) {
  if (a.firstName < b.firstName) {
    return -1;
  } else {
    return 1;
  }
}

function sortByHouse(a, b) {
  if (a.house < b.house) {
    return -1;
  } else {
    return 1;
  }
}

function sortByID(a, b) {
  if (a.studentID < b.studentID) {
    return -1;
  } else {
    return 1;
  }
}

function displayList(arrayOfStudentsFiltered) {
  //displaying students list
  nameDiv.innerHTML = "";
  arrayOfStudentsFiltered.forEach(element => {
    let clone = template1.cloneNode(true).content;
    clone.querySelector(".name").innerHTML =
      "<span class='student' id='student" +
      element.studentID +
      "'>" +
      element.firstName +
      " " +
      element.lastName +
      "</span>";
    clone.querySelector("[data-action=remove]").id =
      "removeButton" + element.studentID; //button to expel (in template) - the button gets id of the student element that is next to (for each, każdy student dostaje imię itd. i buttona)

    nameDiv.appendChild(clone);
  });
  //displaying houses list
  houseDiv.innerHTML = "";
  arrayOfStudentsFiltered.forEach(element => {
    if (element.expelled == 0) {
      let clone2 = template2.cloneNode(true).content;
      clone2.querySelector(".house").textContent = element.house;

      houseDiv.appendChild(clone2);

      //get all student spans and add them onlick event
      let studentSpans = document.querySelectorAll(".student");
      studentSpans.forEach(studentSpan => {
        studentSpan.addEventListener("click", showOneStudentID);
      });
      //removing
      document
        .querySelector(".listWrapper")
        .addEventListener("click", clickList);
    }
  });
}

function clickList(event) {
  //Figure out if a button was clicked
  if (event.target.tagName === "BUTTON") {
    //call proper function
    let toBeRemoved = event.target.id.substring(12); //"remove button" + id studenta
    clickRemove(toBeRemoved);
  }
}

function showOneStudentID() {
  showStudentModal(this.id.substring(7)); //"This" always refers to the element that calls the function (it is the span element created in f. displayList),The substring() method cuts of here the first 7 letters
} //calls next function with id of clicked student

function showStudentModal(id) {
  let studentToShow = translateIdToStudent(id);
  //console.table(studentToShow);
  //styling the modal
  let modalClass = arrayOfStudents[studentToShow].house; //modals need to have class added to make it possible to style them differently
  modal.style.display = "block";
  let modalContent = document.querySelector(".modalContent");

  modalContent.classList.add(modalClass.toLowerCase()); //house class to lowercase because in array it starts with uppercase

  //filling the modal with content
  let nameDiv = document.querySelector(".studentInfo");
  let hFirstName = document.querySelector("#hA");
  let hAdditional = document.querySelector("#hB");
  let hLastName = document.querySelector("#hC");
  let bloodStatus = document.querySelector("#bloodDetails");
  let squadInfo = document.querySelector("#squadInfo");
  let pupilPhoto = document.querySelector("#pupilPhoto");
  let crestPhoto = document.querySelector("#crestPhoto");

  hFirstName.innerHTML = arrayOfStudents[studentToShow].firstName;
  //nameDiv.innerHTML = arrayOfStudents[id].firstName + "<br />";
  if (arrayOfStudents[studentToShow].additionalName.length > 1) {
    //the condition checks if this student has an additional name
    hAdditional.innerHTML = " " + arrayOfStudents[studentToShow].additionalName;
  } else {
    hAdditional.innerHTML = "";
  }
  // the += sign is needed when the modal is filled dynamically because it adds created html elements to the div (if template is created in html it is not needed)
  hLastName.innerHTML = arrayOfStudents[studentToShow].lastName;
  bloodStatus.textContent = arrayOfStudents[studentToShow].bloodstatus;
  squadInfo.innerHTML = "Member of Inquisitorial Squad: ";
  if (arrayOfStudents[studentToShow].squad == "no") {
    squadInfo.innerHTML += "No &raquo; <span id='squad" + id + "'>Add</span>";
  } else {
    squadInfo.innerHTML +=
      "Yes &raquo; <span id='squad" + id + "'>Remove</span>";
  }
  pupilPhoto.src = arrayOfStudents[studentToShow].imageUrl;
  crestPhoto.src = arrayOfStudents[studentToShow].crestUrl;

  modalClose.onclick = function() {
    modal.style.display = "none";
    let modalContent = document.querySelector(".modalContent");
    modalContent.classList.remove(modalClass.toLowerCase());
  };

  let spanName = "#squad" + id; //jak ten element jest widoczny w modalu jeśli to wewnętrzny let w tej funkcji? (Jet też let o tej nazwie w innej funkcji)

  document
    .querySelector(spanName)
    .addEventListener("click", updateInquisitorialSquad);
  //stworzenie variable spanName o nazwie "#squad" + id - co się z nim dalej dzieje???????????
}

function updateInquisitorialSquad() {
  let id = this.id.substring(5); //id of the "squad" element
  let arrayIndex = translateIdToStudent(id);
  if (checkInquisitorialSquad(id)) {
    //check if change of status is possible

    if (arrayOfStudents[arrayIndex].squad == "yes") {
      //checks if student is a member of squad

      removeFromInquisitorialSquad(id); //remove from squad
    } else {
      addToInquisitorialSquad(id); //add to squad
    }
  } else {
    //display 3 second warning when student is not suited for this job
    document.querySelector(".fullWarning").style.display = "block";
    setTimeout(function() {
      document.querySelector(".fullWarning").style.display = "none";
    }, 3000);
    return false;
  }
}

function checkInquisitorialSquad(id) {
  //only pure or slytherin
  let arrayIndex = translateIdToStudent(id);
  if (
    arrayOfStudents[arrayIndex].bloodstatus == "Pure" ||
    arrayOfStudents[arrayIndex].house == "Slytherin"
  ) {
    return true;
  } else {
    return false;
  }
}

function addToInquisitorialSquad(id) {
  let arrayIndex = translateIdToStudent(id);
  //let dt = new Date();
  //dt.setSeconds(dt.getSeconds() + 15); //set expiration date - remove from squad after 15 seconds
  arrayOfStudents[arrayIndex].squad = "yes";
  //arrayOfStudents[arrayIndex].squadDate = dt;

  showStudentModal(id); //refresh info
}

function removeFromInquisitorialSquad(id) {
  let arrayIndex = translateIdToStudent(id);
  arrayOfStudents[arrayIndex].squad = "no";
  showStudentModal(id); //refresh info
}

function addMe() {
  let name = myFullName; //this variable is used in string manipulations below
  let pupil = Object.create(student);
  pupil.firstName = name.substring(0, name.indexOf(" ")); //creates content of firstName - takes a part of firstname string from index 0 to the first space
  pupil.lastName = name.substring(name.lastIndexOf(" ") + 1); //creates content of lastName takes a part of lastname - what is after first space
  pupil.additionalName = name.substring(
    name.indexOf(" ") + 1,
    name.lastIndexOf(" ") //it will be a part of an array, but it will not be displayed in the first part
  );
  pupil.house = "Gryffindor"; //temporary house to be changed later
  pupil.bloodstatus = "blue";
  pupil.studentID = 0;
  pupil.imageUrl =
    urlToImages + pupil.firstName + " " + pupil.lastName + ".jpg";
  pupil.crestUrl = urlToCrests + pupil.firstName + " " + pupil.house + ".jpg";
  pupil.expelled = 0; //all students are not yet expelled
  pupil.squad = "no"; //no one is yet in the inquisitorial squad
  arrayOfStudents.push(pupil); //puts created student entry into an array
}
