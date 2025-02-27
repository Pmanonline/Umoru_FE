// import React from "react";
// import { Grid, Paper, Typography } from "@mui/material";
// import {
//   AccountBalance as FinanceIcon,
//   TheaterComedy as EntertainmentIcon,
//   Brush as BeautyIcon,
//   Campaign as CommunicationIcon,
//   HomeWork as ConstructionIcon,
//   DirectionsCar as AutoIcon,
//   LocalHospital as HealthIcon,
//   Apartment as GovernmentIcon,
//   School as EducationIcon,
//   House as HomeIcon,
//   Computer as ITIcon,
//   Gavel as LegalIcon,
//   Restaurant as RestaurantIcon,
//   Business as BusinessIcon,
//   Engineering as EngineeringIcon,
//   Movie as MediaIcon,
//   Construction as ManufacturingIcon,
//   SchoolOutlined as TrainingIcon,
//   Casino as GamesIcon,
//   Pets as PetIcon,
//   SportsBaseball as SportsIcon,
//   Spa as SpaIcon,
//   Hotel as TravelIcon,
//   Checkroom as ApparelIcon,
//   LocalMall as RetailIcon,
//   Place as CommunityIcon,
//   Tv as RentalIcon,
//   ShoppingCart as ShoppingIcon,
//   LocalShipping as TransportIcon,
//   CleaningServices as NonProfitIcon,
// } from "@mui/icons-material";

// const categories = [
//   { icon: <FinanceIcon />, title: "Accounting & Finance" },
//   { icon: <EntertainmentIcon />, title: "Arts & Entertainment" },
//   { icon: <BeautyIcon />, title: "Beauty & Fashion" },
//   { icon: <CommunicationIcon />, title: "Communication" },
//   { icon: <ConstructionIcon />, title: "Construction & Housing" },
//   { icon: <AutoIcon />, title: "Auto Services" },
//   { icon: <HealthIcon />, title: "Health" },
//   { icon: <GovernmentIcon />, title: "Government" },
//   { icon: <EducationIcon />, title: "Education" },
//   { icon: <HomeIcon />, title: "Home & Garden" },
//   { icon: <ITIcon />, title: "IT & Computers" },
//   { icon: <LegalIcon />, title: "Legal Services" },
//   { icon: <RestaurantIcon />, title: "Restaurants" },
//   { icon: <BusinessIcon />, title: "Business Services" },
//   { icon: <EngineeringIcon />, title: "Engineering" },
//   { icon: <MediaIcon />, title: "Media" },
//   { icon: <ManufacturingIcon />, title: "Manufacturing" },
//   { icon: <TrainingIcon />, title: "Education & Training" },
//   { icon: <GamesIcon />, title: "Games" },
//   { icon: <PetIcon />, title: "Pet Supply" },
//   { icon: <SportsIcon />, title: "Sports" },
//   { icon: <SpaIcon />, title: "Personal Care" },
//   { icon: <TravelIcon />, title: "Travel & Hospitality" },
//   { icon: <ApparelIcon />, title: "Apparel & Clothing" },
//   { icon: <RetailIcon />, title: "Retail & Restaurant" },
//   { icon: <CommunityIcon />, title: "Community" },
//   { icon: <RentalIcon />, title: "Private Rental" },
//   { icon: <ShoppingIcon />, title: "Shopping" },
//   { icon: <TransportIcon />, title: "Transportation" },
//   { icon: <NonProfitIcon />, title: "Non-Profit Organization" },
// ];

// const TopBusinessCards = () => {
//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       <Typography
//         variant="h4"
//         align="center"
//         gutterBottom
//         sx={{ fontWeight: "bold", mb: 6 }}>
//         Top Business Categories
//       </Typography>
//       <Grid container spacing={3}>
//         {categories.map((category, index) => (
//           <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
//             <Paper
//               elevation={3}
//               sx={{
//                 p: 3,
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 textAlign: "center",
//                 height: "100%",
//                 transition: "transform 0.3s, box-shadow 0.3s",
//                 "&:hover": {
//                   transform: "scale(1.05)",
//                   boxShadow: 6,
//                 },
//               }}>
//               {React.cloneElement(category.icon, {
//                 sx: { fontSize: "2.5rem", color: "primary.main", mb: 2 },
//               })}
//               <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
//                 {category.title}
//               </Typography>
//             </Paper>
//           </Grid>
//         ))}
//       </Grid>
//     </div>
//   );
// };

// export default TopBusinessCards;
import React from "react";
import { Grid, Paper, Typography } from "@mui/material";
import {
  AccountBalance as FinanceIcon,
  TheaterComedy as EntertainmentIcon,
  Brush as BeautyIcon,
  Campaign as CommunicationIcon,
  HomeWork as ConstructionIcon,
  DirectionsCar as AutoIcon,
  LocalHospital as HealthIcon,
  Apartment as GovernmentIcon,
  School as EducationIcon,
  House as HomeIcon,
  Computer as ITIcon,
  Gavel as LegalIcon,
  Restaurant as RestaurantIcon,
  Business as BusinessIcon,
  Engineering as EngineeringIcon,
  Movie as MediaIcon,
  Construction as ManufacturingIcon,
  SchoolOutlined as TrainingIcon,
  Casino as GamesIcon,
  Pets as PetIcon,
  SportsBaseball as SportsIcon,
  Spa as SpaIcon,
  Hotel as TravelIcon,
  Checkroom as ApparelIcon,
  LocalMall as RetailIcon,
  Place as CommunityIcon,
  Tv as RentalIcon,
  ShoppingCart as ShoppingIcon,
  LocalShipping as TransportIcon,
  CleaningServices as NonProfitIcon,
} from "@mui/icons-material";

const categories = [
  { icon: <FinanceIcon />, title: "Accounting & Finance" },
  { icon: <EntertainmentIcon />, title: "Arts & Entertainment" },
  { icon: <BeautyIcon />, title: "Beauty & Fashion" },
  { icon: <CommunicationIcon />, title: "Communication" },
  { icon: <ConstructionIcon />, title: "Construction & Housing" },
  { icon: <AutoIcon />, title: "Auto Services" },
  { icon: <HealthIcon />, title: "Health" },
  { icon: <GovernmentIcon />, title: "Government" },
  { icon: <EducationIcon />, title: "Education" },
  { icon: <HomeIcon />, title: "Home & Garden" },
  { icon: <ITIcon />, title: "IT & Computers" },
  { icon: <LegalIcon />, title: "Legal Services" },
  { icon: <RestaurantIcon />, title: "Restaurants" },
  { icon: <BusinessIcon />, title: "Business Services" },
  { icon: <EngineeringIcon />, title: "Engineering" },
  { icon: <MediaIcon />, title: "Media" },
  { icon: <ManufacturingIcon />, title: "Manufacturing" },
  { icon: <TrainingIcon />, title: "Education & Training" },
  { icon: <GamesIcon />, title: "Games" },
  { icon: <PetIcon />, title: "Pet Supply" },
  { icon: <SportsIcon />, title: "Sports" },
  { icon: <SpaIcon />, title: "Personal Care" },
  { icon: <TravelIcon />, title: "Travel & Hospitality" },
  { icon: <ApparelIcon />, title: "Apparel & Clothing" },
  { icon: <RetailIcon />, title: "Retail & Restaurant" },
  { icon: <CommunityIcon />, title: "Community" },
  { icon: <RentalIcon />, title: "Private Rental" },
  { icon: <ShoppingIcon />, title: "Shopping" },
  { icon: <TransportIcon />, title: "Transportation" },
  { icon: <NonProfitIcon />, title: "Non-Profit Organization" },
];

const TopBusinessCards = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontWeight: "bold",
          mb: { xs: 4, sm: 6 },
          fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
        }}>
        Top Business Categories
      </Typography>
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {categories.map((category, index) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
            <Paper
              elevation={3}
              sx={{
                p: { xs: 2, sm: 3 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                height: "100%",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: 6,
                },
                borderRadius: 2,
              }}>
              {React.cloneElement(category.icon, {
                sx: {
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "2.75rem" },
                  color: "primary.main",
                  mb: { xs: 1, sm: 2 },
                },
              })}
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "medium",
                  fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },
                  lineHeight: 1.2,
                }}>
                {category.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default TopBusinessCards;
