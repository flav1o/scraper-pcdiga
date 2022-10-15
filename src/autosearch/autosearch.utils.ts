import { Model } from 'mongoose';
import { ProductAutoSearch } from 'src/graphql-schema';

export const findProductsToSearch = async (
  autoSearchModel: Model<ProductAutoSearch>,
) => {
  return await autoSearchModel.aggregate([
    {
      $lookup: {
        from: 'products',
        localField: 'url',
        foreignField: 'url',
        as: 'product',
      },
    },
    {
      $match: {
        $expr: {
          $and: [
            { $eq: ['$isActive', true] },
            {
              $lt: [
                '$product.updatedAt',
                new Date(Date.now() - 24 * 60 * 60 * 1000),
              ],
            },
          ],
        },
      },
    },
    {
      $project: {
        _id: 0,

        url: 1,
      },
    },
  ]);
};
