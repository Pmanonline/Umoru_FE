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
import { ChevronDown, ChevronUp } from "lucide-react";

import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Alert, AlertDescription } from "../components/tools/Alert";
import { debounce } from "lodash";
import LoadingSpinner from "../components/tools/LoaddingSpinner";

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
      <>
        <LoadingSpinner />
      </>
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-12 overflow-x-hidden">
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

        <div className="absolute bottom-0 max-w-4xl mid:top-0 left-0 right-0 p-6 lg:p-8 text-white">
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
              className="text-3xl lg:text-5xl mid:text-2xl font-bold mb-4 leading-tight">
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
      <div className="max-w-6xl mx-auto mid:px-2 md:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Article Content */}
          <main className="lg:w-3/4">
            {/* Action Buttons */}
            <div className="flex items-center justify-between mb-3 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
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
            <article className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 md:p-8  mx-auto mb-10">
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
              <div className="md:flex items-center gap-5">
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
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3">
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

// const CommentBox = ({ postId, showAlertMessage }) => {
//   const { userInfo } = useSelector((state) => state.auth);
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [replyingTo, setReplyingTo] = useState(null);
//   const [replyContent, setReplyContent] = useState("");
//   const [editingComment, setEditingComment] = useState(null);
//   const [editContent, setEditContent] = useState("");
//   const [showDropdown, setShowDropdown] = useState(null);

//   const fetchComments = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         `${backendURL}/api/getPostComments/${postId}`
//       );
//       setComments(response.data);
//     } catch (err) {
//       console.error("Error fetching comments:", err);
//       showAlertMessage?.("Failed to load comments. Please try again.", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

// const handleSubmitComment = async () => {
//   if (!newComment.trim() || !userInfo) {
//     if (!userInfo) {
//       showAlertMessage?.("Please login to comment", "error");
//     }
//     return;
//   }

//   try {
//     await axios.post(`${backendURL}/api/createComment`, {
//       content: newComment,
//       postId,
//       userId: userInfo._id,
//     });
//     setNewComment("");
//     // Immediately fetch updated comments
//     await fetchComments();
//     showAlertMessage?.("Comment posted successfully!", "success");
//   } catch (err) {
//     console.error("Error posting comment:", err);
//     showAlertMessage?.("Failed to post comment. Please try again.", "error");
//   }
// };

// const handleSubmitReply = async (parentId) => {
//   if (!replyContent.trim() || !userInfo) {
//     if (!userInfo) {
//       showAlertMessage?.("Please login to reply", "error");
//     }
//     return;
//   }

//   try {
//     await axios.post(`${backendURL}/api/createComment`, {
//       content: replyContent,
//       postId,
//       userId: userInfo._id,
//       parentId,
//     });
//     setReplyContent("");
//     setReplyingTo(null);
//     // Immediately fetch updated comments
//     await fetchComments();
//     showAlertMessage?.("Reply posted successfully!", "success");
//   } catch (err) {
//     console.error("Error posting reply:", err);
//     showAlertMessage?.("Failed to post reply. Please try again.", "error");
//   }
// };

// const handleLikeComment = async (commentId) => {
//   if (!userInfo) {
//     showAlertMessage?.("Please login to like comments", "error");
//     return;
//   }

//   try {
//     await axios.post(`${backendURL}/api/likeComment/${commentId}`, {
//       userId: userInfo._id,
//     });
//     // Immediately fetch updated comments
//     await fetchComments();
//   } catch (err) {
//     console.error("Error liking comment:", err);
//     showAlertMessage?.("Failed to like comment. Please try again.", "error");
//   }
// };

// const handleEditComment = (commentId, currentContent) => {
//   setEditingComment(commentId);
//   setEditContent(currentContent);
//   setShowDropdown(null);
// };

// const handleSaveEdit = async (commentId) => {
//   if (!editContent.trim() || !userInfo) return;

//   try {
//     await axios.put(`${backendURL}/api/updateComment/${commentId}`, {
//       content: editContent,
//       userId: userInfo._id,
//     });
//     setEditingComment(null);
//     setEditContent("");
//     // Immediately fetch updated comments
//     await fetchComments();
//     showAlertMessage?.("Comment updated successfully!", "success");
//   } catch (err) {
//     console.error("Error saving edit:", err);
//     showAlertMessage?.("Failed to save edit. Please try again.", "error");
//   }
// };

// const handleDeleteComment = async (commentId) => {
//   if (!userInfo) return;

//   if (window.confirm("Are you sure you want to delete this comment?")) {
//     try {
//       await axios.delete(`${backendURL}/api/deleteComment/${commentId}`, {
//         data: { userId: userInfo._id },
//       });
//       // Immediately fetch updated comments
//       await fetchComments();
//       setShowDropdown(null);
//       showAlertMessage?.("Comment deleted successfully!", "success");
//     } catch (err) {
//       console.error("Error deleting comment:", err);
//       showAlertMessage?.(
//         "Failed to delete comment. Please try again.",
//         "error"
//       );
//     }
//   }
// };

// const isCommentOwner = (userId) => userId === userInfo?._id;

// const isCommentLiked = (comment) => {
//   return comment.likes?.includes(userInfo?._id) || false;
// };

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (showDropdown && !event.target.closest(".dropdown-container")) {
//         setShowDropdown(null);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [showDropdown]);

//   useEffect(() => {
//     if (postId) {
//       fetchComments();
//     }
//   }, [postId]);

//   return (
//     <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
//       {/* Header */}
//       <div className="flex items-center gap-3 mb-6">
//         <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
//           <MessageSquare
//             size={20}
//             className="text-green-600 dark:text-green-400"
//           />
//         </div>
//         <h3 className="text-xl font-bold text-gray-900 dark:text-white">
//           Comments ({comments.length})
//         </h3>
//       </div>

//       {/* New Comment Form */}
//       <div className="mb-8">
//         <div className="flex gap-4">
//           {userInfo?.image ? (
//             <img
//               src={userInfo.image}
//               alt={userInfo.username || userInfo.name}
//               className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-600"
//             />
//           ) : (
//             <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-600">
//               <User size={20} className="text-gray-500 dark:text-gray-400" />
//             </div>
//           )}
//           <div className="flex-1">
//             <div className="relative">
//               <textarea
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//                 placeholder={
//                   userInfo
//                     ? "Share your thoughts..."
//                     : "Please login to comment"
//                 }
//                 disabled={!userInfo}
//                 className="w-full p-4 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//                 rows="3"
//                 maxLength={500}
//               />
//               <button
//                 onClick={handleSubmitComment}
//                 disabled={!newComment.trim() || !userInfo}
//                 className="absolute bottom-3 right-3 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100">
//                 <Send size={16} />
//               </button>
//             </div>
//             <div className="flex justify-between items-center mt-2">
//               <span className="text-sm text-gray-500 dark:text-gray-400">
//                 {newComment.length}/500
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Comments List */}
//       <div className="space-y-6">
//         {loading ? (
//           <div className="space-y-4">
//             {[...Array(3)].map((_, i) => (
//               <div
//                 key={i}
//                 className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
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
//             <div key={comment._id} className="group">
//               {/* Main Comment */}
//               <div className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 transition-all hover:bg-gray-100 dark:hover:bg-gray-700">
//                 {comment.userId?.image ? (
//                   <img
//                     src={comment.userId.image}
//                     alt={
//                       comment.userId?.username ||
//                       comment.userId?.name ||
//                       "Anonymous"
//                     }
//                     className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-600"
//                   />
//                 ) : (
//                   <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-600">
//                     <User
//                       size={20}
//                       className="text-gray-500 dark:text-gray-400"
//                     />
//                   </div>
//                 )}

//                 <div className="flex-1 min-w-0">
//                   {/* Comment Header */}
//                   <div className="flex items-center justify-between mb-2">
//                     <div className="flex items-center gap-3">
//                       <h4 className="font-semibold text-gray-900 dark:text-white">
//                         {comment.userId?.username ||
//                           comment.userId?.name ||
//                           "Anonymous"}
//                       </h4>
//                       <span className="text-sm text-gray-500 dark:text-gray-400">
//                         {moment(comment.createdAt).fromNow()}
//                       </span>
//                       {isCommentOwner(comment.userId?._id) && (
//                         <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full font-medium">
//                           You
//                         </span>
//                       )}
//                     </div>

//                     {/* Actions */}
//                     <div className="flex items-center gap-2">
//                       {/* Like Button */}
//                       <button
//                         onClick={() => handleLikeComment(comment._id)}
//                         disabled={!userInfo}
//                         className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
//                           isCommentLiked(comment)
//                             ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
//                             : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
//                         }`}>
//                         <Heart
//                           size={14}
//                           className={
//                             isCommentLiked(comment) ? "fill-current" : ""
//                           }
//                         />
//                         <span>{comment.likes?.length || 0}</span>
//                       </button>

//                       {/* Owner Actions */}
//                       {isCommentOwner(comment.userId?._id) && (
//                         <div className="relative dropdown-container">
//                           <button
//                             onClick={() =>
//                               setShowDropdown(
//                                 showDropdown === comment._id
//                                   ? null
//                                   : comment._id
//                               )
//                             }
//                             className="p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
//                             <MoreHorizontal size={16} />
//                           </button>

//                           {showDropdown === comment._id && (
//                             <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
//                               <button
//                                 onClick={() =>
//                                   handleEditComment(
//                                     comment._id,
//                                     comment.content
//                                   )
//                                 }
//                                 className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-t-lg">
//                                 <Edit3 size={14} />
//                                 Edit
//                               </button>
//                               <button
//                                 onClick={() => handleDeleteComment(comment._id)}
//                                 className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-b-lg">
//                                 <Trash2 size={14} />
//                                 Delete
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Comment Content */}
//                   {editingComment === comment._id ? (
//                     <div className="mb-3">
//                       <textarea
//                         value={editContent}
//                         onChange={(e) => setEditContent(e.target.value)}
//                         className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
//                         rows="3"
//                         maxLength={500}
//                       />
//                       <div className="flex justify-between items-center mt-2">
//                         <span className="text-sm text-gray-500 dark:text-gray-400">
//                           {editContent.length}/500
//                         </span>
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => handleSaveEdit(comment._id)}
//                             disabled={!editContent.trim()}
//                             className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm">
//                             <Check size={14} />
//                             Save
//                           </button>
//                           <button
//                             onClick={() => {
//                               setEditingComment(null);
//                               setEditContent("");
//                             }}
//                             className="flex items-center gap-1 px-3 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm">
//                             <X size={14} />
//                             Cancel
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <p className="text-gray-800 dark:text-gray-200 mb-3 leading-relaxed whitespace-pre-wrap">
//                       {comment.content}
//                     </p>
//                   )}

//                   {/* Reply Button */}
//                   {userInfo && (
//                     <button
//                       onClick={() =>
//                         setReplyingTo(
//                           replyingTo === comment._id ? null : comment._id
//                         )
//                       }
//                       className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors">
//                       <Reply size={14} />
//                       Reply
//                     </button>
//                   )}

//                   {/* Reply Form */}
//                   {replyingTo === comment._id && userInfo && (
//                     <div className="mt-4 flex gap-3">
//                       {userInfo.image ? (
//                         <img
//                           src={userInfo.image}
//                           alt={userInfo.username || userInfo.name}
//                           className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-600"
//                         />
//                       ) : (
//                         <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-600">
//                           <User
//                             size={16}
//                             className="text-gray-500 dark:text-gray-400"
//                           />
//                         </div>
//                       )}
//                       <div className="flex-1">
//                         <div className="relative">
//                           <textarea
//                             value={replyContent}
//                             onChange={(e) => setReplyContent(e.target.value)}
//                             placeholder="Write a reply..."
//                             className="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
//                             rows="2"
//                             maxLength={500}
//                           />
//                           <button
//                             onClick={() => handleSubmitReply(comment._id)}
//                             disabled={!replyContent.trim()}
//                             className="absolute bottom-2 right-2 p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
//                             <Send size={14} />
//                           </button>
//                         </div>
//                         <div className="flex justify-between items-center mt-1">
//                           <span className="text-xs text-gray-500 dark:text-gray-400">
//                             {replyContent.length}/500
//                           </span>
//                           <button
//                             onClick={() => {
//                               setReplyingTo(null);
//                               setReplyContent("");
//                             }}
//                             className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
//                             Cancel
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {/* Nested Replies */}
//                   {comment.replies && comment.replies.length > 0 && (
//                     <div className="mt-4 space-y-4">
//                       {comment.replies.map((reply) => (
//                         <div
//                           key={reply._id}
//                           className="flex gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
//                           {reply.userId?.image ? (
//                             <img
//                               src={reply.userId.image}
//                               alt={
//                                 reply.userId?.username ||
//                                 reply.userId?.name ||
//                                 "Anonymous"
//                               }
//                               className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-600"
//                             />
//                           ) : (
//                             <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-600">
//                               <User
//                                 size={16}
//                                 className="text-gray-500 dark:text-gray-400"
//                               />
//                             </div>
//                           )}
//                           <div className="flex-1 min-w-0">
//                             <div className="flex items-center justify-between mb-1">
//                               <div className="flex items-center gap-2">
//                                 <h5 className="font-medium text-gray-900 dark:text-white text-sm">
//                                   {reply.userId?.username ||
//                                     reply.userId?.name ||
//                                     "Anonymous"}
//                                 </h5>
//                                 <span className="text-xs text-gray-500 dark:text-gray-400">
//                                   {moment(reply.createdAt).fromNow()}
//                                 </span>
//                                 {isCommentOwner(reply.userId?._id) && (
//                                   <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full font-medium">
//                                     You
//                                   </span>
//                                 )}
//                               </div>
//                               <button
//                                 onClick={() => handleLikeComment(reply._id)}
//                                 disabled={!userInfo}
//                                 className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
//                                   reply.likes?.includes(userInfo?._id)
//                                     ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
//                                     : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
//                                 }`}>
//                                 <Heart
//                                   size={12}
//                                   className={
//                                     reply.likes?.includes(userInfo?._id)
//                                       ? "fill-current"
//                                       : ""
//                                   }
//                                 />
//                                 <span>{reply.likes?.length || 0}</span>
//                               </button>
//                             </div>
//                             <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
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
//           <div className="text-center py-12">
//             <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
//               <MessageSquare
//                 size={32}
//                 className="text-gray-400 dark:text-gray-500"
//               />
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
//               No comments yet
//             </h3>
//             <p className="text-gray-500 dark:text-gray-400">
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
// import { motion } from "framer-motion";
// import moment from "moment";
// import {
//   MessageSquare,
//   User,
//   Heart,
//   Reply,
//   Edit3,
//   Trash2,
//   MoreHorizontal,
//   Send,
//   Check,
//   X,
// } from "lucide-react";
// import axios from "axios";
// import LoadingSpinner from "../components/tools/LoadingSpinner";
// import { Alert, AlertDescription } from "../components/tools/Alert";

// const backendURL =
//   import.meta.env.MODE === "production"
//     ? import.meta.env.VITE_BACKEND_URL
//     : "http://localhost:3001";

// Modal Component (Reused from SingleBlogPage)
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full relative max-h-[90vh] overflow-y-auto shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-1"
          aria-label="Close modal">
          <X className="w-5 h-5" />
        </button>
        {children}
      </motion.div>
    </div>
  );
};

// ConfirmDeleteModal Component
const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Delete Comment
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Are you sure you want to delete this comment? This action cannot be
          undone.
        </p>
        <div className="flex justify-center gap-4">
          <motion.button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Confirm delete">
            Delete
          </motion.button>
          <motion.button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Cancel delete">
            Cancel
          </motion.button>
        </div>
      </div>
    </Modal>
  );
};

// DefaultAvatar Component
const DefaultAvatar = ({ username, size = "md" }) => {
  const sizes = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 sm:w-10 sm:h-10 text-sm",
    lg: "w-12 h-12 sm:w-14 sm:h-14 text-base",
  };
  const initials = username ? username.slice(0, 2).toUpperCase() : "AN";
  return (
    <div
      className={`bg-gradient-to-br from-teal-500 to-green-500 rounded-full flex items-center justify-center ring-2 ring-gray-200 dark:ring-gray-600 text-white font-medium ${sizes[size]}`}>
      {initials}
    </div>
  );
};

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
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    commentId: null,
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });

  const localShowAlertMessage = (message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
  };

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendURL}/api/getPostComments/${postId}`
      );
      setComments(response.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
      showAlertMessage?.(
        "Failed to load comments. Please try again.",
        "destructive"
      );
      localShowAlertMessage(
        "Failed to load comments. Please try again.",
        "destructive"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !userInfo) {
      if (!userInfo) {
        showAlertMessage?.("Please login to comment", "destructive");
        localShowAlertMessage("Please login to comment", "destructive");
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
      await fetchComments();
      showAlertMessage?.("Comment posted successfully!", "success");
      localShowAlertMessage("Comment posted successfully!", "success");
    } catch (err) {
      console.error("Error posting comment:", err);
      showAlertMessage?.(
        "Failed to post comment. Please try again.",
        "destructive"
      );
      localShowAlertMessage(
        "Failed to post comment. Please try again.",
        "destructive"
      );
    }
  };

  const handleSubmitReply = async (parentId) => {
    if (!replyContent.trim() || !userInfo) {
      if (!userInfo) {
        showAlertMessage?.("Please login to reply", "destructive");
        localShowAlertMessage("Please login to reply", "destructive");
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
      await fetchComments();
      showAlertMessage?.("Reply posted successfully!", "success");
      localShowAlertMessage("Reply posted successfully!", "success");
    } catch (err) {
      console.error("Error posting reply:", err);
      showAlertMessage?.(
        "Failed to post reply. Please try again.",
        "destructive"
      );
      localShowAlertMessage(
        "Failed to post reply. Please try again.",
        "destructive"
      );
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!userInfo) {
      showAlertMessage?.("Please login to like comments", "destructive");
      localShowAlertMessage("Please login to like comments", "destructive");
      return;
    }
    try {
      await axios.post(`${backendURL}/api/likeComment/${commentId}`, {
        userId: userInfo._id,
      });
      await fetchComments();
    } catch (err) {
      console.error("Error liking comment:", err);
      showAlertMessage?.(
        "Failed to like comment. Please try again.",
        "destructive"
      );
      localShowAlertMessage(
        "Failed to like comment. Please try again.",
        "destructive"
      );
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
      await axios.put(`${backendURL}/api/editComment/${commentId}`, {
        content: editContent,
        userId: userInfo._id,
      });
      setEditingComment(null);
      setEditContent("");
      await fetchComments();
      showAlertMessage?.("Comment updated successfully!", "success");
      localShowAlertMessage("Comment updated successfully!", "success");
    } catch (err) {
      console.error("Error saving edit:", err);
      showAlertMessage?.(
        "Failed to save edit. Please try again.",
        "destructive"
      );
      localShowAlertMessage(
        "Failed to save edit. Please try again.",
        "destructive"
      );
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!userInfo) return;
    setDeleteModal({ isOpen: true, commentId });
  };

  const confirmDelete = async () => {
    const { commentId } = deleteModal;
    try {
      await axios.delete(`${backendURL}/api/deleteComment/${commentId}`, {
        data: { userId: userInfo._id },
      });
      await fetchComments();
      setShowDropdown(null);
      setDeleteModal({ isOpen: false, commentId: null });
      showAlertMessage?.("Comment deleted successfully!", "success");
      localShowAlertMessage("Comment deleted successfully!", "success");
    } catch (err) {
      console.error("Error deleting comment:", err);
      showAlertMessage?.(
        "Failed to delete comment. Please try again.",
        "destructive"
      );
      localShowAlertMessage(
        "Failed to delete comment. Please try again.",
        "destructive"
      );
    }
  };

  const isCommentOwner = (userId) => userId === userInfo?._id;

  const isCommentLiked = (comment) =>
    comment.likes?.includes(userInfo?._id) || false;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest(".dropdown-container")) {
        setShowDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId]);

  const commentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
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
      <div className="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex-shrink-0">
            <MessageSquare
              size={18}
              className="text-teal-600 dark:text-teal-400"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              Comments ({comments.length})
            </h3>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <div className="mb-6 sm:mb-8">
          <div className="flex gap-3 sm:gap-4">
            <div className="flex-shrink-0">
              {userInfo?.image ? (
                <img
                  src={userInfo.image}
                  alt={userInfo.username || userInfo.name}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-600"
                />
              ) : (
                <DefaultAvatar
                  username={userInfo?.username || userInfo?.name}
                  size="md"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
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
                  className="w-full p-3 sm:p-4 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white dark:focus:bg-gray-800 resize-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  rows="3"
                  maxLength={500}
                  aria-label="New comment input"
                />
                <motion.button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || !userInfo}
                  className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Submit comment">
                  <Send size={14} />
                </motion.button>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {newComment.length}/500
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4 sm:space-y-6">
          {loading ? (
            <LoadingSpinner />
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <motion.div
                key={comment._id}
                className="group"
                variants={commentVariants}
                initial="hidden"
                animate="visible">
                <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600">
                  <div className="flex-shrink-0">
                    {comment.userId?.image ? (
                      <img
                        src={comment.userId.image}
                        alt={
                          comment.userId?.username ||
                          comment.userId?.name ||
                          "Anonymous"
                        }
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-600"
                      />
                    ) : (
                      <DefaultAvatar
                        username={
                          comment.userId?.username || comment.userId?.name
                        }
                        size="md"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                          {comment.userId?.username ||
                            comment.userId?.name ||
                            "Anonymous"}
                        </h4>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                          {moment(comment.createdAt).fromNow()}
                        </span>
                        {isCommentOwner(comment.userId?._id) && (
                          <span className="px-2 py-0.5 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 text-xs rounded-full font-medium flex-shrink-0">
                            You
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-2">
                        <motion.button
                          onClick={() => handleLikeComment(comment._id)}
                          disabled={!userInfo}
                          className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                            isCommentLiked(comment)
                              ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label={
                            isCommentLiked(comment)
                              ? "Unlike comment"
                              : "Like comment"
                          }>
                          <Heart
                            size={12}
                            className={
                              isCommentLiked(comment) ? "fill-current" : ""
                            }
                          />
                          <span>{comment.likes?.length || 0}</span>
                        </motion.button>
                        {isCommentOwner(comment.userId?._id) && (
                          <div className="relative dropdown-container">
                            <motion.button
                              onClick={() =>
                                setShowDropdown(
                                  showDropdown === comment._id
                                    ? null
                                    : comment._id
                                )
                              }
                              className="p-1 sm:p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              aria-label="Comment options">
                              <MoreHorizontal size={14} />
                            </motion.button>
                            {showDropdown === comment._id && (
                              <div className="absolute right-0 top-full mt-2 w-36 sm:w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
                                <motion.button
                                  onClick={() =>
                                    handleEditComment(
                                      comment._id,
                                      comment.content
                                    )
                                  }
                                  className="w-full flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-t-lg"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}>
                                  <Edit3 size={12} />
                                  Edit
                                </motion.button>
                                <motion.button
                                  onClick={() =>
                                    handleDeleteComment(comment._id)
                                  }
                                  className="w-full flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-b-lg"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}>
                                  <Trash2 size={12} />
                                  Delete
                                </motion.button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    {editingComment === comment._id ? (
                      <div className="mb-3">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full p-3 sm:p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none text-sm sm:text-base overflow-wrap break-word"
                          rows="3"
                          maxLength={500}
                          aria-label="Edit comment input"
                        />
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            {editContent.length}/500
                          </span>
                          <div className="flex gap-2">
                            <motion.button
                              onClick={() => handleSaveEdit(comment._id)}
                              disabled={!editContent.trim()}
                              className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              aria-label="Save edited comment">
                              <Check size={12} />
                              Save
                            </motion.button>
                            <motion.button
                              onClick={() => {
                                setEditingComment(null);
                                setEditContent("");
                              }}
                              className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-xs sm:text-sm"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              aria-label="Cancel edit">
                              <X size={12} />
                              Cancel
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-800 dark:text-gray-200 mb-3 leading-relaxed text-sm sm:text-base overflow-wrap break-word">
                        {comment.content}
                      </p>
                    )}
                    {userInfo && (
                      <motion.button
                        onClick={() =>
                          setReplyingTo(
                            replyingTo === comment._id ? null : comment._id
                          )
                        }
                        className="flex items-center gap-1 text-xs sm:text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={
                          replyingTo === comment._id
                            ? "Cancel reply"
                            : "Reply to comment"
                        }>
                        <Reply size={12} />
                        Reply
                      </motion.button>
                    )}
                    {replyingTo === comment._id && userInfo && (
                      <div className="mt-4 flex gap-2 sm:gap-3">
                        <div className="flex-shrink-0">
                          {userInfo.image ? (
                            <img
                              src={userInfo.image}
                              alt={userInfo.username || userInfo.name}
                              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-600"
                            />
                          ) : (
                            <DefaultAvatar
                              username={userInfo?.username || userInfo?.name}
                              size="sm"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="relative">
                            <textarea
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              placeholder="Write a reply..."
                              className="w-full p-2 sm:p-3 pr-10 sm:pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none text-sm overflow-wrap break-word"
                              rows="2"
                              maxLength={500}
                              aria-label="Reply input"
                            />
                            <motion.button
                              onClick={() => handleSubmitReply(comment._id)}
                              disabled={!replyContent.trim()}
                              className="absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2 p-1 sm:p-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              aria-label="Submit reply">
                              <Send size={12} />
                            </motion.button>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {replyContent.length}/500
                            </span>
                            <motion.button
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyContent("");
                              }}
                              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              aria-label="Cancel reply">
                              Cancel
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    )}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 space-y-3 pl-2 sm:pl-4 border-l-2 border-gray-200 dark:border-gray-600">
                        {comment.replies.map((reply) => (
                          <motion.div
                            key={reply._id}
                            className="flex gap-2 sm:gap-3 p-2 sm:p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
                            variants={commentVariants}
                            initial="hidden"
                            animate="visible">
                            <div className="flex-shrink-0">
                              {reply.userId?.image ? (
                                <img
                                  src={reply.userId.image}
                                  alt={
                                    reply.userId?.username ||
                                    reply.userId?.name ||
                                    "Anonymous"
                                  }
                                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-600"
                                />
                              ) : (
                                <DefaultAvatar
                                  username={
                                    reply.userId?.username || reply.userId?.name
                                  }
                                  size="sm"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex flex-wrap items-center gap-1 sm:gap-2 min-w-0 flex-1">
                                  <h5 className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm truncate">
                                    {reply.userId?.username ||
                                      reply.userId?.name ||
                                      "Anonymous"}
                                  </h5>
                                  <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                                    {moment(reply.createdAt).fromNow()}
                                  </span>
                                  {isCommentOwner(reply.userId?._id) && (
                                    <span className="px-1.5 py-0.5 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 text-xs rounded-full font-medium flex-shrink-0">
                                      You
                                    </span>
                                  )}
                                </div>
                                <motion.button
                                  onClick={() => handleLikeComment(reply._id)}
                                  disabled={!userInfo}
                                  className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ml-1 ${
                                    reply.likes?.includes(userInfo?._id)
                                      ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                                  }`}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  aria-label={
                                    reply.likes?.includes(userInfo?._id)
                                      ? "Unlike reply"
                                      : "Like reply"
                                  }>
                                  <Heart
                                    size={10}
                                    className={
                                      reply.likes?.includes(userInfo?._id)
                                        ? "fill-current"
                                        : ""
                                    }
                                  />
                                  <span>{reply.likes?.length || 0}</span>
                                </motion.button>
                              </div>
                              <p className="text-gray-800 dark:text-gray-200 text-xs sm:text-sm leading-relaxed overflow-wrap break-word">
                                {reply.content}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 sm:py-12">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare
                  size={24}
                  className="text-teal-600 dark:text-teal-400"
                />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                No comments yet
              </h3>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                Be the first to share your thoughts!
              </p>
            </div>
          )}
        </div>
      </div>
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, commentId: null })}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default SingleBlogPage;
