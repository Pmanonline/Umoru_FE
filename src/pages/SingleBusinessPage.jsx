// import React, { useState } from "react";
// import {
//   MapPin,
//   Mail,
//   Phone,
//   Star,
//   Share2,
//   Flag,
//   MessageCircle,
//   DollarSign,
//   Calendar,
//   Users,
//   Briefcase,
//   Globe,
// } from "lucide-react";

// const SingleBusinessPage = () => {
//   const [selectedRating, setSelectedRating] = useState(null);
//   const [reviewText, setReviewText] = useState("");
//   const [isContactVisible, setIsContactVisible] = useState(false);

//   const businessData = {
//     name: "A.K Fashion Designer",
//     address: "No 2, Bolaji street, Alausa, Ikeja, Lagos",
//     businessId: "0140",
//     contact: "09162035090",
//     email: "akfashion@example.com",
//     website: "www.akfashiondesigner.com",
//     established: "23 Apr 2012",
//     founder: "Mr. Babatunde Abduakim (CEO)",
//     rating: 5,
//     category: ["Fashion Design", "Artists"],
//     businessType: "Private Limited Company",
//     businessLine: "Services",
//     registrationNumber: "Not Specified",
//     tinNumber: "Not Specified",
//     taxRegistered: false,
//     nearestBusStop: "Alausa Bus/stop",
//     landmark: "Testing Ground",
//     operatingHours: "8am- 10pm",
//     staffCount: "1-10",
//     services: "Fashion Design",
//     targetAudience: "General Public",
//     annualRevenue: "$50,000 - $100,000",
//     staffList: [
//       { name: "Mr. Tunde", position: "Manager" },
//       { name: "Mr. Babatunde", position: "CEO" },
//     ],
//   };

//   const handleShare = async () => {
//     try {
//       if (navigator.share) {
//         await navigator.share({
//           title: businessData.name,
//           text: `Check out ${businessData.name} - ${businessData.services}`,
//           url: window.location.href,
//         });
//       } else {
//         // Fallback for browsers that don't support Web Share API
//         navigator.clipboard.writeText(window.location.href);
//         alert("Business link copied to clipboard!");
//       }
//     } catch (error) {
//       console.error("Error sharing:", error);
//     }
//   };

//   const handleSubmitReview = () => {
//     if (!selectedRating || !reviewText.trim()) {
//       alert("Please provide both rating and review text");
//       return;
//     }
//     // Implement review submission logic
//     console.log("Submitting review", {
//       rating: selectedRating,
//       review: reviewText,
//     });
//     // Reset form after submission
//     setSelectedRating(null);
//     setReviewText("");
//   };

//   const toggleContactVisibility = () => {
//     setIsContactVisible(!isContactVisible);
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4 space-y-6">
//       {/* Business Header */}
//       <div className="bg-white shadow-lg rounded-lg overflow-hidden">
//         {/* Cover Image Placeholder */}
//         <div className="h-48 bg-gray-200 flex items-center justify-center">
//           <span className="text-gray-500">Business Cover Image</span>
//         </div>

//         {/* Business Actions */}
//         <div className="flex justify-between p-4 border-b">
//           <div className="flex space-x-4">
//             <button
//               onClick={handleShare}
//               className="flex items-center text-blue-600 hover:bg-blue-50 p-2 rounded-lg">
//               <Share2 className="mr-2" size={20} /> Share
//             </button>
//             <button className="flex items-center text-green-600 hover:bg-green-50 p-2 rounded-lg">
//               <MessageCircle className="mr-2" size={20} /> Message
//             </button>
//           </div>
//           <button className="flex items-center text-red-600 hover:bg-red-50 p-2 rounded-lg">
//             <Flag className="mr-2" size={20} /> Report Business
//           </button>
//         </div>

//         {/* Business Details */}
//         <div className="p-6">
//           <div className="flex justify-between items-start">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">
//                 {businessData.name}
//               </h1>
//               <div className="flex items-center mt-2">
//                 {[...Array(5)].map((_, i) => (
//                   <Star
//                     key={i}
//                     className={`${i < businessData.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
//                   />
//                 ))}
//                 <span className="ml-2 text-gray-600">
//                   ({businessData.rating}/5)
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="mt-4 space-y-2 text-gray-700">
//             <div className="flex items-center">
//               <MapPin className="mr-2 text-blue-500" size={20} />
//               <span>{businessData.address}</span>
//             </div>
//             <div className="flex items-center">
//               <Phone className="mr-2 text-green-500" size={20} />
//               <span>
//                 {isContactVisible ? businessData.contact : "********"}
//                 <button
//                   onClick={toggleContactVisibility}
//                   className="ml-2 text-blue-500 text-sm">
//                   {isContactVisible ? "Hide" : "Show"}
//                 </button>
//               </span>
//             </div>
//             <div className="flex items-center">
//               <Mail className="mr-2 text-red-500" size={20} />
//               <span>
//                 {isContactVisible ? businessData.email : "*******@example.com"}
//                 <button
//                   onClick={toggleContactVisibility}
//                   className="ml-2 text-blue-500 text-sm">
//                   {isContactVisible ? "Hide" : "Show"}
//                 </button>
//               </span>
//             </div>
//             <div className="flex items-center">
//               <Globe className="mr-2 text-purple-500" size={20} />
//               <span>
//                 {isContactVisible ? businessData.website : "************"}
//                 <button
//                   onClick={toggleContactVisibility}
//                   className="ml-2 text-blue-500 text-sm">
//                   {isContactVisible ? "Hide" : "Show"}
//                 </button>
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Additional Business Information */}
//       <div className="bg-white shadow-lg rounded-lg p-6">
//         <h2 className="text-xl font-semibold mb-4">Business Details</h2>
//         <div className="grid md:grid-cols-2 gap-4">
//           <div className="space-y-2">
//             <div className="flex items-center">
//               <Briefcase className="mr-2 text-blue-500" size={20} />
//               <p className="text-gray-600">
//                 Business Type: {businessData.businessType}
//               </p>
//             </div>
//             <div className="flex items-center">
//               <Calendar className="mr-2 text-green-500" size={20} />
//               <p className="text-gray-600">
//                 Established: {businessData.established}
//               </p>
//             </div>
//             <div className="flex items-center">
//               <Users className="mr-2 text-purple-500" size={20} />
//               <p className="text-gray-600">
//                 Categories: {businessData.category.join(", ")}
//               </p>
//             </div>
//           </div>
//           <div className="space-y-2">
//             <div className="flex items-center">
//               <Users className="mr-2 text-orange-500" size={20} />
//               <p className="text-gray-600">
//                 Staff Count: {businessData.staffCount}
//               </p>
//             </div>
//             <div className="flex items-center">
//               <DollarSign className="mr-2 text-green-600" size={20} />
//               <p className="text-gray-600">
//                 Annual Revenue: {businessData.annualRevenue}
//               </p>
//             </div>
//             <div className="flex items-center">
//               <Briefcase className="mr-2 text-red-500" size={20} />
//               <p className="text-gray-600">
//                 Business Line: {businessData.businessLine}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Staff List */}
//       <div className="bg-white shadow-lg rounded-lg p-6">
//         <h2 className="text-xl font-semibold mb-4">Staff List</h2>
//         <div className="space-y-2">
//           {businessData.staffList.map((staff, index) => (
//             <div key={index} className="flex justify-between border-b pb-2">
//               <span>{staff.name}</span>
//               <span className="text-gray-600">{staff.position}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ... Rest of the existing code remains the same ... */}
//     </div>
//   );
// };

// export default SingleBusinessPage;

// import React, { useState } from "react";
// import {
//   MapPin,
//   Mail,
//   Phone,
//   Star,
//   Share2,
//   Flag,
//   MessageCircle,
//   DollarSign,
//   Calendar,
//   Users,
//   Briefcase,
//   Globe,
// } from "lucide-react";

// const SingleBusinessPage = () => {

//   const [selectedRating, setSelectedRating] = useState(null);
//   const [reviewText, setReviewText] = useState("");
//   const [isContactVisible, setIsContactVisible] = useState(false);

//   const businessData = {
//     name: "A.K Fashion Designer",
//     address: "No 2, Bolaji street, Alausa, Ikeja, Lagos",
//     businessId: "0140",
//     contact: "09162035090",
//     email: "akfashion@example.com",
//     website: "www.akfashiondesigner.com",
//     established: "23 Apr 2012",
//     founder: "Mr. Babatunde Abduakim (CEO)",
//     rating: 5,
//     category: ["Fashion Design", "Artists"],
//     businessType: "Private Limited Company",
//     businessLine: "Services",
//     registrationNumber: "Not Specified",
//     tinNumber: "Not Specified",
//     taxRegistered: false,
//     nearestBusStop: "Alausa Bus/stop",
//     landmark: "Testing Ground",
//     operatingHours: "8am- 10pm",
//     staffCount: "1-10",
//     services: "Fashion Design",
//     targetAudience: "General Public",
//     annualRevenue: "$50,000 - $100,000",
//     staffList: [
//       { name: "Mr. Tunde", position: "Manager" },
//       { name: "Mr. Babatunde", position: "CEO" },
//     ],
//     reviews: [
//       {
//         name: "Peter Chidubem Uche",
//         rating: 5,
//         text: "awesome!",
//         date: "10 Feb 2025",
//       },
//     ],
//   };

//   const handleShare = async () => {
//     try {
//       if (navigator.share) {
//         await navigator.share({
//           title: businessData.name,
//           text: `Check out ${businessData.name} - ${businessData.services}`,
//           url: window.location.href,
//         });
//       } else {
//         navigator.clipboard.writeText(window.location.href);
//         alert("Business link copied to clipboard!");
//       }
//     } catch (error) {
//       console.error("Error sharing:", error);
//     }
//   };

//   const handleSubmitReview = () => {
//     if (!selectedRating || !reviewText.trim()) {
//       alert("Please provide both rating and review text");
//       return;
//     }
//     console.log("Submitting review", {
//       rating: selectedRating,
//       review: reviewText,
//     });
//     setSelectedRating(null);
//     setReviewText("");
//   };

//   const toggleContactVisibility = () => {
//     setIsContactVisible(!isContactVisible);
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-4 space-y-6">
//       {/* Business Header */}
//       <div className="bg-white shadow-lg rounded-lg overflow-hidden">
//         <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
//           <span className="text-white text-xl font-semibold">
//             Business Cover Image
//           </span>
//         </div>

//         {/* Business Actions */}
//         <div className="flex justify-between p-4 border-b">
//           <div className="flex space-x-4">
//             <button
//               onClick={handleShare}
//               className="flex items-center text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors">
//               <Share2 className="mr-2" size={20} /> Share
//             </button>
//             <button className="flex items-center text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors">
//               <MessageCircle className="mr-2" size={20} /> Message
//             </button>
//           </div>
//           <button className="flex items-center text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors">
//             <Flag className="mr-2" size={20} /> Report Business
//           </button>
//         </div>

//         {/* Business Details */}
//         <div className="p-6">
//           <div className="flex justify-between items-start">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">
//                 {businessData.name}
//               </h1>
//               <div className="flex items-center mt-2">
//                 {[...Array(5)].map((_, i) => (
//                   <Star
//                     key={i}
//                     className={`${i < businessData.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
//                   />
//                 ))}
//                 <span className="ml-2 text-gray-600">
//                   ({businessData.rating}/5)
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="mt-4 space-y-2 text-gray-700">
//             <div className="flex items-center">
//               <MapPin className="mr-2 text-blue-500" size={20} />
//               <span>{businessData.address}</span>
//             </div>
//             <div className="flex items-center">
//               <Phone className="mr-2 text-green-500" size={20} />
//               <span>
//                 {isContactVisible ? businessData.contact : "********"}
//                 <button
//                   onClick={toggleContactVisibility}
//                   className="ml-2 text-blue-500 text-sm hover:text-blue-700 transition-colors">
//                   {isContactVisible ? "Hide" : "Show"}
//                 </button>
//               </span>
//             </div>
//             <div className="flex items-center">
//               <Mail className="mr-2 text-red-500" size={20} />
//               <span>
//                 {isContactVisible ? businessData.email : "*******@example.com"}
//                 <button
//                   onClick={toggleContactVisibility}
//                   className="ml-2 text-blue-500 text-sm hover:text-blue-700 transition-colors">
//                   {isContactVisible ? "Hide" : "Show"}
//                 </button>
//               </span>
//             </div>
//             <div className="flex items-center">
//               <Globe className="mr-2 text-purple-500" size={20} />
//               <span>
//                 {isContactVisible ? businessData.website : "************"}
//                 <button
//                   onClick={toggleContactVisibility}
//                   className="ml-2 text-blue-500 text-sm hover:text-blue-700 transition-colors">
//                   {isContactVisible ? "Hide" : "Show"}
//                 </button>
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Additional Business Information */}
//       <div className="bg-white shadow-lg rounded-lg p-6">
//         <h2 className="text-2xl font-semibold mb-6">Business Details</h2>
//         <div className="grid md:grid-cols-2 gap-6">
//           <div className="space-y-4">
//             <div className="flex items-center">
//               <Briefcase className="mr-2 text-blue-500" size={20} />
//               <p className="text-gray-600">
//                 Business Type: {businessData.businessType}
//               </p>
//             </div>
//             <div className="flex items-center">
//               <Calendar className="mr-2 text-green-500" size={20} />
//               <p className="text-gray-600">
//                 Established: {businessData.established}
//               </p>
//             </div>
//             <div className="flex items-center">
//               <Users className="mr-2 text-purple-500" size={20} />
//               <p className="text-gray-600">
//                 Categories: {businessData.category.join(", ")}
//               </p>
//             </div>
//           </div>
//           <div className="space-y-4">
//             <div className="flex items-center">
//               <Users className="mr-2 text-orange-500" size={20} />
//               <p className="text-gray-600">
//                 Staff Count: {businessData.staffCount}
//               </p>
//             </div>
//             <div className="flex items-center">
//               <DollarSign className="mr-2 text-green-600" size={20} />
//               <p className="text-gray-600">
//                 Annual Revenue: {businessData.annualRevenue}
//               </p>
//             </div>
//             <div className="flex items-center">
//               <Briefcase className="mr-2 text-red-500" size={20} />
//               <p className="text-gray-600">
//                 Business Line: {businessData.businessLine}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Staff List */}
//       <div className="bg-white shadow-lg rounded-lg p-6">
//         <h2 className="text-2xl font-semibold mb-6">Staff List</h2>
//         <div className="space-y-4">
//           {businessData.staffList.map((staff, index) => (
//             <div key={index} className="flex justify-between border-b pb-4">
//               <span className="font-medium">{staff.name}</span>
//               <span className="text-gray-600">{staff.position}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Reviews Section */}
//       <div className="bg-white shadow-lg rounded-lg p-6">
//         <h2 className="text-2xl font-semibold mb-6">Reviews</h2>

//         {/* Review Submission */}
//         <div className="mb-8">
//           <h3 className="text-xl font-medium mb-4">Submit a Review</h3>
//           <div className="mb-4">
//             <label className="block mb-2 text-gray-700">Rating</label>
//             <div className="flex">
//               {[1, 2, 3, 4, 5].map((num) => (
//                 <Star
//                   key={num}
//                   onClick={() => setSelectedRating(num)}
//                   className={`cursor-pointer ${
//                     selectedRating && selectedRating >= num
//                       ? "text-yellow-400 fill-current"
//                       : "text-gray-300"
//                   }`}
//                 />
//               ))}
//             </div>
//           </div>
//           <textarea
//             className="w-full border rounded-lg p-3 text-gray-700"
//             rows="4"
//             placeholder="Write your review"
//             value={reviewText}
//             onChange={(e) => setReviewText(e.target.value)}
//           />
//           <button
//             onClick={handleSubmitReview}
//             className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
//             Submit Review
//           </button>
//         </div>

//         {/* Existing Reviews */}
//         <div>
//           <h3 className="text-xl font-medium mb-6">Customer Reviews</h3>
//           {businessData.reviews.map((review, index) => (
//             <div key={index} className="border-t pt-6">
//               <div className="flex items-center mb-4">
//                 <img
//                   src="/api/placeholder/40/40"
//                   alt="Reviewer"
//                   className="w-10 h-10 rounded-full mr-4"
//                 />
//                 <div>
//                   <h4 className="font-semibold">{review.name}</h4>
//                   <div className="flex">
//                     {[...Array(review.rating)].map((_, i) => (
//                       <Star
//                         key={i}
//                         className="text-yellow-400 fill-current"
//                         size={16}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>
//               <p className="text-gray-600">{review.text}</p>
//               <span className="text-sm text-gray-500">{review.date}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SingleBusinessPage;
import React, { useState } from "react";
import {
  MapPin,
  Mail,
  Phone,
  Star,
  Share2,
  Flag,
  MessageCircle,
  DollarSign,
  Calendar,
  Users,
  Briefcase,
  Globe,
  User,
  Building2,
  Clock,
  ShieldCheck,
  BadgeInfo,
} from "lucide-react";

const SingleBusinessPage = () => {
  const [selectedRating, setSelectedRating] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [isContactVisible, setIsContactVisible] = useState(false);

  const businessData = {
    name: "A.K Fashion Designer",
    address: "No 2, Bolaji street, Alausa, Ikeja, Lagos",
    businessId: "0140",
    contact: "09162035090",
    email: "akfashion@example.com",
    website: "www.akfashiondesigner.com",
    established: "23 Apr 2012",
    founder: "Mr. Babatunde Abduakim (CEO)",
    rating: 5,
    category: ["Fashion Design", "Artists"],
    businessType: "Private Limited Company",
    businessLine: "Services",
    registrationNumber: "Not Specified",
    tinNumber: "Not Specified",
    taxRegistered: false,
    nearestBusStop: "Alausa Bus/stop",
    landmark: "Testing Ground",
    operatingHours: "8am- 10pm",
    staffCount: "1-10",
    services: "Fashion Design",
    targetAudience: "General Public",
    annualRevenue: "$50,000 - $100,000",
    staffList: [
      { name: "Mr. Tunde", position: "Manager" },
      { name: "Mr. Babatunde", position: "CEO" },
    ],
    reviews: [
      {
        name: "Peter Chidubem Uche",
        rating: 5,
        text: "awesome!",
        date: "10 Feb 2025",
      },
    ],
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: businessData.name,
          text: `Check out ${businessData.name} - ${businessData.services}`,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert("Business link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleSubmitReview = () => {
    if (!selectedRating || !reviewText.trim()) {
      alert("Please provide both rating and review text");
      return;
    }
    console.log("Submitting review", {
      rating: selectedRating,
      review: reviewText,
    });
    setSelectedRating(null);
    setReviewText("");
  };

  const toggleContactVisibility = () => {
    setIsContactVisible(!isContactVisible);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      {/* Business Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl shadow-2xl text-white overflow-hidden">
        <div className="p-8 flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-white/10 flex items-center justify-center">
                <Building2 size={40} className="text-white/80" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">{businessData.name}</h1>
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${i < businessData.rating ? "text-yellow-400 fill-current" : "text-white/30"}`}
                    />
                  ))}
                  <span className="ml-3 text-white/80">
                    ({businessData.reviews.length} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-pink-200" />
                <span>{businessData.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-green-200" />
                <span>{businessData.operatingHours}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-all">
              <Share2 size={20} />
              Share Business
            </button>
            <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-all">
              <MessageCircle size={20} />
              Send Message
            </button>
            <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-all">
              <Flag size={20} />
              Report
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Contact Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Mail className="text-blue-600" />
              Contact Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                <Phone className="w-6 h-6 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium">
                    {isContactVisible ? businessData.contact : "••••••••••"}
                  </p>
                </div>
                <button
                  onClick={toggleContactVisibility}
                  className="text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg transition-colors">
                  {isContactVisible ? "Hide" : "Show"}
                </button>
              </div>

              {/* Similar blocks for Email and Website */}
            </div>
          </div>

          {/* Business Details Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <BadgeInfo className="text-purple-600" />
              Business Overview
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <DetailItem
                  icon={<Calendar className="w-6 h-6 text-orange-500" />}
                  label="Established Date"
                  value={businessData.established}
                />
                <DetailItem
                  icon={<Users className="w-6 h-6 text-green-500" />}
                  label="Staff Count"
                  value={businessData.staffCount}
                />
              </div>
              <div className="space-y-4">
                <DetailItem
                  icon={<DollarSign className="w-6 h-6 text-blue-500" />}
                  label="Annual Revenue"
                  value={businessData.annualRevenue}
                />
                <DetailItem
                  icon={<ShieldCheck className="w-6 h-6 text-red-500" />}
                  label="Business Type"
                  value={businessData.businessType}
                />
              </div>
            </div>
          </div>

          {/* Staff Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Users className="text-purple-600" />
              Team Members
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {businessData.staffList.map((staff, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{staff.name}</h3>
                    <p className="text-sm text-gray-500">{staff.position}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Review Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Star className="text-yellow-500 fill-current" />
              Leave a Review
            </h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <Star
                    key={num}
                    onClick={() => setSelectedRating(num)}
                    className={`w-8 h-8 cursor-pointer transition-transform hover:scale-110 ${
                      selectedRating && selectedRating >= num
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <textarea
                className="w-full border rounded-xl p-4 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                rows="4"
                placeholder="Share your experience..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
              <button
                onClick={handleSubmitReview}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors font-semibold">
                Submit Review
              </button>
            </div>
          </div>

          {/* Existing Reviews */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MessageCircle className="text-green-600" />
              Customer Reviews
            </h2>
            <div className="space-y-6">
              {businessData.reviews.map((review, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <User className="text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{review.name}</h4>
                      <div className="flex items-center gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">{review.text}</p>
                  <span className="text-sm text-gray-500 mt-2 block">
                    {review.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 rounded-lg bg-opacity-20 bg-current flex items-center justify-center">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

export default SingleBusinessPage;
