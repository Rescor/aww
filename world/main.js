let Feature = ol.Feature;
let Map = ol.Map;
let Point = ol.geom.Point;
let TileJSON = ol.source.TileJSON;
let VectorSource = ol.source.Vector;
let View = ol.View;
let Icon = ol.style.Icon;
let Style = ol.style.Style;
let TileLayer = ol.layer.Tile;
let VectorLayer = ol.layer.Vector;
let Overlay = ol.Overlay;

let fromLonLat = ol.proj.fromLonLat;

let places = [
  {
    name: "Babruysk",
    description: "Родной город",
    coords: [29.185, 53.15],
    icon: {
      color: 'red',
      imgSize: [20, 20],
      src: 'data/dot.svg',
    }
  },
  {
    name: "Babruysk2",
    description: "Родной город2",
    coords: [21.185, 51.15],
    icon: {
      color: 'red',
      imgSize: [20, 20],
      src: 'data/dot.svg',
    }
  }
]
let features = [];

function addPlaces(places) {
  places.forEach(place => {
    const placeFeature = new Feature({
      geometry: new Point(fromLonLat(place.coords)),
      name: place.name,
      description: place.description
    })
    placeFeature.setStyle(
      new Style({
        image: new Icon(place.icon)
      })
    )
    placeFeature.on("click", function() {alert(123)})
    features.push(placeFeature)
  });
  
}
addPlaces(places);

const vectorSource = new VectorSource({
  features: features,
});

const vectorLayer = new VectorLayer({
  source: vectorSource,
});

const rasterLayer = new TileLayer({
  source: new TileJSON({
    url: 'https://a.tiles.mapbox.com/v3/aj.1x1-degrees.json?secure=1',
    crossOrigin: '',
  }),
});

const map = new Map({
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    }), vectorLayer,
  ],
  target: document.getElementById('map'),
  view: new View({
    center: fromLonLat([2.896372, 44.6024]),
    zoom: 3,
  }),
});





const element = document.getElementById('popup');

const popup = new Overlay({
  element: element,
  positioning: 'bottom-center',
  stopEvent: false,
});
map.addOverlay(popup);

// display popup on click
map.on('click', function (evt) {
  const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  });
  if (feature) {
    popup.setPosition(evt.coordinate);
    $(element).popover({
      placement: 'top',
      html: true,
      content: show(feature), //feature.get('name')
    });
    $(element).popover('show');
  } else {
    $(element).popover('dispose');
  }
});

map.on('pointermove', function (e) {
  const pixel = map.getEventPixel(e.originalEvent);
  const hit = map.hasFeatureAtPixel(pixel);
  map.getTarget().style.cursor = hit ? 'pointer' : '';
});
// Close the popup when the map is moved
map.on('movestart', function () {
  $(element).popover('dispose');
});

function show(feature) {
  console.log(feature)
  let name = feature.get("name");
  let desc = feature.get("description");
  let html = "<p>City: " + name + "</p><p>Description: " + desc + "</p><img src='https://aww.xyz/assets/img/avatar.jpg' class='photo'><br>";
  
  console.log(html)
  return html;
}