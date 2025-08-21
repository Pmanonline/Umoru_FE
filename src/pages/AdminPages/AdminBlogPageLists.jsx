import React, { useEffect, useState, useCallback } from "react"; // Removed useMemo
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  PlusCircle,
  Trash2,
  Edit,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";
import { Alert, AlertDescription } from "../../components/tools/Alert";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

// Define LoadingSpinner as a constant component
const LoadingSpinner = (
  <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
    <Loader2
      className="animate-spin text-teal-500 dark:text-teal-400"
      size={40}
    />
  </div>
);

const PostTableRow = React.memo(({ post, onDeleteClick }) => (
  <tr className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
    <td className="px-6 py-4 whitespace-nowrap">
      {new Date(post.updatedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      })}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <Link to={`/post/${post.slug}`}>
        {post?.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/fallback-image.png";
            }}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
            <AlertCircle
              className="text-gray-500 dark:text-gray-400"
              size={20}
            />
          </div>
        )}
      </Link>
    </td>
    <td className="px-6 py-4 min-w-[200px]">
      <Link
        to={`/post/${post.slug}`}
        className="font-medium text-gray-900 dark:text-white hover:text-teal-500 dark:hover:text-teal-400 block truncate max-w-[250px]"
        title={post.title}>
        {post.title}
      </Link>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">{post.category}</td>
    <td className="px-6 py-4 whitespace-nowrap">
      <button
        onClick={() => onDeleteClick(post._id)}
        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-1 rounded flex-shrink-0">
        <Trash2 size={20} />
      </button>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <Link
        to={`/Admin/CreateBlogPosts/${post._id}`}
        className="text-teal-500 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 transition-colors p-1 rounded flex-shrink-0">
        <Edit size={20} />
      </Link>
    </td>
  </tr>
));

export default function AdminBlogposts() {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [postIdToDelete, setPostIdToDelete] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });

  const { userInfo } = useSelector((state) => state.auth);

  const fetchPosts = useCallback(
    async (startIndex = 0) => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${backendURL}/api/getPosts?startIndex=${startIndex}&limit=9`
        );
        const data = await res.json();
        if (res.ok) {
          setPosts((prev) =>
            startIndex === 0 ? data.posts : [...prev, ...data.posts]
          );
          setShowMore(data.posts.length === 9);
        } else {
          setAlertConfig({
            variant: "error",
            message: data.message || "Failed to fetch posts",
          });
          setShowAlert(true);
        }
      } catch (error) {
        setAlertConfig({
          variant: "error",
          message: error.message || "An error occurred while fetching posts",
        });
        setShowAlert(true);
      } finally {
        setIsLoading(false);
      }
    },
    [backendURL]
  );

  useEffect(() => {
    if (userInfo) {
      fetchPosts();
    }
  }, [userInfo, fetchPosts]);

  const handleShowMore = useCallback(() => {
    if (!isLoading) {
      fetchPosts(posts.length);
    }
  }, [fetchPosts, isLoading, posts.length]);

  const handleDeletePost = useCallback(async () => {
    try {
      const res = await fetch(
        `${backendURL}/api/deletePost/${postIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
        setAlertConfig({
          variant: "success",
          message: "Post deleted successfully",
        });
        setShowAlert(true);
        setIsDeleteModalOpen(false);
      } else {
        const data = await res.json();
        setAlertConfig({
          variant: "error",
          message: data.message || "Failed to delete post",
        });
        setShowAlert(true);
      }
    } catch (error) {
      setAlertConfig({
        variant: "error",
        message: error.message || "An error occurred while deleting post",
      });
      setShowAlert(true);
    }
  }, [backendURL, postIdToDelete]);

  const handleDeleteClick = useCallback((postId) => {
    setPostIdToDelete(postId);
    setIsDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setPostIdToDelete("");
  }, []);

  if (isLoading) {
    return LoadingSpinner;
  }

  return (
    <div className="p-3 max-w-6xl mx-auto min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="my-5 ml-3">
        <Link to="/Admin/CreateBlogPosts">
          <button className="flex items-center gap-2 px-3 py-1 bg-teal-500 dark:bg-teal-400 text-white rounded hover:bg-teal-600 dark:hover:bg-teal-300 transition-colors duration-200">
            <PlusCircle size={16} />
            Create Post
          </button>
        </Link>
      </div>

      <div className="w-full">
        {posts.length > 0 ? (
          <div className="overflow-hidden shadow-md rounded-lg">
            {/* Scrollable container with auto side scroll */}
            <div className="overflow-x-auto scrollbar-thin scrollbar-track-gray-100 dark:scrollbar-track-gray-800 scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 min-w-[800px]">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-200 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 whitespace-nowrap">
                      Date updated
                    </th>
                    <th className="px-6 py-3 whitespace-nowrap">Post image</th>
                    <th className="px-6 py-3 min-w-[200px]">Post title</th>
                    <th className="px-6 py-3 whitespace-nowrap">Category</th>
                    <th className="px-6 py-3 whitespace-nowrap">Delete</th>
                    <th className="px-6 py-3 whitespace-nowrap">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <PostTableRow
                      key={post._id}
                      post={post}
                      onDeleteClick={handleDeleteClick}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {showMore && (
              <button
                onClick={handleShowMore}
                disabled={isLoading}
                className="w-full text-teal-500 dark:text-teal-400 py-4 text-sm hover:text-teal-700 dark:hover:text-teal-300 disabled:opacity-50 transition-colors duration-200 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
                {isLoading ? (
                  <Loader2 className="animate-spin inline mr-2" size={16} />
                ) : (
                  "Show more"
                )}
              </button>
            )}
          </div>
        ) : (
          <p className="text-center py-4">You have no posts yet!</p>
        )}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Confirm Deletion
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete this post? This action cannot be
                undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200">
                  <X size={20} />
                </button>
                <button
                  onClick={handleDeletePost}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

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
    </div>
  );
}
