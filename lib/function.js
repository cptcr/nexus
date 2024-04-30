const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');

module.exports = {
    textColored : (message, color) => {
        return !color ? chalk.hex('#00ff00')(message) : chalk.hex(color)(message)
    },
    
    createNecesaryFiles : async ()=>{
        try {
            const {createENV} = require("./utils");
            const existENV = fs.existsSync('.env');
            if(existENV) return false
            if(!existENV) {
                await createENV()
            }
            return true
        } catch(err){
            throw new Error(err)
        }
}
}