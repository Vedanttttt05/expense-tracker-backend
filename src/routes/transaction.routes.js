import {Router} from 'express';

import {
    createTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction,
} from '../controllers/transaction.controller.js';

import {verifyJwt} from '../middlewares/auth.middleware.js';

const router = Router();

router.post("/" , verifyJwt , createTransaction);
router.get("/" , verifyJwt , getTransactions);
router.put("/:id" , verifyJwt , updateTransaction);
router.delete("/:id" , verifyJwt , deleteTransaction);

export default router;