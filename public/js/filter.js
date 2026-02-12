function scrollRightBtn() {
  const box = document.getElementById('filter1');
  box.scrollBy({ left: 100, behavior: 'smooth' });
}

function scrollLeftBtn() {
  const box = document.getElementById('filter1');
  box.scrollBy({ left: -100, behavior: 'smooth' });
}


function taxControl() {
  const showTax = document.getElementById('flexSwitchCheckChecked').checked;
  const taxOnPrices = document.querySelectorAll('.tax-on');
  const taxOffPrices = document.querySelectorAll('.tax-off');

  taxOnPrices.forEach(el => el.classList.toggle('d-none', showTax));
  taxOffPrices.forEach(el => el.classList.toggle('d-none', !showTax));

}

const button = document.querySelectorAll(".filter-btn");

button.forEach((btn)=>{
    btn.addEventListener("click",()=>{
        btn.classList.add("active");

        setTimeout(()=>{
            btn.classList.remove("active");
        },500)
    })
})