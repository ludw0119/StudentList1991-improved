"use strict";

window.addEventListener("DOMContentLoaded", init);

let nameDiv = document.querySelector(".name");
let houseDiv = document.querySelector(".house");
let template1 = document.querySelector(".student");
let template2 = document.querySelector(".location");
const arrayOfHouses = []; //to use with select
const arrayOfStudents = []; //array that is used with the student template

//A template for created object
const student = {
  firstName: "-first name-",
  lastName: "-last name-",
  additionalName: "-additional name-",
  house: "-house-"
};

function init() {
  //console.log("init");
  fetch("http://petlatkea.dk/2019/hogwarts/students.json")
    .then(promise => promise.json())
    .then(data => prepareList(data));

  document
    .querySelector("#filterButton")
    .addEventListener("click", showFilteredList);
}

function prepareList(data2) {
  console.log(data2);
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

    arrayOfStudents.push(pupil); //puts created "pupils" to array of students
  });
  filterList("All"); //no filtering needed now
} //creates array of students (for each student element in JSON file a "pupil" object is created according to the template defined in const "student" and pushed to the array that was defined before)
//each element in "pupil" a defined element from JSON is assigned

function showFilteredList() {
  let houseSelect = document.querySelector(".filter");
  filterList(houseSelect.value);
} //function activated on onclick in init function

/*function filterList(filter) {
  let arrayOfStudentsFiltered;
  if (filter === "All") {
    arrayOfStudentsFiltered = arrayOfStudents;
  } else {
    arrayOfStudentsFiltered = arrayOfStudents.filter(function(pupil) {
      return pupil.house === filter; //The filter() method creates a new array with all elements that pass the test implemented by the provided function.
    });
  }
  displayList(arrayOfStudentsFiltered);
} //The filter() method creates a new array with all elements that pass the test implemented by the provided function. (MDN Array.prototype.filter)
*/
//////////////////////////////////////////////////////////////////////////////////////

function filterList() {
  let select = document.querySelector("#select");
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
      return pupil.house === "Hufflepuff";
    });
  } else if (select.value === "Ravenclaw") {
    filteredList = arrayOfStudents.filter(function(pupil) {
      return pupil.house === "Ravenclaw";
    });li
  } else if (select.value === "Slytherin") {
    filteredList = arrayOfStudents.filter(function(pupil) {
      return pupil.house === "Slytherin";
    });
  }
  displayList(filteredList);
}

/////////////////////////////////////////////////////////////////////////////////////v/////////////////

//displaying filtered elements - appending cloned templates to chosen divs
function displayList(arrayOfStudentsFiltered) {
  nameDiv.innerHTML = "";
  arrayOfStudentsFiltered.forEach(element => {
    let clone = template1.cloneNode(true).content;
    clone.querySelector(".name").innerHTML =
      element.firstName + " " + element.lastName;

    nameDiv.appendChild(clone);
  });

  houseDiv.innerHTML = "";
  arrayOfStudentsFiltered.forEach(element => {
    let clone2 = template2.cloneNode(true).content;
    clone2.querySelector(".house").textContent = element.house;

    houseDiv.appendChild(clone2);
  });
}
