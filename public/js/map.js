  const map = new maplibregl.Map({
      container: 'map',
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: listing.geometry.coordinates,
      zoom: 9.5
    });
    
if (listing.geometry && listing.geometry.coordinates && listing.geometry.coordinates.length === 2) {
    const coordinates = listing.geometry.coordinates;

    new maplibregl.Marker()
      .setLngLat(coordinates)
      .setPopup(
        new maplibregl.Popup({ offset: 25 })
          .setHTML(`<h4>${listing.location}</h4><p>Exact location provided after booking</p>`)
      )
      .addTo(map);
  } else {
    console.error("Invalid coordinates:", listing.geometry);
  }