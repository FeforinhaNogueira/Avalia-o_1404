const db = require('../conexao/db');

const produtos = {

    // Função para buscar todos os produtos (com callback)
    getAllProds: (callback) => {
        const sql = 'SELECT * FROM produtos';
        db.query(sql, (err, results) => {
            if (err) throw err;
            callback(results);
        });
    },

    // Função para buscar todos os produtos (com Promise)
    getAllProdstoPDF: () => {
        const sql = 'SELECT * FROM produtos';
        return new Promise((resolve, reject) => {
            db.query(sql, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },

};

module.exports = produtos; 
