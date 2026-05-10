const router = require("express").Router();
const ctrl = require("../controllers/adminController");
const superAdmin = require("../middleware/superAdmin");

router.use(superAdmin);

router.get("/schools", ctrl.getAllSchools);
router.get("/stats", ctrl.getPlatformStats);
router.patch("/schools/:id", ctrl.updateSchoolPlan);

module.exports = router;