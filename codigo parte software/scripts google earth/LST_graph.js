var image_temp = ee.ImageCollection("NOAA/CDR/SST_PATHFINDER/V53")
.filterDate("2021-01-01", "2022-12-31")
.filterBounds(roi)
.select('sea_surface_temperature')

var toCelcius = image_temp.map(function(img){
  return img
  .multiply(0.01)
  .copyProperties(img, ['system:time_start'])
})


var chart_temp = ui.Chart.image.series({
  imageCollection: toCelcius,
  region: roi,
  reducer: ee.Reducer.mean(),
  scale: 4000 ,
  xProperty: 'system:time_start'
}).setOptions({
  title: "Temperatura Salmonera y alrededores",
  vAxis: {title: 'grados celcius'}
})

print(chart_temp)
