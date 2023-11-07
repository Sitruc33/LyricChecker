const http = require('https');
const fs = require('fs');
var songID;
var lyrics;
var textFormat = 'plain';




function callFirstApi(pSongTitle) {
    return new Promise((resolve,reject) => {
        const songTitle = replaceSpaces(pSongTitle);
        console.log(songTitle);
        var title;
        const options = {
            method: 'GET',
            hostname: 'genius-song-lyrics1.p.rapidapi.com',
            port: null,
            path: `/search/?q=${songTitle}&per_page=2&page=1`,
            headers: {
                'X-RapidAPI-Key': 'c4de5f3199msh4fdb3f6628ba2f1p1fcd9fjsndd2d212ea28b',
                'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
            }
        };
        console.log('This is the path',options.path);
        const req = http.request(options, function (res) {
            const chunks = [];
        
            res.on('data', function (chunk) {
                chunks.push(chunk);
            });
        
            res.on('end', function () {
                
                const body = Buffer.concat(chunks);
                const apiResponse = JSON.parse(body);
                if (apiResponse.hits && apiResponse.hits[0] && apiResponse.hits[0].result && apiResponse.hits[0].result.id) {
                   /* for(let i = 0; i < apiResponse.hits.length; i++) {
                        title = apiResponse.hits[i].result.full_title;
                        if(title = songTitle){
                            songID = apiResponse.hits[i].result.id;
                            break;
                        }
                    } */
                    title = apiResponse.hits[0].result.full_title;
                    songID = apiResponse.hits[0].result.id;
                
                
                console.log('The title is: ', title);
                console.log('Genius songID = ', songID);
                
                resolve(songID);
                } else {
                    reject(new Error('Something went wrong with the first api call'));
                }
        
        
            });

            req.on('error', (error) => {
                reject(error);
            });

            
        });
        req.end();
        
    });

}



function callSecondApi(pSongID) {
    return new Promise((resolve,reject) => {
        const options2 = {
            method: 'GET',
            hostname: 'genius-song-lyrics1.p.rapidapi.com',
            port: null,
            path: `/song/lyrics/?id=${pSongID}`,
            headers: {
                'X-RapidAPI-Key': 'c4de5f3199msh4fdb3f6628ba2f1p1fcd9fjsndd2d212ea28b',
                'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
            }
        };
        console.log(options2.path);
        const req2 = http.request(options2, function (res) {
            const chunks = [];
        
            res.on('data', function (chunk) {
                chunks.push(chunk);
            });
        
            res.on('end', function () {
                const body = Buffer.concat(chunks);
                const apiResponse2 = JSON.parse(body);

                if (apiResponse2.lyrics && apiResponse2.lyrics.lyrics && apiResponse2.lyrics.lyrics.body) {
                lyrics = apiResponse2.lyrics.lyrics.body.html;
                console.log(' /t Here are the lyrics:  /n ', lyrics);
                fs.writeFileSync('./views/partials/lyrics.html', lyrics, () => {
                    console.log('file written');
                } );
                resolve();
                } else{
                    reject( new Error('Something went wrong with the second api call'));
                }
            
            });

            req2.on('error', (error) => {
                reject(error); 
            })

            
        });
        req2.end();  
        

    });

}

function replaceSpaces(inputString) {
    // Use a regular expression to match all spaces globally and replace them with '%'
    const result = inputString.replace(/ /g, '%20');
    return result;
  }

function runApiCall(pSongTitle) {
callFirstApi(pSongTitle)
  .then((songID) => callSecondApi(songID))
  .catch((error) => {
    console.error(error.message);
  });
}

//runApiCall('All Too Well');


module.exports = { runApiCall };
 




