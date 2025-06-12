import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ADD_ON_WATCH, REMOVE_ON_WATCH, GET_PRODUCTS_ON_WATCH } from "@/graphql";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { BellIcon, BellOffIcon } from "lucide-react";

interface PriceAlertProps {
  productId: string;
  currentPrice?: number;
  forceShowSetting?: boolean;
  onPriceAlertSet?: () => void;
  onCancel?: () => void;
}

interface WatchListItem {
  watchId: string;
  targetPrice?: number;
  product: {
    productId: string;
  };
}

export const PriceAlert: React.FC<PriceAlertProps> = ({ 
  productId, 
  currentPrice, 
  forceShowSetting = false,
  onPriceAlertSet,
  onCancel
}) => {
  const { t } = useTranslation();
  const [targetPrice, setTargetPrice] = useState<string>("");
  const [isSettingAlert, setIsSettingAlert] = useState(forceShowSetting);

  // Update isSettingAlert when forceShowSetting changes
  useEffect(() => {
    setIsSettingAlert(forceShowSetting);
  }, [forceShowSetting]);

  const { data: watchListData, refetch: refetchWatchList } = useQuery<{
    myWatchList: WatchListItem[];
  }>(GET_PRODUCTS_ON_WATCH, {
    errorPolicy: 'all',
    onError: (error) => {
      console.log('Error fetching watch list:', error);
    }
  });

  // Find the watch list item for this product
  const existingWatch = watchListData?.myWatchList?.find(
    item => item.product.productId === productId
  );

  const [addToWatchWithPrice, { loading: settingAlert }] = useMutation(ADD_ON_WATCH, {
    onCompleted: () => {
      toast.success(t("price_alert.alert_set"));
      refetchWatchList();
      setIsSettingAlert(false);
      setTargetPrice("");
      // Call the callback to update parent state
      onPriceAlertSet?.();
    },
    onError: (error) => {
      toast.error(t("price_alert.error_setting_alert"));
      console.error("Error setting price alert:", error);
    },
  });

  const [removeFromWatch, { loading: removingAlert }] = useMutation(REMOVE_ON_WATCH, {
    variables: { productId },
    onCompleted: () => {
      toast.success(t("price_alert.alert_removed"));
      refetchWatchList();
    },
    onError: (error) => {
      toast.error(t("price_alert.error_removing_alert"));
      console.error("Error removing from watch:", error);
    },
  });

  const handleSetAlert = () => {
    const price = parseFloat(targetPrice);
    
    if (isNaN(price) || price <= 0) {
      toast.error(t("price_alert.invalid_price"));
      return;
    }

    if (currentPrice && price >= currentPrice) {
      toast.error(t("price_alert.price_too_high"));
      return;
    }

    addToWatchWithPrice({
      variables: {
        input: {
          productId,
          targetPrice: price,
        },
      },
    });
  };

  const handleRemoveAlert = () => {
    removeFromWatch();
  };

  const handleCancelSetting = () => {
    setIsSettingAlert(false);
    setTargetPrice("");
    // Call the cancel callback
    onCancel?.();
  };

  // Set default target price suggestion based on current price
  useEffect(() => {
    if (currentPrice && !targetPrice && isSettingAlert) {
      // Suggest 10% lower than current price
      const suggestedPrice = Math.round((currentPrice * 0.9) * 100) / 100;
      setTargetPrice(suggestedPrice.toString());
    }
  }, [currentPrice, isSettingAlert, targetPrice]);

  // If forceShowSetting is true, always show the setting interface
  if (forceShowSetting || (isSettingAlert && !existingWatch)) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <BellIcon className="h-4 w-4 text-blue-600" />
            {t("price_alert.set_price_alert")}
          </CardTitle>
          <CardDescription className="text-xs">
            {t("price_alert.enter_target_price")}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div>
            <Label htmlFor="target-price" className="text-xs">
              {t("price_alert.target_price")}
            </Label>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-medium">€</span>
              <Input
                id="target-price"
                type="number"
                step="0.01"
                min="0"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="0.00"
                className="text-sm"
              />
            </div>
            {currentPrice && (
              <p className="text-xs text-gray-500 mt-1">
                {t("price_alert.current_price")}: €{currentPrice.toFixed(2)}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSetAlert}
              disabled={settingAlert || !targetPrice}
              size="sm"
              className="text-xs flex-1"
            >
              {settingAlert ? t("price_alert.setting") : t("price_alert.set_alert")}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancelSetting}
              size="sm"
              className="text-xs"
            >
              {t("common.cancel")}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (existingWatch && existingWatch.targetPrice) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <BellIcon className="h-4 w-4 text-green-600" />
            {t("price_alert.active_alert")}
          </CardTitle>
          <CardDescription className="text-xs">
            {t("price_alert.will_notify_when_below")} €{existingWatch.targetPrice.toFixed(2)}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-600">
              {t("price_alert.watching_with_alert")}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemoveAlert}
              disabled={removingAlert}
              className="text-xs"
            >
              <BellOffIcon className="h-3 w-3 mr-1" />
              {removingAlert ? t("price_alert.removing") : t("price_alert.remove_alert")}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <BellOffIcon className="h-4 w-4 text-gray-400" />
          {t("price_alert.price_alerts")}
        </CardTitle>
        <CardDescription className="text-xs">
          {t("price_alert.get_notified_description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button
          onClick={() => setIsSettingAlert(true)}
          size="sm"
          className="w-full text-xs"
        >
          <BellIcon className="h-3 w-3 mr-1" />
          {t("price_alert.set_price_alert")}
        </Button>
      </CardContent>
    </Card>
  );
}; 