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
var fs = require('fs');
var readline = require('readline');
var {google} = require('googleapis');
//

// const result = dotenv.config()

// if (result.error) {
//   throw result.error
// }

// console.log(result.parsed)
const YTK = process.env.ytk
const YTKb = process.env.ytkb
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



 


var youtubeURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&order=relevance&q=metal+music&regionCode=US&type=video&key=" + YTK;
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
    

console.log(ytk)
    youtubeURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&order=relevance&q='" + st + "'&fields=items%2Fid%2FvideoId&key=" + YTK;

    console.log(youtubeURL)
    var videoId = ""
    try{
        
        videoId = await ytSearchForAlbum(youtubeURL)
    }
    catch (err){
        console.log("Boo..." + err.response.statusText)

        // try{
        //     youtubeURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&order=relevance&q='" + st + "'&fields=items%2Fid%2FvideoId&key=" + YTKb;
        //     videoId = await ytSearchForAlbum(youtubeURL)
        // }
        // catch(err){
        //     console.log("-urns... " + err.response.statusText)
        // }
    }
    console.log(videoId.items[0].id.videoId)
    
    if(typeof videoId == 'undefined'){
        video = "DFK1ivuS1k0"
    }
    else {
        video = videoId.items[0].id.videoId
    }



    res.render('DiscDetails.hbs', {details: discDetails, songList: songList, video: video})            
})

// app.get('/Search', (req,res)=>{
//     res.render('Search.hbs');
// })

async function generateBandsTable(searchResults){
    var genResults = "<table class='table text-light' ><tbody>"
    genResults += "<tr><th>Band</th><th>Genre</th><th>Country</th></tr>"  
    for(var i = 0; i < searchResults.length; i++){
        genResults += "<tr>"        
        genResults += "<td><a href='/Band/" + searchResults[i].id + "'> " + searchResults[i].name + "</a></td>"
        genResults += "<td>" + searchResults[i].genre + "</td>"
        genResults += "<td>" + searchResults[i].country + "</td>"        
        genResults += "</tr>"
    }
    genResults += "</table></tbody>"
    return genResults
}

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
    console.log(req.body.txtSearch + " ----- " + req.body.rbSearchTerm);
    var searchResults = {}
    var searchTerm = encodeURIComponent(req.body.txtSearch)   

    //searchTerm = await Scraper.searchByBands("Black+Sabbath", "0", "10")
    var genResults = {}
    if(req.body.rbSearchTerm == "Band"){
        searchResults = await Scraper.getBands(searchTerm, "", "", "", "", "", 0) 
        genResults = await generateBandsTable(searchResults)
        //searchResults = await Scraper.searchByBands(searchTerm)        
    } else {        
        searchResults = await Scraper.searchBySongs(searchTerm, "", "0", "100")
        //console.log(searchResults)
        genResults = await genSongSearchTable(searchResults)
        //searchResults = await Scraper.searchBySongs(searchTerm)
    }
    //console.log(searchResults)    
    //console.log(genResults)
    res.render('Results.hbs', { results: genResults});
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
