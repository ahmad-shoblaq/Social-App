import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth.middleware";
import commentService from "./comment.service";

const router = Router({mergeParams:true})
 
router.post("{/:id}",isAuthenticated(),commentService.create)
router.put("{/:id}",isAuthenticated(),commentService.update)
router.patch("{/:id}",isAuthenticated(),commentService.addReaction)
router.delete("{/:id}",isAuthenticated(),commentService.deleteComment)
router.get("{/:id}",isAuthenticated(),commentService.getSpecific)
export default router;