var modisDay = ee.ImageCollection("MODIS/061/MYD11A1")
.filterDate("2021-01-01", "2022-12-31")
.filterBounds(roi)
.select('LST_Day_1km')

var modcelDay = modisDay.map(function(img){
  return img
  .multiply(0.02)
  .subtract(273.15)
  .copyProperties(img, ['system:time_start'])
})


var char_LST_day = ui.Chart.image.series({
  imageCollection: modcelDay,
  region: roi,
  reducer: ee.Reducer.mean(),
  scale: 1000,
  xProperty: 'system:time_start'
}).setOptions({
  title: "LST Salmonera y alrededores de dia",
  vAxis: {title: 'LST celcius'}
})

print(char_LST_day)

var modisNight = ee.ImageCollection("MODIS/061/MYD11A1")
.filterDate("2021-01-01", "2022-12-31")
.filterBounds(roi)
.select('LST_Night_1km')

var modcelNight = modisNight.map(function(img){
  return img
  .multiply(0.02)
  .subtract(273.15)
  .copyProperties(img, ['system:time_start'])
})


var char_LST_night = ui.Chart.image.series({
  imageCollection: modcelNight,
  region: roi,
  reducer: ee.Reducer.mean(),
  scale: 1000,
  xProperty: 'system:time_start'
}).setOptions({
  title: "LST Salmonera y alrededores de noche",
  vAxis: {title: 'LST celcius'}
})

print(char_LST_night)