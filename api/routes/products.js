const express = require('express');
const router = express.Router();
const Product = require('../models/product');
//specifies a folder stores incoming files
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products')

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

//cb: Callback
//reject or accept incoming file
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
    //    This will store the file
  } else {
    cb(null, false);
  }
};

//set some limit. not accept files that bigger than this size!
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

router.get('/', ProductsController.products_get_all);
//single: get one file only ,tried to parse
router.post('/', checkAuth, upload.single("productImage"), ProductsController.products_create_product);
router.get('/:productId', ProductsController.products_get_product);
router.patch('/:productId', checkAuth, ProductsController.products_update_product);
router.delete('/:productId', checkAuth, ProductsController.products_delete_product);

module.exports = router;
