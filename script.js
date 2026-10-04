const gallery=document.querySelector("#travel-gallery");
if(gallery){
  const total=Number(gallery.dataset.total||75);
  for(let i=1;i<=total;i++){
    const n=String(i).padStart(2,"0");
    const f=document.createElement("figure");
    const img=document.createElement("img");
    f.className="photo";
    img.src=`images/travel-vol-01/photo-${n}.webp`;
    img.alt=`Travel Vol.01 — photograph ${n}`;
    img.loading=i<7?"eager":"lazy";
    img.decoding="async";
    img.dataset.index=i-1;
    f.appendChild(img);
    gallery.appendChild(f);
  }

  const box=document.querySelector(".lightbox");
  const boxImg=box.querySelector("img");
  const count=box.querySelector(".lightbox-count");
  let current=0;

  function show(i){
    current=(i+total)%total;
    const n=String(current+1).padStart(2,"0");
    boxImg.src=`images/travel-vol-01/photo-${n}.webp`;
    boxImg.alt=`Travel Vol.01 — photograph ${n}`;
    count.textContent=`${n} / ${total}`;
  }

  gallery.addEventListener("click",e=>{
    if(e.target.tagName!=="IMG")return;
    show(Number(e.target.dataset.index));
    box.classList.add("is-open");
    box.setAttribute("aria-hidden","false");
    document.body.style.overflow="hidden";
  });

  function close(){
    box.classList.remove("is-open");
    box.setAttribute("aria-hidden","true");
    document.body.style.overflow="";
    boxImg.src="";
  }

  box.querySelector(".lightbox-close").onclick=close;
  box.querySelector(".lightbox-prev").onclick=()=>show(current-1);
  box.querySelector(".lightbox-next").onclick=()=>show(current+1);
  box.addEventListener("click",e=>{if(e.target===box)close()});
  document.addEventListener("keydown",e=>{
    if(!box.classList.contains("is-open"))return;
    if(e.key==="Escape")close();
    if(e.key==="ArrowLeft")show(current-1);
    if(e.key==="ArrowRight")show(current+1);
  });
}

const visitedCities=[
  {name:"Taipei",lat:25.0330,lng:121.5654},
  {name:"Shanghai",lat:31.2304,lng:121.4737},
  {name:"Chengdu",lat:30.5728,lng:104.0668},
  {name:"Chaozhou",lat:23.6567,lng:116.6226},
  {name:"Hong Kong",lat:22.3193,lng:114.1694},
  {name:"Xiamen",lat:24.4798,lng:118.0894},
  {name:"Guangzhou",lat:23.1291,lng:113.2644},
  {name:"Toyama",lat:36.6953,lng:137.2113},
  {name:"Kyoto",lat:35.0116,lng:135.7681},
  {name:"Shirahama",lat:33.6780,lng:135.3480},
  {name:"Kobe",lat:34.6901,lng:135.1955},
  {name:"Tokyo",lat:35.6762,lng:139.6503},
  {name:"Seoul",lat:37.5665,lng:126.9780},
  {name:"Chiang Mai",lat:18.7883,lng:98.9853},
  {name:"Milan",lat:45.4642,lng:9.1900},
  {name:"Forlì",lat:44.2227,lng:12.0407},
  {name:"Padova",lat:45.4064,lng:11.8768},
  {name:"Como",lat:45.8081,lng:9.0852},
  {name:"Cologne",lat:50.9375,lng:6.9603},
  {name:"London",lat:51.5074,lng:-0.1278},
  {name:"Lewes",lat:50.8739,lng:0.0088},
  {name:"Brighton",lat:50.8225,lng:-0.1372},
  {name:"Amsterdam",lat:52.3676,lng:4.9041},
  {name:"Copenhagen",lat:55.6761,lng:12.5683},
  {name:"Aarhus",lat:56.1629,lng:10.2039},
  {name:"Porto",lat:41.1579,lng:-8.6291}
];

const mapElement=document.querySelector("#world-map");
if(mapElement&&window.L){
  const map=L.map(mapElement,{
    zoomControl:false,
    minZoom:2,
    maxZoom:7,
    scrollWheelZoom:true,
    worldCopyJump:false,
    attributionControl:false
  }).setView([31,38],2);

  L.control.zoom({position:"bottomleft"}).addTo(map);

  fetch("data/ne_110m_land.geojson")
    .then(response=>{
      if(!response.ok)throw new Error("Map data could not be loaded.");
      return response.json();
    })
    .then(land=>{
      L.geoJSON(land,{
        interactive:false,
        style:{
          color:"#c9c7c1",
          weight:0.7,
          opacity:0.8,
          fillColor:"#f2f1ed",
          fillOpacity:0.38
        }
      }).addTo(map);
    })
    .catch(()=>{});

  visitedCities.forEach((city,index)=>{
    const number=String(index+1).padStart(2,"0");
    const pointIcon=L.divIcon({
      className:"city-point",
      html:`<div class="city-marker"><span class="city-index">${number}</span><span class="city-dot" aria-hidden="true"></span></div>`,
      iconSize:[28,24],
      iconAnchor:[13,14],
      popupAnchor:[1,-9]
    });

    const marker=L.marker([city.lat,city.lng],{
      icon:pointIcon,
      title:city.name,
      alt:city.name,
      keyboard:true
    }).addTo(map);

    marker.bindTooltip(city.name,{
      direction:"top",
      offset:[1,-8],
      opacity:1,
      className:"city-tooltip"
    });
    marker.bindPopup(city.name,{closeButton:false,offset:[0,-2]});
  });

  map.setMaxBounds([[-70,-180],[82,180]]);
}
