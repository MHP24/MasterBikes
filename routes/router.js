const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const productController = require('../controllers/productController.js');
const shoppingCartController = require('../controllers/shoppingCartController.js');
const profileController = require('../controllers/profileController.js');
const requestController = require('../controllers/requestController.js');
const adminRequestController = require('../controllers/adminRequestController.js');
const adminDeliveryController = require('../controllers/adminDeliveryController.js');
const adminProductController = require('../controllers/adminProductController.js');
const adminStockController = require('../controllers/adminStockController.js');
const adminSummaryController = require('../controllers/adminSummaryController.js');
const adminUsersController = require('../controllers/adminUsersController.js');
const adminController = require('../controllers/adminController.js');

// Router Views
router.get('/', (req, res) => {
    res.render('index', {alert:false});
});

router.get('/login', (req, res) => {
    res.render('login', {alert:false});
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/servicios', (req, res) => {
    res.render('services');
});

router.get('/nosotros', (req, res) => {
    res.render('about');
});

router.get('/contacto', (req, res) => {
    res.render('contact');
});

router.get('/add/:productSku', authController.isAuthenticated, (req, res) => {
    const { id } = req.user;
    const { productSku } = req.params;
    shoppingCartController.addToCart(productSku, id);    
    res.redirect(`/catalogo/${productSku}`);
});

router.get('/success/:billId', authController.isAuthenticated, (req, res) => {
    res.render('success', {id: req.params.billId});
});


/*** Admin routes ***/

/* Home */
router.get('/admin/inicio', authController.isAuthenticated, authController.isAdmin, adminController.loadHome);


/* Requests */
router.get('/admin/solicitudes', authController.isAuthenticated, authController.isAdmin, adminRequestController.getRepairs);

/* Requests Repairs */
router.get('/admin/reparaciones/:repairId', authController.isAuthenticated, authController.isAdmin, adminRequestController.editRepair);
router.post('/admin/update-repair/:repairId', authController.isAuthenticated, authController.isAdmin, adminRequestController.updateRepair);
router.get('/admin/reparaciones/delete/:repairId', authController.isAuthenticated, authController.isAdmin, adminRequestController.deleteRepair);

/* Requests Maintenances */
router.get('/admin/mantenciones/:repairId', authController.isAuthenticated, authController.isAdmin, adminRequestController.editMaintenance);
router.post('/admin/update-maintenance/:repairId', authController.isAuthenticated, authController.isAdmin, adminRequestController.updateRepair);
router.get('/admin/mantenciones/delete/:repairId', authController.isAuthenticated, authController.isAdmin, adminRequestController.deleteRepair);

/* Requests Rents */
router.get('/admin/arriendos/:rentId', authController.isAuthenticated, authController.isAdmin, adminRequestController.editRent);
router.post('/update-rent/:rentId', authController.isAuthenticated, authController.isAdmin, adminRequestController.updateRent);
router.get('/admin/arriendos/delete/:rentId', authController.isAuthenticated, authController.isAdmin, adminRequestController.deleteRent);
router.get('/admin/horarios', authController.isAuthenticated, authController.isAdmin, adminRequestController.loadSchedule);
router.post('/admin/create_schedule', authController.isAuthenticated, authController.isAdmin, adminRequestController.addSchedule);
router.post('/admin/update_schedule/:schedule_id', authController.isAuthenticated, authController.isAdmin, adminRequestController.updateSchedule);

/* Delivery */
router.get('/admin/pedidos', authController.isAuthenticated, authController.isAdmin, adminDeliveryController.getBills);
router.get('/admin/pedidos/:id', authController.isAuthenticated, authController.isAdmin, adminDeliveryController.billDetails);
router.post('/admin/update-bill/:billId', authController.isAuthenticated, authController.isAdmin, adminDeliveryController.updateBill);
router.get('/admin/pedidos/delete/:billId', authController.isAuthenticated, authController.isAdmin, adminDeliveryController.deleteBill);

/* Product Handler */
router.get('/admin/productos', authController.isAuthenticated, authController.isAdmin, adminProductController.getProducts);
router.get('/admin/productos/:productId', authController.isAuthenticated, authController.isAdmin, adminProductController.editProduct);
router.post('/update-product/:productId', authController.isAuthenticated, authController.isAdmin, adminProductController.updateProduct);
router.get('/admin/products/agregar', authController.isAuthenticated, authController.isAdmin, (req, res) => {res.render('admin-add-product', {userData: req.user})});
router.post('/admin/add-product', authController.isAuthenticated, authController.isAdmin, adminProductController.addProduct)
router.get('/admin/delete-product/:productId', authController.isAuthenticated, authController.isAdmin, adminProductController.deleteProduct);

/* Stock Handler */
router.get('/admin/stock', authController.isAuthenticated, authController.isAdmin, adminStockController.loadStock);
router.post('/admin/update-stock/:productId', authController.isAuthenticated, authController.isAdmin, adminStockController.updateStock);  

/* Summary Generator */ 
router.get('/admin/generar_informe', authController.isAuthenticated, authController.isAdmin, adminSummaryController.generateSummary);
router.post('/admin/gen_custom_summary', authController.isAuthenticated, authController.isAdmin, adminSummaryController.generateCustomSummary)
router.get('/admin/gen_custom_summary/:mm/:yy', authController.isAuthenticated, authController.isAdmin, adminSummaryController.generateSummaryByMY)
router.get('/admin/gen_custom_summary/:dd/:mm/:yy', authController.isAuthenticated, authController.isAdmin, adminSummaryController.generateSummaryByDMY)

/* Users */
router.get('/admin/usuarios', authController.isAuthenticated, authController.isAdmin, adminUsersController.loadUsers)


/*** Client routes ***/ 
/* Auth */
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

/*Shop*/
router.get('/catalogo', productController.loadProducts);
router.get('/catalogo/:productSku', productController.loadProduct);
router.post('/search', productController.searchProduct);
router.get('/categorias/:category', productController.searchByCategory);
router.get('/categorias/catalogo/:productSku', productController.loadProduct);
/* Shopping Cart */
router.get('/carrito', authController.isAuthenticated, shoppingCartController.getCart);
router.get('/remove/:productId', authController.isAuthenticated, shoppingCartController.remove);
router.get('/payment', authController.isAuthenticated, shoppingCartController.pay);
/* Profile */
router.get('/perfil', authController.isAuthenticated, profileController.profile);
router.get('/detalles/:id', authController.isAuthenticated, profileController.billDetails);
/* Contact */
router.post('/send', authController.isAuthenticated, requestController.contact)
/* Services */
router.get('/servicios/reparaciones', authController.isAuthenticated, requestController.loadRepairSchedule);
router.get('/servicios/mantenciones', authController.isAuthenticated, requestController.loadMaintenanceSchedule);
router.get('/servicios/arrendar', (req, res) => {res.render('rent-form', {alert:false});});
router.post('/repair', authController.isAuthenticated, requestController.addRepair);
router.post('/maintenance', authController.isAuthenticated, requestController.addMaintenance);
router.post('/rent', authController.isAuthenticated, requestController.rent);

module.exports = router;