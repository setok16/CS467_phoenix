var mysql = require('../dbcon.js');
var pool = mysql.pool;


function deleteAward(input) {
    return new Promise((resolve, reject) => {

        // case 1: input is a positive, finite integer
        if (typeof(input)==='number' && isFinite(input) && (input%1)===0 && input>0 ) {
            pool.query("CALL deleteAwardByAwardID(?)", [input], function(err, result, fields) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        }

        // case 2: input is either 'week' or 'month'

        // case 3: invalid input
        else{
            reject("deleteAward(): Invalid input: " + input);
        }
        
    });
}


module.exports.deleteAward = deleteAward;