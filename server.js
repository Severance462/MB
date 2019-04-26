const dotenv = require('dotenv').config();

const { GraphQLServer } = require('graphql-yoga');
const axios = require('axios');
const aws = require('aws-sdk');
const express = require("express");
const app = express();
const request = require('request');
app.set('view engine', 'hbs');
const hbs = require('hbs');
const schema = require('./src/schema');
const Scraper = require('./src/helpers/scraper');
const trim = require('trim');
const replace = require('replace-string');
// const async = require('async');
const https = require('https');
const queryString = require("querystring");
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended:false}));
hbs.registerPartials(__dirname + '/views/partials')
/*
//const YTPlayer = require('yt-player')
//const player = new YTPlayer('#player')

// player.load()
// player.setVolume(100)
// player.on('playing', () => {
//     console.log(player.getDuration())
// })
*/
//
var start = 0
var fs = require('fs');
var readline = require('readline');
var {google} = require('googleapis');
//

// const result = dotenv.config()

// if (result.error) {
//   throw result.error
// }

// console.log(result.parsed)
const ytk = process.env.ytk
const ytkb = process.env.ytkb
// const dotenvp = require('dotenv')
// const buf = Buffer.from('YTK=env')
// const config = dotenvp.parse(buf)
// console.log(typeof config, config)
//////THIS NEEDS HEROKU VAR
//YTK

// let YTK = new aws.S3({
//     accessKeyId: process.env.AWS_ACCESS_KEY,
//     secretAccessKey: process.env.AWS_SECRET_KEY
// });

const countries2d = [{"Code": "AF", "Name": "Afghanistan"},{"Code": "AX", "Name": "\u00c5land Islands"},{"Code": "AL", "Name": "Albania"},{"Code": "DZ", "Name": "Algeria"},{"Code": "AS", "Name": "American Samoa"},{"Code": "AD", "Name": "Andorra"},{"Code": "AO", "Name": "Angola"},{"Code": "AI", "Name": "Anguilla"},{"Code": "AQ", "Name": "Antarctica"},{"Code": "AG", "Name": "Antigua and Barbuda"},{"Code": "AR", "Name": "Argentina"},{"Code": "AM", "Name": "Armenia"},{"Code": "AW", "Name": "Aruba"},{"Code": "AU", "Name": "Australia"},{"Code": "AT", "Name": "Austria"},{"Code": "AZ", "Name": "Azerbaijan"},{"Code": "BS", "Name": "Bahamas"},{"Code": "BH", "Name": "Bahrain"},{"Code": "BD", "Name": "Bangladesh"},{"Code": "BB", "Name": "Barbados"},{"Code": "BY", "Name": "Belarus"},{"Code": "BE", "Name": "Belgium"},{"Code": "BZ", "Name": "Belize"},{"Code": "BJ", "Name": "Benin"},{"Code": "BM", "Name": "Bermuda"},{"Code": "BT", "Name": "Bhutan"},{"Code": "BO", "Name": "Bolivia, Plurinational State of"},{"Code": "BQ", "Name": "Bonaire, Sint Eustatius and Saba"},{"Code": "BA", "Name": "Bosnia and Herzegovina"},{"Code": "BW", "Name": "Botswana"},{"Code": "BV", "Name": "Bouvet Island"},{"Code": "BR", "Name": "Brazil"},{"Code": "IO", "Name": "British Indian Ocean Territory"},{"Code": "BN", "Name": "Brunei Darussalam"},{"Code": "BG", "Name": "Bulgaria"},{"Code": "BF", "Name": "Burkina Faso"},{"Code": "BI", "Name": "Burundi"},{"Code": "KH", "Name": "Cambodia"},{"Code": "CM", "Name": "Cameroon"},{"Code": "CA", "Name": "Canada"},{"Code": "CV", "Name": "Cape Verde"},{"Code": "KY", "Name": "Cayman Islands"},{"Code": "CF", "Name": "Central African Republic"},{"Code": "TD", "Name": "Chad"},{"Code": "CL", "Name": "Chile"},{"Code": "CN", "Name": "China"},{"Code": "CX", "Name": "Christmas Island"},{"Code": "CC", "Name": "Cocos (Keeling) Islands"},{"Code": "CO", "Name": "Colombia"},{"Code": "KM", "Name": "Comoros"},{"Code": "CG", "Name": "Congo"},{"Code": "CD", "Name": "Congo, the Democratic Republic of the"},{"Code": "CK", "Name": "Cook Islands"},{"Code": "CR", "Name": "Costa Rica"},{"Code": "CI", "Name": "C\u00f4te d'Ivoire"},{"Code": "HR", "Name": "Croatia"},{"Code": "CU", "Name": "Cuba"},{"Code": "CW", "Name": "Cura\u00e7ao"},{"Code": "CY", "Name": "Cyprus"},{"Code": "CZ", "Name": "Czech Republic"},{"Code": "DK", "Name": "Denmark"},{"Code": "DJ", "Name": "Djibouti"},{"Code": "DM", "Name": "Dominica"},{"Code": "DO", "Name": "Dominican Republic"},{"Code": "EC", "Name": "Ecuador"},{"Code": "EG", "Name": "Egypt"},{"Code": "SV", "Name": "El Salvador"},{"Code": "GQ", "Name": "Equatorial Guinea"},{"Code": "ER", "Name": "Eritrea"},{"Code": "EE", "Name": "Estonia"},{"Code": "ET", "Name": "Ethiopia"},{"Code": "FK", "Name": "Falkland Islands (Malvinas)"},{"Code": "FO", "Name": "Faroe Islands"},{"Code": "FJ", "Name": "Fiji"},{"Code": "FI", "Name": "Finland"},{"Code": "FR", "Name": "France"},{"Code": "GF", "Name": "French Guiana"},{"Code": "PF", "Name": "French Polynesia"},{"Code": "TF", "Name": "French Southern Territories"},{"Code": "GA", "Name": "Gabon"},{"Code": "GM", "Name": "Gambia"},{"Code": "GE", "Name": "Georgia"},{"Code": "DE", "Name": "Germany"},{"Code": "GH", "Name": "Ghana"},{"Code": "GI", "Name": "Gibraltar"},{"Code": "GR", "Name": "Greece"},{"Code": "GL", "Name": "Greenland"},{"Code": "GD", "Name": "Grenada"},{"Code": "GP", "Name": "Guadeloupe"},{"Code": "GU", "Name": "Guam"},{"Code": "GT", "Name": "Guatemala"},{"Code": "GG", "Name": "Guernsey"},{"Code": "GN", "Name": "Guinea"},{"Code": "GW", "Name": "Guinea-Bissau"},{"Code": "GY", "Name": "Guyana"},{"Code": "HT", "Name": "Haiti"},{"Code": "HM", "Name": "Heard Island and McDonald Islands"},{"Code": "VA", "Name": "Holy See (Vatican City State)"},{"Code": "HN", "Name": "Honduras"},{"Code": "HK", "Name": "Hong Kong"},{"Code": "HU", "Name": "Hungary"},{"Code": "IS", "Name": "Iceland"},{"Code": "IN", "Name": "India"},{"Code": "ID", "Name": "Indonesia"},{"Code": "IR", "Name": "Iran, Islamic Republic of"},{"Code": "IQ", "Name": "Iraq"},{"Code": "IE", "Name": "Ireland"},{"Code": "IM", "Name": "Isle of Man"},{"Code": "IL", "Name": "Israel"},{"Code": "IT", "Name": "Italy"},{"Code": "JM", "Name": "Jamaica"},{"Code": "JP", "Name": "Japan"},{"Code": "JE", "Name": "Jersey"},{"Code": "JO", "Name": "Jordan"},{"Code": "KZ", "Name": "Kazakhstan"},{"Code": "KE", "Name": "Kenya"},{"Code": "KI", "Name": "Kiribati"},{"Code": "KP", "Name": "Korea, Democratic People's Republic of"},{"Code": "KR", "Name": "Korea, Republic of"},{"Code": "KW", "Name": "Kuwait"},{"Code": "KG", "Name": "Kyrgyzstan"},{"Code": "LA", "Name": "Lao People's Democratic Republic"},{"Code": "LV", "Name": "Latvia"},{"Code": "LB", "Name": "Lebanon"},{"Code": "LS", "Name": "Lesotho"},{"Code": "LR", "Name": "Liberia"},{"Code": "LY", "Name": "Libya"},{"Code": "LI", "Name": "Liechtenstein"},{"Code": "LT", "Name": "Lithuania"},{"Code": "LU", "Name": "Luxembourg"},{"Code": "MO", "Name": "Macao"},{"Code": "MK", "Name": "Macedonia, the Former Yugoslav Republic of"},{"Code": "MG", "Name": "Madagascar"},{"Code": "MW", "Name": "Malawi"},{"Code": "MY", "Name": "Malaysia"},{"Code": "MV", "Name": "Maldives"},{"Code": "ML", "Name": "Mali"},{"Code": "MT", "Name": "Malta"},{"Code": "MH", "Name": "Marshall Islands"},{"Code": "MQ", "Name": "Martinique"},{"Code": "MR", "Name": "Mauritania"},{"Code": "MU", "Name": "Mauritius"},{"Code": "YT", "Name": "Mayotte"},{"Code": "MX", "Name": "Mexico"},{"Code": "FM", "Name": "Micronesia, Federated States of"},{"Code": "MD", "Name": "Moldova, Republic of"},{"Code": "MC", "Name": "Monaco"},{"Code": "MN", "Name": "Mongolia"},{"Code": "ME", "Name": "Montenegro"},{"Code": "MS", "Name": "Montserrat"},{"Code": "MA", "Name": "Morocco"},{"Code": "MZ", "Name": "Mozambique"},{"Code": "MM", "Name": "Myanmar"},{"Code": "NA", "Name": "Namibia"},{"Code": "NR", "Name": "Nauru"},{"Code": "NP", "Name": "Nepal"},{"Code": "NL", "Name": "Netherlands"},{"Code": "NC", "Name": "New Caledonia"},{"Code": "NZ", "Name": "New Zealand"},{"Code": "NI", "Name": "Nicaragua"},{"Code": "NE", "Name": "Niger"},{"Code": "NG", "Name": "Nigeria"},{"Code": "NU", "Name": "Niue"},{"Code": "NF", "Name": "Norfolk Island"},{"Code": "MP", "Name": "Northern Mariana Islands"},{"Code": "NO", "Name": "Norway"},{"Code": "OM", "Name": "Oman"},{"Code": "PK", "Name": "Pakistan"},{"Code": "PW", "Name": "Palau"},{"Code": "PS", "Name": "Palestine, State of"},{"Code": "PA", "Name": "Panama"},{"Code": "PG", "Name": "Papua New Guinea"},{"Code": "PY", "Name": "Paraguay"},{"Code": "PE", "Name": "Peru"},{"Code": "PH", "Name": "Philippines"},{"Code": "PN", "Name": "Pitcairn"},{"Code": "PL", "Name": "Poland"},{"Code": "PT", "Name": "Portugal"},{"Code": "PR", "Name": "Puerto Rico"},{"Code": "QA", "Name": "Qatar"},{"Code": "RE", "Name": "R\u00e9union"},{"Code": "RO", "Name": "Romania"},{"Code": "RU", "Name": "Russian Federation"},{"Code": "RW", "Name": "Rwanda"},{"Code": "BL", "Name": "Saint Barth\u00e9lemy"},{"Code": "SH", "Name": "Saint Helena, Ascension and Tristan da Cunha"},{"Code": "KN", "Name": "Saint Kitts and Nevis"},{"Code": "LC", "Name": "Saint Lucia"},{"Code": "MF", "Name": "Saint Martin (French part)"},{"Code": "PM", "Name": "Saint Pierre and Miquelon"},{"Code": "VC", "Name": "Saint Vincent and the Grenadines"},{"Code": "WS", "Name": "Samoa"},{"Code": "SM", "Name": "San Marino"},{"Code": "ST", "Name": "Sao Tome and Principe"},{"Code": "SA", "Name": "Saudi Arabia"},{"Code": "SN", "Name": "Senegal"},{"Code": "RS", "Name": "Serbia"},{"Code": "SC", "Name": "Seychelles"},{"Code": "SL", "Name": "Sierra Leone"},{"Code": "SG", "Name": "Singapore"},{"Code": "SX", "Name": "Sint Maarten (Dutch part)"},{"Code": "SK", "Name": "Slovakia"},{"Code": "SI", "Name": "Slovenia"},{"Code": "SB", "Name": "Solomon Islands"},{"Code": "SO", "Name": "Somalia"},{"Code": "ZA", "Name": "South Africa"},{"Code": "GS", "Name": "South Georgia and the South Sandwich Islands"},{"Code": "SS", "Name": "South Sudan"},{"Code": "ES", "Name": "Spain"},{"Code": "LK", "Name": "Sri Lanka"},{"Code": "SD", "Name": "Sudan"},{"Code": "SR", "Name": "Suriname"},{"Code": "SJ", "Name": "Svalbard and Jan Mayen"},{"Code": "SZ", "Name": "Swaziland"},{"Code": "SE", "Name": "Sweden"},{"Code": "CH", "Name": "Switzerland"},{"Code": "SY", "Name": "Syrian Arab Republic"},{"Code": "TW", "Name": "Taiwan, Province of China"},{"Code": "TJ", "Name": "Tajikistan"},{"Code": "TZ", "Name": "Tanzania, United Republic of"},{"Code": "TH", "Name": "Thailand"},{"Code": "TL", "Name": "Timor-Leste"},{"Code": "TG", "Name": "Togo"},{"Code": "TK", "Name": "Tokelau"},{"Code": "TO", "Name": "Tonga"},{"Code": "TT", "Name": "Trinidad and Tobago"},{"Code": "TN", "Name": "Tunisia"},{"Code": "TR", "Name": "Turkey"},{"Code": "TM", "Name": "Turkmenistan"},{"Code": "TC", "Name": "Turks and Caicos Islands"},{"Code": "TV", "Name": "Tuvalu"},{"Code": "UG", "Name": "Uganda"},{"Code": "UA", "Name": "Ukraine"},{"Code": "AE", "Name": "United Arab Emirates"},{"Code": "GB", "Name": "United Kingdom"},{"Code": "US", "Name": "United States"},{"Code": "UM", "Name": "United States Minor Outlying Islands"},{"Code": "UY", "Name": "Uruguay"},{"Code": "UZ", "Name": "Uzbekistan"},{"Code": "VU", "Name": "Vanuatu"},{"Code": "VE", "Name": "Venezuela, Bolivarian Republic of"},{"Code": "VN", "Name": "Viet Nam"},{"Code": "VG", "Name": "Virgin Islands, British"},{"Code": "VI", "Name": "Virgin Islands, U.S."},{"Code": "WF", "Name": "Wallis and Futuna"},{"Code": "EH", "Name": "Western Sahara"},{"Code": "YE", "Name": "Yemen"},{"Code": "ZM", "Name": "Zambia"},{"Code": "ZW", "Name": "Zimbabwe"}]


 


var youtubeURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&order=relevance&q=metal+music&regionCode=US&type=video&key=" + ytk;
const ytUrl = "https://www.youtube.com/watch?v="

const server = new GraphQLServer({
    schema
});

const options = {
    port: 4000,
    endpoint: '/graphql',
    subscriptions: '/subscriptions',
    playground: ['/playground', '/']
};
// import { NODE_ENV } from './config';


// function authorize(credentials, requestData, callback) {
//     var clientSecret = credentials.installed.client_secret;
//     var clientId = credentials.installed.client_id;
//     var redirectUrl = credentials.installed.redirect_uris[0];
//     var auth = new googleAuth();
//     var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  
//     // Check if we have previously stored a token.
//     fs.readFile(TOKEN_PATH, function(err, token) {
//       if (err) {
//         getNewToken(oauth2Client, requestData, callback);
//       } else {
//         oauth2Client.credentials = JSON.parse(token);
//         callback(oauth2Client, requestData);
//       }
//     });
//   }

// function searchListByKeyword(requestData) {
//     var service = google.youtube('v3');
//     var parameters = removeEmptyParameters(requestData['params']);
//     // parameters['auth'] = auth;
//     service.search.list(parameters, function(err, response) {
//       if (err) {
//         console.log('The API returned an error: ' + err);
//         return;
//       }
//       console.log(response);
//     });
// }


// function genCountryDD(){
    
//     var ddCountries = "<div class='btn-group'>"
//     ddCountries = "<button type='button' class='btn btn-danger dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>"
//     ddCountries = "Action"
//     ddCountries = "</button>"
//     ddCountries = "<div class='dropdown-menu'>"
//     countries2d.forEach(element => {
//         ddCountries = "<a class='dropdown-item' href='#' value=" + element.Code + ">" + element.Name + "</a>"  
//       });

//     ddCountries = "</div></div>"
    
//     return ddCountries;
// }


app.all('/youtubeTest', async (req, res) => {   
    //var video = searchListByKeyword("black sabbath")
    var video = 'fWvKvOViM3g'
    //console.log(video)
    //player.load(video)
    
    res.render('youtubeTest.hbs', {video: video})
})


//--**-----Routes-----**--//
app.all('/random', async (req, res)=>{
    res.redirect('/')
    // var randBand = await Scraper.getRandomBand()
    // console.log(randBand);
    // res.render('RandomBand.hbs', {randBand: randBand});
})

server.start(options, ({ port }) => console.log(`Server listening on port ${port}`));

function genDiscoTable(randBandDiscography){
        //console.log("randBandDisc obj => " + randBandDiscography);

        var genDisco = "<table class='table table-responsive' align='center'><tbody class='text-light' style='width: 100%'>"
        genDisco += "<tr><th>Album</th><th>Type</th><th>Year</th>"
        for(var i = 0; i < randBandDiscography.length; i++)
        {
            genDisco += "<tr>"
            genDisco += "<td>"
            genDisco += "<a href='/DiscDetails/" + randBandDiscography[i].id + "'>" + randBandDiscography[i].name + "</a>"
            genDisco += "</td>"
            genDisco += "<td>"
            genDisco += randBandDiscography[i].type
            genDisco += "</td>"
            genDisco += "<td>"
            genDisco += randBandDiscography[i].year
            genDisco += "</td>"
            genDisco += "</tr>"        
        }
        genDisco += "</tbody></table>"
        //console.log("finishedTable: " + genDisco);
        return genDisco;
}

app.all('/', async (req, res) => {    
    var doThese = async function(){
        const randBand = await Scraper.getRandomBand()
        const randBandDiscography = await Scraper.getDiscog(randBand.id, 'all')

        //console.log("band: " + randBand + " || Disco: " + randBandDiscography)

        const disco = await genDiscoTable(randBandDiscography)
        // var ddCountries = "<div class='btn-group'>"
        // ddCountries = "<button type='button' class='btn btn-danger dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>"
        // ddCountries = "Action"
        // ddCountries = "</button>"
        // ddCountries = "<div class='dropdown-menu'>"
        // countries2d.forEach(element => {
        //     ddCountries = "<a class='dropdown-item' href='#' value=" + element.Code + ">" + element.Name + "</a>"  
        //   });
    
        // ddCountries = "</div></div>"

        res.render('RandomBand.hbs', {randBand: randBand, discography: disco})        
    }

    doThese();    
})

function genSongTable(discSongList){
    //console.log("randBandDisc obj => " + randBandDiscography);

    var genSongList = "<table class='table table-responsive' align='center'><tbody class='text-light' style='width: 100%'>"
    genSongList += "<tr><th>Album</th><th>Type</th><th>Year</th>"
    for(var i = 0; i < discSongList.length; i++)
    {
        genSongList += "<tr>"        
        genSongList += "<td>"
        genSongList += discSongList[i].number + " " + discSongList[i].title
        genSongList += "</td>"
        genSongList += "<td>"
        genSongList += discSongList[i].length
        genSongList += "</td>"
        genSongList += "<td>"
        genSongList += "<a href='/Lyrics/" + discSongList[i].lyricsId + "'>Lyrics</a>"
//        genSongList += "<a href='/DiscDetails/" + req.body.id + "/:" + discSongList[i].lyricsId + "'"
        genSongList += "</td>"
        genSongList += "</tr>"        
    }
    genSongList += "</tbody></table>"
    //console.log("finishedTable: " + genSongList);
    return genSongList;
}


// async function ytSearchForAlbum(){
//     return new Promise((resolve, reject) => {
//         https.get(youtubeURL, res => {
//             res.setEncoding("utf8");
//             let body = "";
//             res.on("data", data => {
//             body += data;
//             });
//             res.on("end", () => {
//             body = JSON.parse(body);
//             //console.log(body);
//             });
//         })

//     })
// }

async function ytSearchForAlbum(youtubeURL) {
    return new Promise((resolve, reject) => {
        axios.get(`${youtubeURL}`)
            .then(({ data }) => {
                //const videoStuff = {};
                

                // for(var vid in data){
                //     console.log("VIDL :" + vid)
                //     videoStuff.add
                // } 
                //console.log("VS -------" +videoStuff)
                // const $ = cheerio.load(data);
                // const reviews = [];

                // $('#album_tabs_reviews table#review_list tbody').children().each((i, el) => {
                //     try {
                //         const reviewUrl = $(el).children().eq(0).children()
                //             .attr('href');
                //         const id = parseInt(reviewUrl.substr(reviewUrl.lastIndexOf('/') + 1), 10);
                //         const title = $(el).children().nextAll().eq(0).text().trim();
                //         const rating = $(el).children().nextAll().eq(1).text().trim();
                //         const date = $(el).children().nextAll().eq(3).text().trim();
                //         reviews.push({
                //             id,
                //             title,
                //             rating,
                //             date
                //         });
                //     } catch (e) {}
                // });
                //console.log(videoStuff)
                resolve(data);
            }).catch(err => reject(err));
    });
}


app.all('/DiscDetails/:id', async (req, res) =>{    
    const albumId = req.params.id;    
    //console.log("AID" + albumId)
    const discDetails = await Scraper.getDisc(albumId)
    //console.log(discDetails)   
    const discSongList = await Scraper.getDiscSongs(albumId)
    //console.log(discSongList)
    const songList = genSongTable(discSongList)
    //console.log("Songlist: " + songList)
    var searchTerm = discDetails.band + " " + discDetails.name
    //console.log(searchTerm)
    //console.log(youtubeURL)
    //video stuff
    //var video = 'fWvKvOViM3g'
    //const videoDetails = await searchForAlbum()
    // searchTerm.replace(" ","+")
    // searchTerm.trim()
    
    var st = encodeURIComponent(searchTerm)    
    //console.log(st)    
    //--->> this one

    //////THIS NEEDS HEROKU CONFIG VAR
    ////YTURL2
    


    youtubeURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&order=relevance&q='" + st + "'&fields=items%2Fid%2FvideoId&key=" + process.env.ytk;

    console.log(youtubeURL)
    var videoId = ""
    try{
        
        videoId = await ytSearchForAlbum(youtubeURL)
    }
    catch (err){
        console.log("Boo..." + err.response.statusText)


    }
    console.log(videoId.items[0].id.videoId)
    
    if(typeof videoId == 'undefined'){
        try{
            youtubeURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&order=relevance&q='" + st + "'&fields=items%2Fid%2FvideoId&key=" + process.env.ytkb;
            videoId = await ytSearchForAlbum(youtubeURL)
        }
        catch(err){
            console.log("-urns... " + err.response.statusText)
        }

        if(typeof videoId == 'undefined'){

            video = "DFK1ivuS1k0"
        }
    }
    else {
        video = videoId.items[0].id.videoId
    }

    res.render('DiscDetails.hbs', {details: discDetails, songList: songList, video: video})            
})

// app.get('/Search', (req,res)=>{
//     res.render('Search.hbs');
// })

async function generateBandsTable(searchResults, start){
    console.log(searchResults)
    var genResults = "<table class='table text-light' ><tbody>"
    // genResults += "<h5>Showing " + start + " out of " + searchResults.length + "</h5>"
    genResults += "<tr><th>Band</th><th>Genre</th><th>Country</th></tr>"  
    range = start
    for(range; range < start + 100; range++){
        genResults += "<tr>"        
        genResults += "<td><a href='/Band/" + searchResults[range].id + "'> " + searchResults[range].name + "</a></td>"
        genResults += "<td>" + searchResults[range].genre + "</td>"
        genResults += "<td>" + searchResults[range].country + "</td>"        
        genResults += "</tr>"
    }
    genResults += "</table></tbody>"
    
    var end = start + 100
    if(searchResults.length > end)
    {
         //genResults += "<a href='/Results' alt='More results'>" + end +" More</a>"
    }

    return genResults
}


// async function generateBandsTable(searchResults){
//     console.log(searchResults)
//     var genResults = "<table class='table text-light' ><tbody>"
//     genResults += "<tr><th>Band</th><th>Genre</th><th>Country</th></tr>"  
    
//     for(range; range < start + 100; i++){
//         genResults += "<tr>"        
//         genResults += "<td><a href='/Band/" + searchResults[i].id + "'> " + searchResults[i].name + "</a></td>"
//         genResults += "<td>" + searchResults[i].genre + "</td>"
//         genResults += "<td>" + searchResults[i].country + "</td>"        
//         genResults += "</tr>"
//     }
//     genResults += "</table></tbody>"
//     return genResults
// }



async function genSongSearchTable(searchResults){
    var genSongResults = "<table class='table text-light' ><tbody>"  
    genSongResults += "<tr><th>Song Title</th><th>Band</th><th>Album</th></tr>"  
    for(var i = 0; i < searchResults.songs.length; i++){
        genSongResults += "<tr>"
        genSongResults += "<td><a href='/Lyrics/" + searchResults.songs[i].lyricsId + "'> " + searchResults.songs[i].title + "</a></td>"
        genSongResults += "<td>" + searchResults.songs[i].band + "</a></td>"

        genSongResults += "<td>" + searchResults.songs[i].album + "</td>"
        genSongResults += "</tr>"        
    }
    
    genSongResults += "<h5>Showing " + searchResults.currentResult + " out of " + searchResults.totalResult + "</h5>"


    genSongResults += "</tbody</table>"
    return genSongResults
}

app.all('/Lyrics/:id', async(req, res)=>{
    
    const lyricsId = req.params.id;
    const lyrics = await Scraper.getLyrics(lyricsId)
    console.log(lyrics.lyrics)
    res.render('Lyrics.hbs', {lyricsId: lyrics.id, lyrics: lyrics.lyrics})
})

app.post('/Results', async (req,res)=>{
    // var genCountryDD = genCountryDD()
    console.log(req.body)
    start = parseInt(req.body.txtStart)
    console.log("start " + req.body.txtSearch.value + " xxx " + req.body.txtSearch + " ----- " + req.body.rbSearchTerm);
    var searchResults = {}
    var searchTerm = encodeURIComponent(req.body.txtSearch)   

    //searchTerm = await Scraper.searchByBands("Black+Sabbath", "0", "10")
    var genResults = {}
    if(req.body.rbSearchTerm == "Band"){
        searchResults = await Scraper.getBands(searchTerm, "", "", "", "", "", start)         
        genResults = await generateBandsTable(searchResults, start)
        if(searchResults.length > (start + 100))
        {
            start += 100
        }
        //searchResults = await Scraper.searchByBands(searchTerm)        
    } else if (req.body.rbSearchTerm == "Genre")
    {
        searchResults = await Scraper.getBands("", searchTerm, "", "", "", "", 0) 
        genResults = await generateBandsTable(searchResults)
    } else if (req.body.rbSearchTerm == "Country")
    {
        console.log("BAM! country - ")
        searchResults = await Scraper.getBands("", "", searchTerm, "", "", "", 0) 
        console.log(searchResults)
        genResults = await generateBandsTable(searchResults)
    } else 
    {        
        searchResults = await Scraper.searchBySongs(searchTerm, "", "0", "100")
        //console.log(searchResults)
        genResults = await genSongSearchTable(searchResults)
        //searchResults = await Scraper.searchBySongs(searchTerm)
    }
    //console.log(searchResults)    
    //console.log(genResults)


//NEW adv search
    


    res.render('Results.hbs', { results: genResults, start: start});
})

app.all('/Band/:id', async (req, res) => {    
    //var doThese = async function(req){
        const bandId = req.params.id
        const randBand = await Scraper.getBand(bandId)
        
        const randBandDiscography = await Scraper.getDiscog(randBand.id, 'all')

        //console.log("band: " + randBand + " || Disco: " + randBandDiscography)

        const disco = await genDiscoTable(randBandDiscography)

        res.render('RandomBand.hbs', {randBand: randBand, discography: disco})        
    //}

    //doThese();    
})

app.get('*', (req, res)=>{
    res.render("error.hbs");
})

//hosted or local
app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
