import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth.middleware";
import postService from "./post.service";
import { commentRouter } from "..";
const router = Router({mergeParams:true});

router.use("/:postId/comment",commentRouter);
router.get("/",isAuthenticated(),postService.getAllPosts);
router.post("/",isAuthenticated(),postService.create);
router.put("/:id",isAuthenticated(),postService.update);
router.patch("/:id",isAuthenticated(),postService.addReaction);
router.get("/:id",isAuthenticated(),postService.getSpecific);
router.delete("/:id",isAuthenticated(),postService.deletePost);
 

export default router;