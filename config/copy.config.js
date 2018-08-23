// this is a custom dictionary to make it easy to extend/override
// provide a name for an entry, it can be anything such as 'copyAssets' or 'copyFonts'
// then provide an object with a `src` array of globs and a `dest` string
module.exports = {
  copyDeps: {
    src: [
      '{{ROOT}}/node_modules/leaflet/dist/leaflet.css',
      '{{ROOT}}/node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css',
      '{{ROOT}}/node_modules/jquery/dist/jquery.min.js'
    ],
    dest: '{{BUILD}}'
  },
  copyLeafletIcons: {
    src: [
      '{{ROOT}}/node_modules/leaflet/dist/images/*'
    ],
    dest: '{{BUILD}}/images/'
  }
}
