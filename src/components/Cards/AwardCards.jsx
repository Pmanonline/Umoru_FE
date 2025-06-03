// import React from "react";
// import awardImage1 from "../../assets/images/awardImage1.png";
// import awardImage2 from "../../assets/images/awardImage2.png";
// import awardImage3 from "../../assets/images/awardImage3.png";

// const AwardCard1 = () => {
//   return (
//     <div className="bg-white rounded-lg overflow-hidden shadow-md">
//       <img
//         src={awardImage1}
//         alt="awardImage"
//         className="w-full h-48 sm:h-56 lg:h-[18rem] object-cover"
//       />
//       <div className="p-4">
//         <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0">
//           <div>
//             <h3 className="font-bold text-sm sm:text-md">Mrs John James</h3>
//           </div>
//           <div className="text-xs bg-[#f2fff2] p-2 rounded-lg">
//             The Morning Emergency <br /> Services Award
//           </div>
//         </div>
//         <p className="text-gray-600 text-sm mt-4">
//           Ornallis Sed ut vulputate nisi. Integer in felis sed leo vestibulum
//           venenatis. Curabitur tempor qua eros tempus lacinia. Nam bi
//         </p>
//       </div>
//     </div>
//   );
// };

// const AwardCard2 = () => {
//   return (
//     <div className="bg-white rounded-lg overflow-hidden shadow-md flex flex-col sm:flex-row">
//       <img
//         src={awardImage2}
//         alt="award image"
//         className="w-full sm:w-1/2 h-48 sm:h-auto object-cover"
//       />
//       <div className="p-4 flex flex-col justify-between w-full sm:w-1/2">
//         <div className="text-xs bg-[#f2fff2] p-2 rounded-lg mb-2">
//           The Morning Emergency <br /> Services Award
//         </div>
//         <div>
//           <h3 className="font-bold text-sm sm:text-md mb-2">Mrs John James</h3>
//           <p className="text-gray-600 text-sm">
//             Ornallis Sed ut vulputate nisi. Integer in felis sed leo vestibulum
//             venenatis. Curabitur tempor qua eros tempus lacinia. Nam bi
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const AwardCard3 = () => {
//   return (
//     <div className="bg-white rounded-lg overflow-hidden shadow-md flex flex-col sm:flex-row">
//       <img
//         src={awardImage3}
//         alt="award image"
//         className="w-full sm:w-1/2 h-48 sm:h-auto object-cover"
//       />
//       <div className="p-4 flex flex-col justify-between w-full sm:w-1/2">
//         <div className="text-xs bg-[#f2fff2] p-2 rounded-lg mb-2">
//           The Morning Emergency <br /> Services Award
//         </div>
//         <div>
//           <h3 className="font-bold text-sm sm:text-md mb-2">Mrs John James</h3>
//           <p className="text-gray-600 text-sm">
//             Ornallis Sed ut vulputate nisi. Integer in felis sed leo vestibulum
//             venenatis. Curabitur tempor qua eros tempus lacinia. Nam bi
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const AwardCards = () => {
//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//       <div>
//         <AwardCard1 />
//       </div>
//       <div className="space-y-6">
//         <AwardCard2 />
//         <AwardCard3 />
//       </div>
//     </div>
//   );
// };

// export default AwardCards;
import React from "react";
import awardsData from "../../assets/json/awardData.json";
import awardImage1 from "../../assets/images/awardImage1.png";
import awardImage2 from "../../assets/images/awardImage2.png";
import awardImage3 from "../../assets/images/awardImage3.png";

// Map JSON image paths to imported images
const imageMap = {
  "/path/to/awardImage1.png": awardImage1,
  "/path/to/awardImage2.png": awardImage2,
  "/path/to/awardImage3.png": awardImage3,
};

// Single reusable AwardCard component
const AwardCard = ({
  id,
  image,
  name,
  award,
  description,
  variant = "vertical",
}) => {
  const isHorizontal = variant === "horizontal";

  return (
    <div
      className={`bg-white rounded-lg overflow-hidden shadow-md ${
        isHorizontal ? "flex flex-col sm:flex-row" : ""
      }`}>
      <img
        src={imageMap[image]} // Use the image map to resolve the image
        alt="award image"
        className={`w-full ${
          isHorizontal ? "sm:w-1/2 h-48 sm:h-auto" : "h-48 sm:h-56 lg:h-[18rem]"
        } object-cover`}
      />
      <div
        className={`p-4 ${
          isHorizontal ? "flex flex-col justify-between w-full sm:w-1/2" : ""
        }`}>
        <div
          className={`text-xs bg-[#f2fff2] p-2 rounded-lg ${
            isHorizontal ? "mb-2" : ""
          }`}>
          {award}
        </div>
        <div className={isHorizontal ? "" : "mt-4"}>
          <h3 className="font-bold text-sm sm:text-md mb-2">{name}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
};

const AwardCards = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        {/* First card uses vertical layout */}
        <AwardCard {...awardsData[0]} variant="vertical" />
      </div>
      <div className="space-y-6">
        {/* Second and third cards use horizontal layout */}
        <AwardCard {...awardsData[1]} variant="horizontal" />
        <AwardCard {...awardsData[2]} variant="horizontal" />
      </div>
    </div>
  );
};

export default AwardCards;
