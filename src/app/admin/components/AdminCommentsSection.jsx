"use client";

import { useState } from "react";
import { Trash2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addAdminCommentAction, deleteAdminCommentAction } from "@/app/actions/admin/vendors";
import { toast } from "sonner";

export default function AdminCommentsSection({ vendorId, comments = [], onUpdate }) {
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddComment = async () => {
        if (!newComment.trim()) {
            toast.error("Please enter a comment");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await addAdminCommentAction(vendorId, newComment.trim());
            if (result.success) {
                toast.success("Comment added successfully");
                setNewComment("");
                if (onUpdate) onUpdate(result.data);
            } else {
                toast.error(result.message || "Failed to add comment");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!confirm("Are you sure you want to delete this comment?")) return;

        try {
            const result = await deleteAdminCommentAction(vendorId, commentId);
            if (result.success) {
                toast.success("Comment deleted successfully");
                if (onUpdate) onUpdate(result.data);
            } else {
                toast.error(result.message || "Failed to delete comment");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    return (
        <Card className="w-full rounded-none p-4 gap-2">
            <CardHeader className="p-0">
                <CardTitle className="flex items-center gap-2 !text-base">
                    <MessageCircle className="w-5 h-5" />
                    Admin Comments ({comments.length})
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-0">
                {/* Add Comment Form */}
                <div className="space-y-2">
                    <Textarea
                        placeholder="Add a comment for internal reference..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="min-h-[100px]"
                        disabled={isSubmitting}
                    />
                    <div className="flex justify-end">
                        <Button
                            onClick={handleAddComment}
                            disabled={isSubmitting || !newComment.trim()}
                            size="sm"
                        >
                            {isSubmitting ? "Adding..." : "Add Comment"}
                        </Button>
                    </div>
                </div>

                {/* Comments List */}
                {comments.length === 0 ? (
                    <p className="!text-xs text-gray-500 text-center py-5">
                        No comments yet. Add one to keep track of important information.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {comments.map((comment) => (
                            <div
                                key={comment._id}
                                className="bg-gray-50 p-2 rounded-lg border border-gray-200 space-y-2"
                            >
                                <div className="flex justify-between items-start">
                                    <p className="!text-sm text-gray-800 whitespace-pre-wrap flex-1">
                                        {comment.message}
                                    </p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
                                        onClick={() => handleDeleteComment(comment._id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                                <p className="!text-xs text-gray-500">
                                    {new Date(comment.createdAt).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
