function clicked(v)
{
    v.classList.add("disabled");
   var i=v.id;
    var n=i[2]
    var element = document.getElementById("d"+n);
  element.classList.remove("disabled");
    console.log(n)

}