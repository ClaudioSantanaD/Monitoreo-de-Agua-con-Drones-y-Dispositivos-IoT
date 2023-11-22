var turb = ee.ImageCollection("COPERNICUS/S3/OLCI")
.filterDate("2021-01-01", "2022-12-31")
.filterBounds(roi)
.select('Oa02_radiance')

var turb_scaled = modis.map(function(img){
  return img
  .multiply(0.01338726)
  .copyProperties(img, ['system:time_start'])
})

var char_turb = ui.Chart.image.series({
  imageCollection: turb_scaled,
  region: roi,
  reducer: ee.Reducer.mean(),
  scale: 300,
  xProperty: 'system:time_start'
}).setOptions({
  title: "Turbiedad en salmonera",
  vAxis: {title: 'LST celcius'}
})

print(char_turb)

var cloro = ee.ImageCollection("COPERNICUS/S3/OLCI")
.filterDate("2021-01-01", "2022-12-31")
.filterBounds(roi)
.select('Oa06_radiance')

var cloro_scaled = cloro.map(function(img){
  return img
  .multiply(0.0123538)
  .copyProperties(img, ['system:time_start'])
})

var char_cloro = ui.Chart.image.series({
  imageCollection: cloro_scaled,
  region: roi,
  reducer: ee.Reducer.mean(),
  scale: 300,
  xProperty: 'system:time_start'
}).setOptions({
  title: "Clorofila en salmonera",
  vAxis: {title: 'LST celcius'}
})

print(char_cloro)
