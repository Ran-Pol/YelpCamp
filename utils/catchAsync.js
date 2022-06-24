const { append } = require("express/lib/response");

module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}





// app.get('/product/:id', async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const product = await Product.findById(id)
//         if (!product) {
//             throw new AppError('Product Not Found', 404)
//         }
//         res.render('products/show', { product })
//     } catch (e) {
//         next(e);
//     }
// })


// function catchAsync(fn) {
//     return function (req, res, next) {
//         f(req, res, next).catch(e => next(e))
//     }
// }

// app.get('/product/:id', catchAsync(async (req, res, next) => {
//     const { id } = req.params;
//     const product = await Product.findById(id)
//     if (!product) {
//         throw new AppError('Product Not Found', 404)
//     }
//     res.render('products/show', { product })

// }))