import { HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Success } from 'src/common/types.gql';
import { CurrUser } from 'src/modules/auth/types';
import { ProductService } from 'src/modules/products/products.service';
import { RabbitMqService } from 'src/modules/thirdparty/rabbitmq/rabbitmq.service';
import { GqlAuthGuard } from '../../auth/guards/super.guard';
import { OnWatchService } from '../on-watch.service';
import { AddOnWatch } from './types/on-watch.inputs';
import { ProductsWatchList } from './types/on-watch.ouputs';

@Resolver('OnWatch')
export class OnWatchResolver {
  constructor(
    private readonly onWatchService: OnWatchService,
    private readonly productsService: ProductService,
    private readonly rabbitmq: RabbitMqService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @UseGuards(GqlAuthGuard('jwt'))
  @Mutation(() => Success)
  async addOnWatch(
    @Args('input') { productId, targetPrice }: AddOnWatch,
    @CurrentUser() currUser: CurrUser,
  ): Promise<Success> {
    const product = await this.productsService.getProduct(productId);

    if (!product) {
      throw new HttpException(
        'on_watch.invalid_product_id',
        HttpStatus.BAD_REQUEST,
      );
    }

    const inserted = await this.onWatchService.addOnWatch(
      productId,
      currUser.userId,
      targetPrice,
    );

    if (!inserted) {
      throw new HttpException(
        'on_watch.could_not_add',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    this.eventEmitter.emit('on_watch.scrape', {
      userId: currUser.userId,
      productId: product.productId,
      url: product.url,
      company: 'PC_DIGA',
    });

    return {
      success: true,
      message: 'on_watch.product_added',
    };
  }

  @UseGuards(GqlAuthGuard('jwt'))
  @Mutation(() => Success)
  async removeOnWatch(
    @Args('productId') productId: string,
    @CurrentUser() currUser: CurrUser,
  ): Promise<Success> {
    const removed = await this.onWatchService.removeOnWatch(
      productId,
      currUser.userId,
    );

    if (!removed) {
      throw new HttpException(
        'on_watch.could_not_remove',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { success: true, message: 'on_watch.product_removed' };
  }

  @UseGuards(GqlAuthGuard('jwt'))
  @Query(() => [ProductsWatchList])
  async myWatchList(@CurrentUser() currUser: CurrUser) {
    const products = await this.onWatchService.getOnWatchByUser(
      currUser.userId,
    );

    return products;
  }

  @UseGuards(GqlAuthGuard('jwt'))
  @Query(() => Boolean)
  async checkIsOnWatch(
    @Args('productId') productId: string,
    @CurrentUser() currentUser: CurrUser,
  ) {
    const product = await this.onWatchService.isProductOnUserWatchList(
      productId,
      currentUser.userId,
    );

    return !!product;
  }
}
