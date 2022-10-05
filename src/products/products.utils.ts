export const aggregateProductData = async (
  productModel: any,
  url: string,
  priceDate: Date,
) => {
  return await productModel
    .aggregate([
      {
        $match: {
          url,
        },
      },
      {
        $project: {
          _id: 1,
          url: 1,
          name: 1,
          productImage: 1,
          ean: 1,
          updatedAt: 1,
          prices: {
            $filter: {
              input: '$prices',
              as: 'price',
              cond: {
                $and: [
                  {
                    $eq: [
                      { $month: '$$price.createdAt' },
                      priceDate.getMonth() + 1,
                    ],
                  },
                  {
                    $eq: [
                      { $year: '$$price.createdAt' },
                      priceDate.getFullYear(),
                    ],
                  },
                ],
              },
            },
          },
        },
      },
      {
        $unwind: {
          path: '$prices',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          'prices.createdAt': -1,
        },
      },
      {
        $group: {
          _id: '$_id',
          productImage: { $first: '$productImage' },
          url: { $first: '$url' },
          name: { $first: '$name' },
          ean: { $first: '$ean' },
          updatedAt: { $first: '$updatedAt' },
          prices: { $push: '$prices' },
        },
      },
    ])
    .exec();
};
