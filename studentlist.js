"use strict";

window.addEventListener("DOMContentLoaded", init);

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

function init() {
  //console.log("init");
  fetch("https://petlatkea.dk/2019/hogwarts/students.json")
    .then(promise => promise.json())
    .then(data => prepareList(data));

  document
    .querySelector("#filterButton")
    .addEventListener("click", showFilteredList);

  //document.querySelector("#sortingButton").addEventListener("click", sort);
}
/* --------------------------Preparing additional object that is needed for filtering-------------------- */

//A template for created object
const student = {
  firstName: "-first name-",
  lastName: "-last name-",
  additionalName: "-additional name-",
  house: "-house-",
  studentID: 0,
  imageUrl: "-student image-",
  crestUrl: "-image-"
};

function prepareList(data2) {
  let studentID = 0;
  data2.forEach(element => {
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
    pupil.crestUrl = urlToCrests + pupil.firstName + " " + pupil.house + ".jpg";
    arrayOfStudents.push(pupil); //puts created student entry into an array
    studentID++;
  });
  filterList("All"); //no filtering needed now
} //creates array of students (for each student element in JSON file a "pupil" object is created according to the template defined in const "student" and pushed to the array that was defined before)
//to each element in "pupil" a defined element from JSON is assigned

/* --------------------------Filtering--------------------------------------------------------------------------------- */
function showFilteredList() {
  filterList(selectHouse.value);
} //function activated on onclick in init function

function filterList() {
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
  }
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

    nameDiv.appendChild(clone);
  });

  //get all student spans and add them onlick event
  let studentSpans = document.querySelectorAll(".student");
  studentSpans.forEach(studentSpan => {
    studentSpan.addEventListener("click", showOneStudent);
  });

  houseDiv.innerHTML = "";
  arrayOfStudentsFiltered.forEach(element => {
    let clone2 = template2.cloneNode(true).content;
    clone2.querySelector(".house").textContent = element.house;

    houseDiv.appendChild(clone2);
  });
}

function showOneStudent() {
  showStudentDetail(this.id.substring(7)); //"This" always refers to the element that calls the function (it is the span element created in f. displayList),The substring() method cuts of here the first 7 letters
} //calls next function with id of clicked student

function showStudentDetail(id) {
  //styling the modal
  let modalClass = arrayOfStudents[id].house; //modals need to have class added to make it possible to style them differently
  modal.style.display = "block";
  let modalContent = document.querySelector(".modalContent");

  modalContent.classList.add(modalClass.toLowerCase()); //house class to lowercase because in array it starts with uppercase

  //filling the modal with content
  let nameDiv = document.querySelector(".studentInfo");
  let hFirstName = document.querySelector("#hA");
  let hAdditional = document.querySelector("#hB");
  let hLastName = document.querySelector("#hC");
  let pupilPhoto = document.querySelector("#pupilPhoto");
  let crestPhoto = document.querySelector("#crestPhoto");

  hFirstName.innerHTML = arrayOfStudents[id].firstName;
  //nameDiv.innerHTML = arrayOfStudents[id].firstName + "<br />";
  if (arrayOfStudents[id].additionalName.length > 1) {
    //the condition checks if this student has an additional name
    hAdditional.innerHTML = arrayOfStudents[id].additionalName;
  } else {
    hAdditional.innerHTML = "";
  }
  // the += sign is needed when the modal is filled dynamically because it adds created html elements to the div (if template is created in html it is not needed)
  hLastName.innerHTML = arrayOfStudents[id].lastName;
  pupilPhoto.src = arrayOfStudents[id].imageUrl;
  crestPhoto.src = arrayOfStudents[id].crestUrl;

  modalClose.onclick = function() {
    modal.style.display = "none";
    let modalContent = document.querySelector(".modalContent");
    modalContent.classList.remove(modalClass.toLowerCase());
  };
}
