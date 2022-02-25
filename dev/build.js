let fs = require('fs').promises;

(async ()=> {
        let dir = await fs.readdir(__dirname+'/modifiers');
        console.log('dir: ',__dirname)
        console.log('files: ',dir.join(','))
        let array = [];
        for (let file of dir){
            let filename = file.split('.')[0];
            let data = require(__dirname+`/modifiers/${file}`);
            let modifier = data.map((item)=>{
                if(filename !== "multiplier") {
                    item.type = filename;
                    item.multiplier = false;
                } else {
                    item.type = "hybrid";
                    item.multiplier = true;
                }
                return item
            })
            array = array.concat(modifier);
        }

        let file = await fs.writeFile('./public/modifiers.json',JSON.stringify(array),{encoding: 'utf8'});
        /*let file = require('./transition.json');
        let modifiers = file.map((item)=>{
            item.unique = false;
            return item;
        });
        let file2 = await fs.writeFile('transition.json',JSON.stringify(modifiers),{encoding: 'utf8'})
    */
    }
)()