import z from "zod";

export const postValidation = z.object({
    content: z.string().min(1,"Content is required").max(500,"Content must be less than 500 characters"),
    attachments: z.array(z.object({
        url: z.string().url("Invalid URL format"),
        id: z.string().min(1,"Attachment ID is required")
    })).optional(),
    id: z.string().length(24,"Invalid Post ID")
});

export const getPostValidation = z.object({
    id: z.string().length(24,"Invalid Post ID")
});
