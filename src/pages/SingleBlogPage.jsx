import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import moment from "moment";
import {
  ChevronRight,
  Calendar,
  Eye,
  ArrowRight,
  Twitter,
  Facebook,
  Linkedin,
  ThumbsUp,
  MoreVertical,
  Bookmark,
  Share2,
  MessageSquare,
  X,
  Clock,
  User,
  Tag,
  ChevronLeft,
  Heart,
  BookOpen,
  Star,
  TrendingUp,
  ArrowUp,
  Reply,
  Edit3,
  Trash2,
  MoreHorizontal,
  Send,
  Check,
} from "lucide-react";

import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Alert, AlertDescription } from "../components/tools/Alert";
import { debounce } from "lodash";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

const SingleBlogPage = () => {
  const { slug } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const [blogPost, setBlogPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const showAlertMessage = (message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
  };
  const fetchBlogPost = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendURL}/api/getPostBySlug/${slug}`
      );
      if (!response.data) throw new Error("Blog post not found");
      setBlogPost(response.data);
      setLikeCount(response.data.likesCount || 0);
      setIsLiked(response.data.likes?.includes(userInfo?._id) || false);
    } catch (err) {
      setError(err.message);
      showAlertMessage(err.message || "Failed to load blog post", "error");
    } finally {
      setLoading(false);
    }
  }, [slug, userInfo?._id]);

  const fetchRelatedPosts = useCallback(async () => {
    if (!blogPost?.category) return;
    try {
      const response = await axios.get(`${backendURL}/api/getPosts`, {
        params: { category: blogPost.category, limit: 5 },
      });
      const filteredPosts = response.data.posts.filter(
        (post) => post.slug !== slug
      );
      setRelatedPosts(filteredPosts);
    } catch (err) {
      showAlertMessage("Failed to load related posts", "error");
    }
  }, [blogPost?.category, slug]);

  const debouncedHandleLike = debounce(async () => {
    if (!userInfo) {
      showAlertMessage("Please login to like posts", "error");
      return;
    }
    try {
      const response = await axios.post(
        `${backendURL}/api/likePost/${blogPost._id}`,
        {
          userId: userInfo._id,
        }
      );
      setLikeCount(response.data.likesCount);
      setIsLiked(response.data.isLiked);
      showAlertMessage(
        response.data.isLiked ? "Post liked!" : "Post unliked!",
        "success"
      );
    } catch (err) {
      showAlertMessage("Failed to update like", "error");
    }
  }, 300);

  const debouncedHandleBookmark = debounce(async () => {
    if (!userInfo) {
      showAlertMessage("Please login to bookmark posts", "error");
      return;
    }
    try {
      if (isBookmarked) {
        await axios.delete(`${backendURL}/api/removeBookmark`, {
          data: { userId: userInfo._id, postId: blogPost._id },
        });
        showAlertMessage("Post removed from bookmarks", "success");
      } else {
        await axios.post(`${backendURL}/api/addBookmark`, {
          userId: userInfo._id,
          postId: blogPost._id,
        });
        showAlertMessage("Post added to bookmarks", "success");
      }
      setIsBookmarked(!isBookmarked);
    } catch (err) {
      showAlertMessage("Failed to update bookmark", "error");
    }
  }, 300);

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = blogPost?.title || "Check out this blog post";
    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        );
        break;
    }
  };

  const getPostTypeColor = useMemo(() => {
    switch (blogPost?.postType || blogPost?.category) {
      case "Fashion":
        return "bg-red-500";
      case "Entertainment":
        return "bg-blue-500";
      case "Business":
        return "bg-green-500";
      case "LifeStyle":
        return "bg-pink-500";
      default:
        return "bg-gray-500";
    }
  }, [blogPost?.postType, blogPost?.category]);

  useEffect(() => {
    fetchBlogPost();
  }, [fetchBlogPost]);

  useEffect(() => {
    if (blogPost) fetchRelatedPosts();
  }, [blogPost, fetchRelatedPosts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Skeleton height={500} className="mb-6 rounded-xl" />
          <Skeleton height={40} width="80%" className="mb-4" />
          <Skeleton height={20} width="60%" className="mb-6" />
          <Skeleton height={400} className="rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !blogPost) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 flex items-center justify-center">
        <div className="text-center">
          <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            Post not found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            <ChevronLeft size={16} className="mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      {/* Hero Section */}
      <div className="relative w-full overflow-hidden rounded-sm shadow-lg">
        <div className="h-96 lg:h-[500px] overflow-hidden">
          <img
            src={blogPost.image}
            alt={blogPost.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span
                className={`${getPostTypeColor} text-white text-sm px-4 py-1 rounded-full uppercase font-semibold tracking-wide`}>
                {blogPost.postType || blogPost.category}
              </span>
              {blogPost.featured && (
                <div className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  <Star size={14} className="fill-current" />
                  Featured
                </div>
              )}
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl lg:text-5xl font-bold mb-4 leading-tight">
              {blogPost.title}
            </motion.h1>

            <div className="flex flex-wrap items-center gap-6 text-white/90">
              <div className="flex items-center gap-3">
                <img
                  src={
                    blogPost.authorId?.image || "https://via.placeholder.com/40"
                  }
                  alt={blogPost.authorId?.name}
                  className="w-10 h-10 rounded-full border-2 border-white/20"
                  loading="lazy"
                />
                <div>
                  <p className="font-medium">
                    {blogPost.authorId?.name || "Unknown Author"}
                  </p>
                  <p className="text-sm text-white/70">Author</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{moment(blogPost.createdAt).format("MMMM D, YYYY")}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>{blogPost.readTime || "5 min read"}</span>
              </div>

              <div className="flex items-center gap-2">
                <Eye size={18} />
                <span>{blogPost.views?.toLocaleString() || 0} views</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Article Content */}
          <main className="lg:w-3/4">
            {/* Action Buttons */}
            <div className="flex items-center justify-between mb-10 p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <button
                  onClick={debouncedHandleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isLiked
                      ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}>
                  <Heart size={18} className={isLiked ? "fill-current" : ""} />
                  <span className="font-medium">{likeCount}</span>
                </button>

                <button
                  onClick={debouncedHandleBookmark}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isBookmarked
                      ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}>
                  <Bookmark
                    size={18}
                    className={isBookmarked ? "fill-current" : ""}
                  />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  Share:
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleShare("twitter")}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-twitter-500 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-opacity-80 transition-colors">
                    <Twitter size={16} />
                  </button>
                  <button
                    onClick={() => handleShare("facebook")}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-facebook-500 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-opacity-80 transition-colors">
                    <Facebook size={16} />
                  </button>
                  <button
                    onClick={() => handleShare("linkedin")}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-linkedin-500 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-opacity-80 transition-colors">
                    <Linkedin size={16} />
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      showAlertMessage("Link copied to clipboard", "success");
                    }}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Article Body */}
            <article className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-8 mb-10">
              {blogPost.excerpt && (
                <div className="text-xl text-gray-700 dark:text-gray-300 font-medium mb-8 pb-6 border-b border-gray-200 dark:border-gray-700 italic">
                  {blogPost.excerpt}
                </div>
              )}

              <ReactQuill
                value={blogPost.content || ""}
                readOnly
                theme="bubble"
                className="text-gray-900 dark:text-gray-100 leading-relaxed prose prose-lg max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-green-600 hover:prose-a:text-green-700 prose-img:rounded-lg prose-img:shadow-md dark:prose-invert"
              />

              {/* Tags */}
              {blogPost.tags && blogPost.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4 flex-wrap">
                    <Tag
                      size={18}
                      className="text-gray-500 dark:text-gray-400"
                    />
                    {blogPost.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-sm px-3 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Author Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 mb-10">
              <div className="flex items-center gap-5">
                <img
                  src={
                    blogPost.authorId?.image || "https://via.placeholder.com/80"
                  }
                  alt={blogPost.authorId?.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                  loading="lazy"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {blogPost.authorId?.name || "Unknown Author"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {blogPost.authorId?.bio || "No bio available"}
                  </p>
                  <div className="flex gap-4">
                    {blogPost.authorId?.socialLinks?.twitter && (
                      <a
                        href={blogPost.authorId.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-twitter-500 hover:text-opacity-80 transition-colors">
                        <Twitter size={18} />
                      </a>
                    )}
                    {blogPost.authorId?.socialLinks?.linkedin && (
                      <a
                        href={blogPost.authorId.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-linkedin-500 hover:text-opacity-80 transition-colors">
                        <Linkedin size={18} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <CommentBox postId={blogPost._id} />

            {/* Back to Top */}
            <div className="flex justify-end mb-10">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2">
                <ArrowUp size={16} />
                Back to Top
              </button>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:w-1/4 space-y-8">
            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={18} className="text-green-500" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Quick Stats
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Views
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {blogPost.views?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Likes
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {likeCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Reading Time
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {blogPost.readTime || "5 min"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Published
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {moment(blogPost.createdAt).format("MMM D, YYYY")}
                  </span>
                </div>
              </div>
            </div>

            {/* Related Posts */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={18} className="text-green-500" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Related Posts
                </h3>
              </div>
              <div className="space-y-5">
                {relatedPosts.length > 0 ? (
                  relatedPosts.slice(0, 4).map((post) => (
                    <Link
                      key={post._id}
                      to={`/blog/${post.slug}`}
                      className="group block hover:bg-gray-50 dark:hover:bg-gray-700 p-4 rounded-lg transition-colors">
                      <div className="flex gap-4">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                            {post.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                            <Calendar size={12} />
                            <span>
                              {moment(post.createdAt).format("MMM D")}
                            </span>
                            <Eye size={12} />
                            <span>{post.views?.toLocaleString() || 0}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-5">
                    No related posts found
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Alert */}
      {showAlert && (
        <Alert
          variant={alertConfig.variant}
          show={showAlert}
          onClose={() => setShowAlert(false)}
          autoClose={true}
          autoCloseTime={5000}>
          <AlertDescription>{alertConfig.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

// Comment Box Component

// const CommentBox = ({ postId, showAlertMessage }) => {
//   const { userInfo } = useSelector((state) => state.auth);
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [editingCommentId, setEditingCommentId] = useState(null);
//   const [editedContent, setEditedContent] = useState("");
//   const [replyingTo, setReplyingTo] = useState(null);
//   const [replyContent, setReplyContent] = useState("");

//   const fetchComments = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         `${backendURL}/api/getPostComments/${postId}`
//       );
//       setComments(response.data);
//     } catch (err) {
//       console.error("Error fetching comments:", err);
//       showAlertMessage("Failed to load comments. Please try again.", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmitComment = async () => {
//     if (!newComment.trim() || !userInfo) return;

//     try {
//       setSubmitting(true);
//       await axios.post(`${backendURL}/api/createComment`, {
//         content: newComment,
//         postId,
//         userId: userInfo._id,
//       });
//       setNewComment("");
//       await fetchComments();
//     } catch (err) {
//       console.error("Error posting comment:", err);
//       showAlertMessage("Failed to post comment. Please try again.", "error");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleLikeComment = async (commentId) => {
//     if (!userInfo) return;

//     try {
//       await axios.post(`${backendURL}/api/likeComment/${commentId}`, {
//         userId: userInfo._id,
//       });
//       await fetchComments();
//     } catch (err) {
//       console.error("Error liking comment:", err);
//       showAlertMessage("Failed to like comment. Please try again.", "error");
//     }
//   };

//   const handleEditComment = async (commentId, currentContent) => {
//     if (!userInfo) return;

//     try {
//       setEditingCommentId(commentId);
//       setEditedContent(currentContent);
//     } catch (err) {
//       console.error("Error preparing edit:", err);
//       showAlertMessage("Failed to prepare edit. Please try again.", "error");
//     }
//   };

//   const handleSaveEdit = async (commentId) => {
//     if (!editedContent.trim() || !userInfo) return;

//     try {
//       await axios.put(`${backendURL}/api/updateComment/${commentId}`, {
//         content: editedContent,
//         userId: userInfo._id,
//       });
//       setEditingCommentId(null);
//       setEditedContent("");
//       await fetchComments();
//     } catch (err) {
//       console.error("Error saving edit:", err);
//       showAlertMessage("Failed to save edit. Please try again.", "error");
//     }
//   };

//   const handleDeleteComment = async (commentId) => {
//     if (!userInfo) return;

//     try {
//       await axios.delete(`${backendURL}/api/deleteComment/${commentId}`, {
//         data: { userId: userInfo._id },
//       });
//       await fetchComments();
//     } catch (err) {
//       console.error("Error deleting comment:", err);
//       showAlertMessage("Failed to delete comment. Please try again.", "error");
//     }
//   };

//   const handleSubmitReply = async (parentId) => {
//     if (!replyContent.trim() || !userInfo) return;

//     try {
//       setSubmitting(true);
//       await axios.post(`${backendURL}/api/createComment`, {
//         content: replyContent,
//         postId,
//         userId: userInfo._id,
//         parentId,
//       });
//       setReplyContent("");
//       setReplyingTo(null);
//       await fetchComments();
//     } catch (err) {
//       console.error("Error posting reply:", err);
//       showAlertMessage("Failed to post reply. Please try again.", "error");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   useEffect(() => {
//     fetchComments();
//   }, [postId]);

//   return (
//     <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 mb-10">
//       <div className="flex items-center gap-2 mb-6">
//         <MessageSquare size={20} className="text-green-500" />
//         <h3 className="text-xl font-bold text-gray-900 dark:text-white">
//           Comments ({comments.length})
//         </h3>
//       </div>

//       {/* Comment Form */}
//       <div className="mb-8">
//         <textarea
//           value={newComment}
//           onChange={(e) => setNewComment(e.target.value)}
//           placeholder={
//             userInfo ? "Share your thoughts..." : "Please login to comment"
//           }
//           disabled={!userInfo}
//           className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
//           rows="4"
//           maxLength={500}
//         />
//         <div className="flex justify-between items-center mt-3">
//           <span className="text-sm text-gray-500 dark:text-gray-400">
//             {newComment.length}/500
//           </span>
//           <button
//             onClick={handleSubmitComment}
//             disabled={!newComment.trim() || submitting || !userInfo}
//             className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
//             {submitting ? "Posting..." : "Post Comment"}
//           </button>
//         </div>
//       </div>

//       {/* Comments List */}
//       <div className="space-y-6">
//         {loading ? (
//           <div className="space-y-4">
//             {[...Array(3)].map((_, i) => (
//               <div key={i} className="flex gap-4">
//                 <Skeleton circle width={40} height={40} />
//                 <div className="flex-1">
//                   <Skeleton width={120} height={16} className="mb-2" />
//                   <Skeleton count={2} />
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : comments.length > 0 ? (
//           comments.map((comment) => (
//             <div
//               key={comment._id}
//               className="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 transition-colors">
//               {comment.userId?.image ? (
//                 <img
//                   src={comment.userId.image}
//                   alt={comment.userId?.username || "Anonymous"}
//                   className="w-10 h-10 rounded-full object-cover flex-shrink-0"
//                   loading="lazy"
//                 />
//               ) : (
//                 <User className="w-10 h-10 text-gray-400 dark:text-gray-500 flex-shrink-0" />
//               )}
//               <div className="flex-1">
//                 <div className="flex items-center justify-between mb-2">
//                   <div>
//                     <h4 className="font-medium text-gray-900 dark:text-white">
//                       {comment.userId?.username || "Anonymous"}
//                     </h4>
//                     <span className="text-sm text-gray-500 dark:text-gray-400">
//                       {moment(comment.createdAt).fromNow()}
//                     </span>
//                   </div>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => handleLikeComment(comment._id)}
//                       className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
//                         comment.likes?.includes(userInfo?._id)
//                           ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
//                           : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
//                       }`}>
//                       <ThumbsUp size={14} />
//                       <span>{comment.likes?.length || 0}</span>
//                     </button>
//                     {userInfo && comment.userId?._id === userInfo._id && (
//                       <div className="relative">
//                         <MoreVertical
//                           size={18}
//                           className="text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             // Toggle options (implement dropdown if needed)
//                           }}
//                         />
//                         <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 hidden">
//                           <button
//                             onClick={() =>
//                               handleEditComment(comment._id, comment.content)
//                             }
//                             className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => handleDeleteComment(comment._id)}
//                             className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600">
//                             Delete
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//                 {editingCommentId === comment._id ? (
//                   <div className="mb-2">
//                     <textarea
//                       value={editedContent}
//                       onChange={(e) => setEditedContent(e.target.value)}
//                       className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
//                       rows="2"
//                       maxLength={500}
//                     />
//                     <div className="flex gap-2 mt-2">
//                       <button
//                         onClick={() => handleSaveEdit(comment._id)}
//                         className="px-4 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600">
//                         Save
//                       </button>
//                       <button
//                         onClick={() => setEditingCommentId(null)}
//                         className="px-4 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
//                     {comment.content}
//                   </p>
//                 )}
//                 <div className="mt-2">
//                   <button
//                     onClick={() => setReplyingTo(comment._id)}
//                     className="text-sm text-green-600 dark:text-green-400 hover:underline">
//                     Reply
//                   </button>
//                   {replyingTo === comment._id && (
//                     <div className="mt-4 ml-14">
//                       <textarea
//                         value={replyContent}
//                         onChange={(e) => setReplyContent(e.target.value)}
//                         placeholder="Write a reply..."
//                         className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
//                         rows="2"
//                         maxLength={500}
//                       />
//                       <div className="flex gap-2 mt-2">
//                         <button
//                           onClick={() => handleSubmitReply(comment._id)}
//                           disabled={!replyContent.trim() || submitting}
//                           className="px-4 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50">
//                           {submitting ? "Posting..." : "Post Reply"}
//                         </button>
//                         <button
//                           onClick={() => setReplyingTo(null)}
//                           className="px-4 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                   {/* Nested Comments (Replies) */}
//                   {comment.replies && comment.replies.length > 0 && (
//                     <div className="ml-14 mt-4 space-y-4">
//                       {comment.replies.map((reply) => (
//                         <div
//                           key={reply._id}
//                           className="flex gap-4 p-3 bg-gray-100 dark:bg-gray-600 rounded-lg">
//                           {reply.userId?.image ? (
//                             <img
//                               src={reply.userId.image}
//                               alt={reply.userId?.username || "Anonymous"}
//                               className="w-8 h-8 rounded-full object-cover flex-shrink-0"
//                               loading="lazy"
//                             />
//                           ) : (
//                             <User className="w-8 h-8 text-gray-400 dark:text-gray-500 flex-shrink-0" />
//                           )}
//                           <div className="flex-1">
//                             <div className="flex items-center justify-between mb-1">
//                               <div>
//                                 <h4 className="font-medium text-gray-900 dark:text-white text-sm">
//                                   {reply.userId?.username || "Anonymous"}
//                                 </h4>
//                                 <span className="text-xs text-gray-500 dark:text-gray-400">
//                                   {moment(reply.createdAt).fromNow()}
//                                 </span>
//                               </div>
//                             </div>
//                             <p className="text-gray-800 dark:text-gray-200 text-sm whitespace-pre-wrap">
//                               {reply.content}
//                             </p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="text-center py-8">
//             <MessageSquare size={48} className="mx-auto text-gray-400 mb-3" />
//             <p className="text-gray-500 dark:text-gray-400">No comments yet</p>
//             <p className="text-sm text-gray-400 dark:text-gray-500">
//               Be the first to share your thoughts!
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import {
//   MessageSquare,
//   Heart,
//   Reply,
//   Edit3,
//   Trash2,
//   MoreHorizontal,
//   Send,
//   X,
//   Check,
//   User
// } from "lucide-react";
// import moment from "moment";
// import axios from "axios";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";

// const backendURL =
//   import.meta.env.MODE === "production"
//     ? import.meta.env.VITE_BACKEND_URL
//     : "http://localhost:3001";

const CommentBox = ({ postId, showAlertMessage }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [showDropdown, setShowDropdown] = useState(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendURL}/api/getPostComments/${postId}`
      );
      setComments(response.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
      showAlertMessage?.("Failed to load comments. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !userInfo) {
      if (!userInfo) {
        showAlertMessage?.("Please login to comment", "error");
      }
      return;
    }

    try {
      await axios.post(`${backendURL}/api/createComment`, {
        content: newComment,
        postId,
        userId: userInfo._id,
      });
      setNewComment("");
      // Immediately fetch updated comments
      await fetchComments();
      showAlertMessage?.("Comment posted successfully!", "success");
    } catch (err) {
      console.error("Error posting comment:", err);
      showAlertMessage?.("Failed to post comment. Please try again.", "error");
    }
  };

  const handleSubmitReply = async (parentId) => {
    if (!replyContent.trim() || !userInfo) {
      if (!userInfo) {
        showAlertMessage?.("Please login to reply", "error");
      }
      return;
    }

    try {
      await axios.post(`${backendURL}/api/createComment`, {
        content: replyContent,
        postId,
        userId: userInfo._id,
        parentId,
      });
      setReplyContent("");
      setReplyingTo(null);
      // Immediately fetch updated comments
      await fetchComments();
      showAlertMessage?.("Reply posted successfully!", "success");
    } catch (err) {
      console.error("Error posting reply:", err);
      showAlertMessage?.("Failed to post reply. Please try again.", "error");
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!userInfo) {
      showAlertMessage?.("Please login to like comments", "error");
      return;
    }

    try {
      await axios.post(`${backendURL}/api/likeComment/${commentId}`, {
        userId: userInfo._id,
      });
      // Immediately fetch updated comments
      await fetchComments();
    } catch (err) {
      console.error("Error liking comment:", err);
      showAlertMessage?.("Failed to like comment. Please try again.", "error");
    }
  };

  const handleEditComment = (commentId, currentContent) => {
    setEditingComment(commentId);
    setEditContent(currentContent);
    setShowDropdown(null);
  };

  const handleSaveEdit = async (commentId) => {
    if (!editContent.trim() || !userInfo) return;

    try {
      await axios.put(`${backendURL}/api/updateComment/${commentId}`, {
        content: editContent,
        userId: userInfo._id,
      });
      setEditingComment(null);
      setEditContent("");
      // Immediately fetch updated comments
      await fetchComments();
      showAlertMessage?.("Comment updated successfully!", "success");
    } catch (err) {
      console.error("Error saving edit:", err);
      showAlertMessage?.("Failed to save edit. Please try again.", "error");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!userInfo) return;

    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await axios.delete(`${backendURL}/api/deleteComment/${commentId}`, {
          data: { userId: userInfo._id },
        });
        // Immediately fetch updated comments
        await fetchComments();
        setShowDropdown(null);
        showAlertMessage?.("Comment deleted successfully!", "success");
      } catch (err) {
        console.error("Error deleting comment:", err);
        showAlertMessage?.(
          "Failed to delete comment. Please try again.",
          "error"
        );
      }
    }
  };

  const isCommentOwner = (userId) => userId === userInfo?._id;

  const isCommentLiked = (comment) => {
    return comment.likes?.includes(userInfo?._id) || false;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest(".dropdown-container")) {
        setShowDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
          <MessageSquare
            size={20}
            className="text-green-600 dark:text-green-400"
          />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Comments ({comments.length})
        </h3>
      </div>

      {/* New Comment Form */}
      <div className="mb-8">
        <div className="flex gap-4">
          {userInfo?.image ? (
            <img
              src={userInfo.image}
              alt={userInfo.username || userInfo.name}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-600"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-600">
              <User size={20} className="text-gray-500 dark:text-gray-400" />
            </div>
          )}
          <div className="flex-1">
            <div className="relative">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={
                  userInfo
                    ? "Share your thoughts..."
                    : "Please login to comment"
                }
                disabled={!userInfo}
                className="w-full p-4 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                rows="3"
                maxLength={500}
              />
              <button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || !userInfo}
                className="absolute bottom-3 right-3 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100">
                <Send size={16} />
              </button>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {newComment.length}/500
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                <Skeleton circle width={40} height={40} />
                <div className="flex-1">
                  <Skeleton width={120} height={16} className="mb-2" />
                  <Skeleton count={2} />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="group">
              {/* Main Comment */}
              <div className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 transition-all hover:bg-gray-100 dark:hover:bg-gray-700">
                {comment.userId?.image ? (
                  <img
                    src={comment.userId.image}
                    alt={
                      comment.userId?.username ||
                      comment.userId?.name ||
                      "Anonymous"
                    }
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-600"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-600">
                    <User
                      size={20}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  {/* Comment Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {comment.userId?.username ||
                          comment.userId?.name ||
                          "Anonymous"}
                      </h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {moment(comment.createdAt).fromNow()}
                      </span>
                      {isCommentOwner(comment.userId?._id) && (
                        <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full font-medium">
                          You
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {/* Like Button */}
                      <button
                        onClick={() => handleLikeComment(comment._id)}
                        disabled={!userInfo}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                          isCommentLiked(comment)
                            ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}>
                        <Heart
                          size={14}
                          className={
                            isCommentLiked(comment) ? "fill-current" : ""
                          }
                        />
                        <span>{comment.likes?.length || 0}</span>
                      </button>

                      {/* Owner Actions */}
                      {isCommentOwner(comment.userId?._id) && (
                        <div className="relative dropdown-container">
                          <button
                            onClick={() =>
                              setShowDropdown(
                                showDropdown === comment._id
                                  ? null
                                  : comment._id
                              )
                            }
                            className="p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            <MoreHorizontal size={16} />
                          </button>

                          {showDropdown === comment._id && (
                            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                              <button
                                onClick={() =>
                                  handleEditComment(
                                    comment._id,
                                    comment.content
                                  )
                                }
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-t-lg">
                                <Edit3 size={14} />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment._id)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-b-lg">
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Comment Content */}
                  {editingComment === comment._id ? (
                    <div className="mb-3">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                        rows="3"
                        maxLength={500}
                      />
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {editContent.length}/500
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveEdit(comment._id)}
                            disabled={!editContent.trim()}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm">
                            <Check size={14} />
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingComment(null);
                              setEditContent("");
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm">
                            <X size={14} />
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-800 dark:text-gray-200 mb-3 leading-relaxed whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  )}

                  {/* Reply Button */}
                  {userInfo && (
                    <button
                      onClick={() =>
                        setReplyingTo(
                          replyingTo === comment._id ? null : comment._id
                        )
                      }
                      className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors">
                      <Reply size={14} />
                      Reply
                    </button>
                  )}

                  {/* Reply Form */}
                  {replyingTo === comment._id && userInfo && (
                    <div className="mt-4 flex gap-3">
                      {userInfo.image ? (
                        <img
                          src={userInfo.image}
                          alt={userInfo.username || userInfo.name}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-600"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-600">
                          <User
                            size={16}
                            className="text-gray-500 dark:text-gray-400"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="relative">
                          <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Write a reply..."
                            className="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                            rows="2"
                            maxLength={500}
                          />
                          <button
                            onClick={() => handleSubmitReply(comment._id)}
                            disabled={!replyContent.trim()}
                            className="absolute bottom-2 right-2 p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                            <Send size={14} />
                          </button>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {replyContent.length}/500
                          </span>
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyContent("");
                            }}
                            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Nested Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 space-y-4">
                      {comment.replies.map((reply) => (
                        <div
                          key={reply._id}
                          className="flex gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                          {reply.userId?.image ? (
                            <img
                              src={reply.userId.image}
                              alt={
                                reply.userId?.username ||
                                reply.userId?.name ||
                                "Anonymous"
                              }
                              className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-600"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-600">
                              <User
                                size={16}
                                className="text-gray-500 dark:text-gray-400"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <h5 className="font-medium text-gray-900 dark:text-white text-sm">
                                  {reply.userId?.username ||
                                    reply.userId?.name ||
                                    "Anonymous"}
                                </h5>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {moment(reply.createdAt).fromNow()}
                                </span>
                                {isCommentOwner(reply.userId?._id) && (
                                  <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full font-medium">
                                    You
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => handleLikeComment(reply._id)}
                                disabled={!userInfo}
                                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                  reply.likes?.includes(userInfo?._id)
                                    ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                    : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                                }`}>
                                <Heart
                                  size={12}
                                  className={
                                    reply.likes?.includes(userInfo?._id)
                                      ? "fill-current"
                                      : ""
                                  }
                                />
                                <span>{reply.likes?.length || 0}</span>
                              </button>
                            </div>
                            <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
                              {reply.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare
                size={32}
                className="text-gray-400 dark:text-gray-500"
              />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No comments yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Be the first to share your thoughts!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleBlogPage;
