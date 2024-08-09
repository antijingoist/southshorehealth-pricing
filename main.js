console.log('loaded main.js');
let ssdata = "";
let filterData = "";
let searchURL = "";
let USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

window.addEventListener("DOMContentLoaded", (event) => {
  console.log(event);

  document.getElementById('filterButton').addEventListener("click", filterResults);
});
function filterResults() {
  filterData = document.getElementById('filterText').value;
  if (filterData === "") {
    fillCards(1, 500);
  } else {
    fillCards(1, 500, filterData);
  }
}

function fillCards (start, end, filter=""){
  let data = ssdata;
  let standardCharge = data.standard_charge_information;
  let itemTiles = "";
  let itemTile = "";
  let theItem = "";
  
  if (filter != "") {
    standardCharge = data.standard_charge_information.filter(function(item){
      return item.description.toLowerCase().includes(filter.toLowerCase());
    });
  }

  for (var lineItem = start; lineItem < (end - 1); lineItem++){
    theItem = standardCharge[lineItem];
    if(typeof(theItem) != "undefined"){
      searchURL = "https://google.com/search?q=";
      searchURL += encodeURIComponent('"' +theItem.description+'"');
      if (typeof(theItem.standard_charges[0].gross_charge) != "undefined") {
        itemTile =`
                  <div class="priceItem card">
                    <div class="card-body">
                      <h5 class="card-title">
                        <p>${theItem.description} <span class=searchDesc>
                        <a href='${searchURL}'>
                          (search)
                          </a>
                        </span>
                        </p>
                      </h5>
                      <h6 class="card-subtitle">
                        ${theItem.standard_charges[0].additional_generic_notes}
                      </h6>
                    <div class="card-text">
                      <ul class="list-group list-group-flush">
                        <li class="list-group-item"><strong>Class:</strong> 
                        ${theItem.standard_charges[0].billing_class}</li>
                        <li class="list-group-item">
                          <strong>Discounted Cash:</strong>
                          ${USDollar.format(theItem.standard_charges[0].discounted_cash)}
                        </li>
                        <li class="list-group-item">
                          <strong>Insurance:</strong>
                          ${USDollar.format(theItem.standard_charges[0].gross_charge)}
                        </li>
                        <li class="list-group-item">
                          <strong>Inpatient/Outpatient: </strong>
                          ${theItem.standard_charges[0].setting}
                        </li>
                      </ul>
                    </div>
                    </div>
                  </div>
                  `;
        } else {
           itemTile =`
              <div class="priceItem card">
                <div class="card-body">
                  <h5 class="card-title">
                    <p>${theItem.description} <span class=searchDesc>
                    <a href='${searchURL}'>
                      (search)
                      </a>
                    </span>
                    </p>
                  </h5>
                  <h6 class="card-subtitle">
                    Price dependant on insurance, with different estimated amounts for each insurance provider.
                  </h6>
                <div class="card-text">
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item"><strong>Class:</strong> 
                    ${theItem.standard_charges[0].billing_class}</li>
                    <li class="list-group-item">
                      <strong>Minimum Cost:</strong>
                      ${USDollar.format(theItem.standard_charges[0].minimum)}
                    </li>
                    <li class="list-group-item">
                      <strong>Maximum Cost:</strong>
                      ${USDollar.format(theItem.standard_charges[0].maximum)}
                    </li>
                    <li class="list-group-item">
                    <strong>Inpatient/Outpatient: </strong>
                      ${theItem.standard_charges[0].setting}
                    </li>
                  </ul>
                  
                </div>
                </div>
              </div>
              `;
        }
       itemTiles += itemTile;
   }
  }
  document.getElementById('cards').innerHTML = itemTiles;
}

function loadFile() {
  var input, file, fr;

  if (typeof window.FileReader !== 'function') {
    alert("The file API isn't supported on this browser yet.");
    return;
  }

  input = document.getElementById('fileinput');
  if (!input) {
    alert("Um, couldn't find the fileinput element.");
  }
  else if (!input.files) {
    alert("This browser doesn't seem to support the `files` property of file inputs.");
  }
  else if (!input.files[0]) {
    alert("Please select a file before clicking 'Load'");
  }
  else {
    file = input.files[0];
    fr = new FileReader();
    fr.onload = receivedText;
    fr.readAsText(file);
  }

  function receivedText(e) {
    let lines = e.target.result;
    ssdata = JSON.parse(lines); 
    hideData();
  }
}

function hideData() {
  document.getElementById('loadJSON').style.visibility = "hidden";
  filterResults();
}
