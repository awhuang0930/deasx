// 'use strict'
// import { RestClient } from '../RestClient';

// export const HomePageGqlSchema =
// `
//   extend type Query {
//    homepage_firstload : HomePage_FirstLoad
//   }
// `;

// export const HomePageGqlResolvers = {
//   Query: {
//     homepage_firstload: async (root:any, args:any) => {
//       const productUri = RestClient.RestUriBase + '/entityapi/Product/definedquery';
//       console.log(productUri);

//       console.log('allan test 001');

//       const temp_products = await RestClient.Query(productUri, { 'Action': "homepage_feature"});
//       console.log('allan test temp_product:' + temp_products.length)
//       if ( temp_products.length == 15) console.log(temp_products);
//       let display_products = temp_products
//       .map( (prod: any) => ({
//           ...prod,
//           objectID : prod.id,
//           type : prod.topCatName,
//           product_code : prod.sku
//         })
//       );

//       // const reduced_display_products = display_products.reduce((acc:any, curr:any) => {
//       //   curr.thumb ='';
//       //   if(!acc[curr.type]) acc[curr.type] = []; //If this type wasn't previously stored
//       //   acc[curr.type].push(curr);
//       //   return acc;
//       // },{});

//       console.log('allan test 002');

//       let promote_products = (await RestClient.Query(productUri, {'Action': "homepage_sale"}))
//       .map( (prod: any) => (
//         {
//           ...prod,
//           objectID : prod.id,
//           type : prod.topCatName,
//           product_code : prod.sku
//         })
//       );

//       const bannerUri = RestClient.RestUriBase + '/entityapi/Banner/definedquery';
//       let topBanners = (await RestClient.Query(bannerUri, {'Action':'find_position_banner', 'StoreId':1, 'Position':'top'}));

//       console.log('allan test 003');

//       const categoryUri = RestClient.RestUriBase + '/entityapi/Category/definedquery';
//       let popularCategories = (await RestClient.Query(categoryUri, {'Action':'find_popular_category', 'NumberOfItems':6}))
//       .map((cat: any) => ({
//         id : cat.id,
//         title : cat.name,
//         image : cat.picture,
//         parentCategoryId: cat.parentCategoryId,
//         displayOrder : cat.displayOrder,
//         showOnHomepage : cat.showOnHomepage,
//         url : 'needToGet' + '/category/' + cat.id
//       }));

//       return {
//         promoteProducts : promote_products,
//         //displayProducts : display_products,
//         topBanners : topBanners,
//         popularCategories : popularCategories
//       };
//     }
//   }
// };

