// Import the express javascript library



var express = require('express');
var cors = require('cors');
var app = express();

app.use(cors());

const check = require('./checker');

const manual = require('./monster-manual');

const book = require('./spellbook');

const scores = require('./scores');

//returns modifier for a stat
const statMod = function(stat){
  let data = scores;
  data = data.filter((item) => {
    return propEquals(item, "stat", stat);
  });
  let mod = data[0].modifier;
  return mod;
};

const bonus = function(stat){
 
  if(stat == '0'){
    
    return '';
    
  }
  else{
    
    return stat;
    
  }
  
};

const atk = function(test){
  var name = '';
  for(var i = 0; i< 4; i++){
    name = name.concat('<h4>'+test[i].name+'</h4>');
  }
  return name;
};

const formatspecial = function(obj){
  
  var name = '';
  
  for(var i = 0; i <obj.length; i++){
     
    name = name.concat('<h4>'+obj[i].name+'</h4>');
    name = name.concat('<p>'+obj[i].desc+'</p>');
    name = name.concat('<p>'+bonus(obj[i].attack_bonus)+'<p/>');
      
  }
  return name;
};

const formataction = function(obj){
  
  var name = '';
  
  for(var i = 0; i <obj.length; i++){

    name = name.concat('<h4>'+obj[i].name+'</h4>');
    name = name.concat('<p>'+obj[i].desc+'</p>');
    
  }
  return name;
};


const formatToHTML = function(dataArr) {
  // If dataArr is undefined or null, make an empty array
  if (!dataArr) {
    dataArr = [];
  }
  dataArr = dataArr.map(item => {
    // Create the HTML here
    let html = '<tr>';
    
    html += (item.name) ? ' <stat-block> <creature-heading> <h1>'+item.name+'</h1> <h2>'+item.size+' '+item.type+', '+item.alignment+'</h2> </creature-heading> <top-stats> <property-line> <h4>Armor Class</h4> <p>'+item.armor_class+' </p> </property-line> <property-line> <h4>Hit Points</h4> <p>'+item.hit_points+' ('+item.hit_dice+')</p> </property-line> <property-line> <h4>Speed</h4> <p>'+item.speed+'</p> </property-line> <table style="width:40%"> <tr> <th>STR</th> <th>DEX</th> <th>CON</th> <th>INT</th> <th>WIS</th> <th>CHA</th> </tr> <tr> <td>'+item.strength+'('+statMod(item.strength)+')</td> <td>'+item.dexterity+'('+statMod(item.dexterity)+')</td> <td>'+item.constitution+'('+statMod(item.constitution)+')</td> <td>'+item.intelligence+'('+statMod(item.intelligence)+')</td> <td>'+item.wisdom+'('+statMod(item.wisdom)+')</td> <td>'+item.charisma+'('+statMod(item.charisma)+')</td> </tr> </table> <property-line> <h4>Saving Throws</h4> <p> '+check.str(item.strength_save)+'  '+check.dex(item.dexterity_save)+' '+check.con(item.constitution_save)+' '+check.int(item.intelligence_save)+' '+check.wis(item.wisdom_save)+' '+check.cha(item.charisma_save)+'  </p> </property-line> <property-line> <h4>Damage Immunities</h4> <p>'+item.damage_immunities+'</p> </property-line> <property-line> <h4>Condition Immunities</h4> <p>'+item.condition_immunities+'</p> </property-line> <property-line> <h4>Senses</h4> <p>'+item.senses+'</p> </property-line> <property-line> <h4>Languages</h4> <p>'+item.languages+'</p> </property-line> <property-line> <h4>Challenge</h4> <p>'+item.challenge_rating+'</p> </property-line> </top-stats>  </stat-block> ': '';
    html += (item.special_abilities) ? '<property-block> <h4>Special Abilities:</h4>'+formatspecial(item.special_abilities)+' </property-block> ': '';
    html += (item.actions) ? ' <h3>Actions</h3> <property-block> '+formataction(item.actions)+'  </property-block>' : '';
    html += '</tr>';
    return html;
  });
  // Now join all the elements together inside the 
  // <table><tbody> elements.
  return '<table><tbody>'+
    dataArr.join('')+'</tbody></table>';
}


//decapitalizes given string
const fixString = function(string){
  let newString = string.toLowerCase();
  return newString;
};


//capitalizes given string
const fixName = function(string){
  let newName = string.toLowerCase();
  newName = newName.charAt(0).toUpperCase() +
    newName.substr(1);
  return newName;
};


//checks if given property is equal to value
const propEquals = function(obj, prop, val){
  if (obj[prop] !== undefined && obj[prop] + '' === val + '') {
    return true;
  }
}


//checks if given property is greater than value
const propGreater = function(obj, prop, val){
  if (obj[prop] !== undefined && obj[prop] + '' > val + '') {
    return true;
  }
};


//checks if given property is lower than value
const propLower = function(obj, prop, val){
  if (obj[prop] !== undefined && obj[prop] + '' < val + '') {
    return true;
  }
};


//checks if given property is between val1 and val2
const propBetween = function(obj, prop, val1, val2){
  if (obj[prop] !== undefined && val2 > obj[prop] && obj[prop] > val1 ) {
    return true;
  }
};


//checks if given property includes value
const propIncludes = function(obj, prop, val){
  if (obj[prop] !== undefined && fixString(obj[prop]).includes(val)) {
    return true;
  }
};



// Set the port number to be compatible with Cloud 9
const PORT = 8080;


//Home
app.get('/', cors(), function (req, res) {
  res.json('Hello world -- My server is working!!!');
  console.log((new Date()).toString()+' Message served to the client');
});


//Test
app.get('/monster/test', function(req, res) {
  let data = manual;
   
   res.send(formatToHTML(data));
});


//Name
app.get('/monster/name/:name', cors(), function(req, res) {
  let data = manual;
  if (!data) data = null;
  data = data.filter((item, idx) => {
    console.log(idx);
    return propIncludes(item, 'name', fixString(req.params.name));
  });
   res.send(data);
  console.log((new Date()).toString()+' Message served to the client');
});


//cr
app.get('/monster/cr/:rating', function(req, res) {
  let data = manual;
  if (!data) data = null;
  data = data.filter((item, idx) => {
    console.log(idx);
    item.challenge_rating = eval(item.challenge_rating);
    return propEquals(item, 'challenge_rating', req.params.rating);
  });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


//cr greater than
app.get('/monster/cr/greater_than/:low_rating', function(req, res) {
  let data = manual;
  if (!data) data = null;
  data = data.filter((item, idx) => {
    console.log(idx);
    item.challenge_rating = eval(item.challenge_rating);
    return propGreater(item, 'challenge_rating', req.params.low_rating);
    });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


//cr less than
app.get('/monster/cr/less_than/:high_rating', function(req, res) {
  let data = manual;
  if (!data) data = null;
  data = data.filter((item, idx) => {
    console.log(idx);
    item.challenge_rating = eval(item.challenge_rating);
    return propLower(item, 'challenge_rating', req.params.high_rating);
    });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


//cr range
app.get('/monster/cr/range/:low_rating/to/:high_rating', function(req, res) {
    let data = manual;
    if (!data) data = null;
    data = data.filter((item, idx) => {
      console.log(idx);
      item.challenge_rating = eval(item.challenge_rating);
      return propBetween(item, 'challenge_rating', req.params.low_rating, req.params.high_rating);
    });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


//ac
app.get('/monster/ac/:rating', function(req, res) {
  let data = manual;
  if (!data) data = null;
  data = data.filter((item, idx) => {
    console.log(idx);
    return propEquals(item, 'armor_class', req.params.rating);
  });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


//ac greater than
app.get('/monster/ac/greater_than/:low_rating', function(req, res) {
  let data = manual;
  if (!data) data = null;
  data = data.filter((item, idx) => {
    console.log(idx);
    return propGreater(item, 'armor_class', req.params.low_rating);
    });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


//ac less than
app.get('/monster/ac/less_than/:high_rating', function(req, res) {
  let data = manual;
  if (!data) data = null;
  data = data.filter((item, idx) => {
    console.log(idx);
    return propLower(item, 'armor_class', req.params.high_rating);
    });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


//ac range
app.get('/monster/ac/range/:low_rating/to/:high_rating', function(req, res) {
    let data = manual;
    if (!data) data = null;
    data = data.filter((item, idx) => {
      console.log(idx);
      return propBetween(item, 'armor_class', req.params.low_rating, req.params.high_rating);
    });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


//hp
app.get('/monster/hp/:rating', function(req, res) {
  let data = manual;
  if (!data) data = null;
  data = data.filter((item, idx) => {
    console.log(idx);
    return propEquals(item, 'hit_points', req.params.rating);
  });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


//hp greater than
app.get('/monster/hp/greater_than/:low_rating', function(req, res) {
  let data = manual;
  if (!data) data = null;
  data = data.filter((item, idx) => {
    console.log(idx);
    return propGreater(item, 'hit_points', req.params.low_rating);
    });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


//hp less than
app.get('/monster/hp/less_than/:high_rating', function(req, res) {
  let data = manual;
  if (!data) data = null;
  data = data.filter((item, idx) => {
    console.log(idx);
    return propLower(item, 'hit_points', req.params.high_rating);
    });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


//hp range
app.get('/monster/hp/range/:low_rating/to/:high_rating', function(req, res) {
    let data = manual;
    if (!data) data = null;
    data = data.filter((item, idx) => {
      console.log(idx);
      return propBetween(item, 'hit_points', req.params.low_rating, req.params.high_rating);
    });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


//stat mod
app.get('/monster/score/:scorey', function(req, res) {
  let data = scores;
  res.json(statMod(req.params.scorey));
  console.log((new Date()).toString()+' Message served to the client');
});


//strength
app.get('/monster/stat/strength/:score', function(req, res) {
  let data = manual;
  if (!data) data = null;
  data = data.filter((item, idx) => {
    console.log(idx);
    return propEquals(item, 'strength', req.params.score);
  });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


//returns monsters with str stat higher than given val
app.get('/monster/stat/strength/greater_than/:low_rating', function(req, res) {
  let data = manual;
  if (!data) data = null;
  data = data.filter((item, idx) => {
    console.log(idx);
    return propGreater(item, 'strength', req.params.low_rating);
    });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


//returns monsters with str stat lower than given val
app.get('/monster/stat/strength/less_than/:low_rating', function(req, res) {
  let data = manual;
  if (!data) data = null;
  data = data.filter((item, idx) => {
    console.log(idx);
    return propLower(item, 'strength', req.params.low_rating);
    });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


//returns with str stat between two given values
app.get('/monster/stat/strength/range/:low_score/to/:high_score', function(req, res) {
    let data = manual;
    if (!data) data = null;
    data = data.filter((item, idx) => {
      console.log(idx);
      return propBetween(item, 'strength', req.params.low_score, req.params.high_score);
    });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


//dexterity
app.get('/monster/stat/dexterity/:score', function(req, res) {
  let data = manual;
  if (!data) data = null;
  data = data.filter((item, idx) => {
    console.log(idx);
    return propEquals(item, 'dexterity', req.params.score);
  });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


//returns monsters with dex stat higher than given val
app.get('/monster/stat/dexterity/greater_than/:low_rating', function(req, res) {
  let data = manual;
  if (!data) data = null;
  data = data.filter((item, idx) => {
    console.log(idx);
    return propGreater(item, 'dexterity', req.params.low_rating);
    });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


//returns monsters with dex stat lower than given val
app.get('/monster/stat/dexterity/less_than/:low_rating', function(req, res) {
  let data = manual;
  if (!data) data = null;
  data = data.filter((item, idx) => {
    console.log(idx);
    return propLower(item, 'dexterity', req.params.low_rating);
    });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


//returns with dex stat between two given values
app.get('/monster/stat/dexterity/range/:low_score/to/:high_score', function(req, res) {
    let data = manual;
    if (!data) data = null;
    data = data.filter((item, idx) => {
      console.log(idx);
      return propBetween(item, 'dexterity', req.params.low_score, req.params.high_score);
    });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


//constitution
app.get('/monster/stat/constitution/:score', function(req, res) {
  let data = manual;
  if (!data) data = null;
  data = data.filter((item, idx) => {
    console.log(idx);
    return propEquals(item, 'constitution', req.params.score);
  });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


//returns monsters with con stat higher than given val
app.get('/monster/stat/constitution/greater_than/:low_rating', function(req, res) {
  let data = manual;
  if (!data) data = null;
  data = data.filter((item, idx) => {
    console.log(idx);
    return propGreater(item, 'constitution', req.params.low_rating);
    });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


//returns monsters with con stat lower than given val
app.get('/monster/stat/constitution/less_than/:low_rating', function(req, res) {
  let data = manual;
  if (!data) data = null;
  data = data.filter((item, idx) => {
    console.log(idx);
    return propLower(item, 'constitution', req.params.low_rating);
    });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


//returns with con stat between two given values
app.get('/monster/stat/constitution/range/:low_score/to/:high_score', function(req, res) {
    let data = manual;
    if (!data) data = null;
    data = data.filter((item, idx) => {
      console.log(idx);
      return propBetween(item, 'constitution', req.params.low_score, req.params.high_score);
    });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


//intelligence
app.get('/monster/stat/intelligence/:score', function(req, res) {
  let data = manual;
  if (!data) data = null;
  data = data.filter((item, idx) => {
    console.log(idx);
    return propEquals(item, 'intelligence', req.params.score);
  });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


//returns monsters with int stat higher than given val
app.get('/monster/stat/intelligence/greater_than/:low_rating', function(req, res) {
  let data = manual;
  if (!data) data = null;
  data = data.filter((item, idx) => {
    console.log(idx);
    return propGreater(item, 'intelligence', req.params.low_rating);
    });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


//returns monsters with int stat lower than given val
app.get('/monster/stat/intelligence/less_than/:low_rating', function(req, res) {
  let data = manual;
  if (!data) data = null;
  data = data.filter((item, idx) => {
    console.log(idx);
    return propLower(item, 'intelligence', req.params.low_rating);
    });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


//returns with int stat between two given values
app.get('/monster/stat/intelligence/range/:low_score/to/:high_score', function(req, res) {
    let data = manual;
    if (!data) data = null;
    data = data.filter((item, idx) => {
      console.log(idx);
      return propBetween(item, 'intelligence', req.params.low_score, req.params.high_score);
    });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


//wisdom
app.get('/monster/stat/wisdom/:score', function(req, res) {
  let data = manual;
  if (!data) data = null;
  data = data.filter((item, idx) => {
    console.log(idx);
    return propEquals(item, 'wisdom', req.params.score);
  });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


//returns monsters with wis stat higher than given val
app.get('/monster/stat/wisdom/greater_than/:low_rating', function(req, res) {
  let data = manual;
  if (!data) data = null;
  data = data.filter((item, idx) => {
    console.log(idx);
    return propGreater(item, 'wisdom', req.params.low_rating);
    });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


//returns monsters with wis stat lower than given val
app.get('/monster/stat/wisdom/less_than/:low_rating', function(req, res) {
  let data = manual;
  if (!data) data = null;
  data = data.filter((item, idx) => {
    console.log(idx);
    return propLower(item, 'wisdom', req.params.low_rating);
    });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


//returns with wis stat between two given values
app.get('/monster/stat/wisdom/range/:low_score/to/:high_score', function(req, res) {
    let data = manual;
    if (!data) data = null;
    data = data.filter((item, idx) => {
      console.log(idx);
      return propBetween(item, 'wisdom', req.params.low_score, req.params.high_score);
    });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


//charisma
app.get('/monster/stat/charisma/:score', function(req, res) {
  let data = manual;
  if (!data) data = null;
  data = data.filter((item, idx) => {
    console.log(idx);
    return propEquals(item, 'charisma', req.params.score);
  });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


//returns monsters with chr stat higher than given val
app.get('/monster/stat/charisma/greater_than/:low_rating', function(req, res) {
  let data = manual;
  if (!data) data = null;
 data = data.filter((item, idx) => {
    console.log(idx);
    return propGreater(item, 'charisma', req.params.low_rating);
    });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


//returns monsters with chr stat lower than given val
app.get('/monster/stat/charisma/less_than/:low_rating', function(req, res) {
  let data = manual;
  if (!data) data = null;
  data = data.filter((item, idx) => {
    console.log(idx);
    return propLower(item, 'charisma', req.params.low_rating);
    });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


//returns with chr stat between two given values
app.get('/monster/stat/charisma/range/:low_score/to/:high_score', function(req, res) {
    let data = manual;
    if (!data) data = null;
    data = data.filter((item, idx) => {
      console.log(idx);
      return propBetween(item, 'charisma', req.params.low_score, req.params.high_score);
    });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


app.get('/spell/name/:name', function(req, res) {
  let data=book;
  if(!data) data=null;
  data = data.filter((item, idx) => {
    console.log(idx);
    return propIncludes(item, 'name', fixString(req.params.name));
  });
  res.send(data);
  console.log((new Date()).toString()+' Message served to the client');
});


app.get('/spell/class/:class', function(req, res) {
  let data=book;
  if(!data) data=null;
  data = data.filter((item, idx) => {
    console.log(idx);
    return propIncludes(item, 'class', fixString(req.params.class));
  });
  res.send(data);
  console.log((new Date()).toString()+' Message served to the client');
});


app.get('/spell/school/:school', function(req, res) {
  let data=book;
  if(!data) data=null;
  data = data.filter((item, idx) => {
    console.log(idx);
    return propIncludes(item, 'school', fixString(req.params.school));
  });
  res.send(data);
  console.log((new Date()).toString()+' Message served to the client');
});


app.get('/spell/level/:level', function(req, res) {
  let data = book;
  if (!data) data = null;
  data = data.filter((item, idx) => {
    console.log(idx);
    return propEquals(item, 'level', req.params.level);
  });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


app.get('/spell/level/greater_than/:low_rating', function(req, res) {
  let data = book;
  if (!data) data = null;
  data = data.filter((item, idx) => {
    console.log(idx);
    return propGreater(item, 'level', req.params.low_rating);
    });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


app.get('/spell/level/lower_than/:high_rating', function(req, res) {
  let data = book;
  if (!data) data = null;
  data = data.filter((item, idx) => {
    console.log(idx);
    return propLower(item, 'level', req.params.low_rating);
    });
  res.json(data);
  console.log((new Date()).toString()+' Message served to the client');
});


// Set up the server to 'listen' to requests on port 8080
// Requests to virtual machines running on Cloud 9 will use
// port 8080 by default.  You can force a URL request to a
// specific port by adding :nnnn to the end of the URL
app.listen(PORT, function () {
  // This function executes when a request is heard from the client
  console.log('Example app listening on port ' + PORT + '!');
});
