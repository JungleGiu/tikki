export const config = {
    leaflet: {
    mapImage: 'https://unpkg.com/leaflet@1.9.4/dist/images/',
    mapTitle: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    mapAttribution: '© OpenStreetMap, © CARTO',
    nominatim:'https://nominatim.openstreetmap.org/search',
    },
    regex : {
        email:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        password:/^.*(?=.{8,24})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\!\@\#\$\%\^\&\*\(\)\-\=\¡\£\_\+\`\~\.\,\<\>\/\?\;\:\'\"\\\|\[\]\{\}]).*$/
    }

}
