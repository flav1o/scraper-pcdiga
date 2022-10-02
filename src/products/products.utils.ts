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
    ])
    .exec();
};
