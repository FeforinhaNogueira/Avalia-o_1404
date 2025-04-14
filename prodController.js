const produtos = require('../models/relprodModel');
const PdfPrinter = require('pdfmake');


exports.getAllProds= (req, res) => {
   produtos.getAllProds((produtos) => {  
        if (!Array.isArray(produtos)) {
            console.error('Erro: O retorno de getAllUsers não é um array.');
            return res.status(500).send('Erro ao buscar produtos.');
        }
        res.render('relprodutos', { produtos }); 
    });
};

// Função para gerar o PDF
async function gerarPDF(produtos) {  
    const fonts = {
        Roboto: {
            normal: 'node_modules/pdfmake/fonts/Roboto-Regular.ttf',
            bold: 'node_modules/pdfmake/fonts/Roboto-Bold.ttf',
            italics: 'node_modules/pdfmake/fonts/Roboto-Italic.ttf',
            bolditalics: 'node_modules/pdfmake/fonts/Roboto-BoldItalic.ttf',
        },
    };

    const printer = new PdfPrinter(fonts);

    const docDefinition = {
        content: [
            { text: 'Relatório de Produtos', style: 'header' },
            {
                table: {
                    headerRows: 1,
                    widths: ['auto', '*', '*', '*', '*', '*', '*', '*'],
                    body: [
                        ['ID', 'Nome', 'Descrição', 'Fornecedor', 'Marca', 'Preço de Compra', 'Preço de Venda', 'Estoque'],
                        ...produtos.map(produto => [produto.id, produto.nome, produto.descricao, produto.fornecedor, produto.marca, produto.precocompra, produto.precovenda, produto.estoque]), // Alterei de 'user' para 'produto'
                    ],
                },
            },
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10],
            },
        },
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const chunks = [];

    return new Promise((resolve, reject) => {
        pdfDoc.on('data', chunk => chunks.push(chunk));
        pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
        pdfDoc.on('error', reject);
        pdfDoc.end();
    });
};

// Gerar relatório em PDF
exports.generatePDF = async (req, res) => {
    try {
        const prod = await produtos.getAllProdstoPDF();  
        const pdfBuffer = await gerarPDF(prod);  

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=relatorio.pdf');
        res.send(pdfBuffer);
    } catch (err) {
        console.error('Erro ao gerar o PDF:', err);
        res.status(500).send('Erro ao gerar o PDF.');
    }
};
