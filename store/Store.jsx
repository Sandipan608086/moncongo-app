import { configureStore } from "@reduxjs/toolkit";
import businessSlices from "./business/BusinessCategorySlices";
import businessSubCategorySlices from "./business/BusinessSubCategorySlices";
import businessListSlices from "./business/BusinessListSlices";
import businessDetailsSlices from "./business/BusinessDetailsSlices";
import searchListSlices from "./business/BusinessCategorySlices";
import announcementsSlices from "./AnnouncementsSlices";
import promotionSlices from "./PromotionsSlices";
import eventSlices from "./EventsSlices";
import horoscopeSlices from "./HoroscopeSlices";
import newsSlices from "./NewsSlices";
import tendersSlices from "./TendersSlices";
import jobsSlices from "./JobsSlices";
import couponsSlices from "./CouponsSlices";
import autoSlices from "./AutoSlices";
import propertySlices from "./PropertySlices";
import OtherSlices from "./OtherSlices";
import UserSlices from "./UserSlices";
import SettingSlices from "./SettingSlices";
import NotificationSlices from "./NotificationSlices";

const store = configureStore({
    reducer: {
        business: businessSlices,
        subcategoryapi: businessSubCategorySlices,
        businesslistdata: businessListSlices,
        businessDetails: businessDetailsSlices,
        search: searchListSlices,
        announcement: announcementsSlices,
        promotion: promotionSlices,
        events: eventSlices,
        horoscopes: horoscopeSlices,
        news: newsSlices,
        tender: tendersSlices,
        job: jobsSlices,
        coupon: couponsSlices,
        auto: autoSlices,
        property: propertySlices,
        other: OtherSlices,
        user: UserSlices,
        setting: SettingSlices,
        notification: NotificationSlices
    }
})

export default store;