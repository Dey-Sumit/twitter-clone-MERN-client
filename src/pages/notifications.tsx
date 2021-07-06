import NotificationCard from "@components/NotificationCard";
import Trends from "@components/Trends";
import People from "@components/People";

import { Notification } from "@libs/types";
import useSWR from "swr";
import NotificationSkeleton from "@components/skeletons/CustomSkeleton";

const Notifications = () => {
  const { data: notifications, error, isValidating } = useSWR<Notification[]>("/api/notifications");

  return (
    <div className="grid grid-cols-8 gap-x-8 ">
      <div className="col-span-8 md:col-span-5 ">
        <div className="h-[90vh] overflow-y-auto">
          <h1 className="my-4 text-xl">Notifications</h1>
          {!error &&
            !notifications &&
            isValidating &&
            [...Array(10)].map((_, i) => <NotificationSkeleton key={i} />)}

          <div className="flex flex-col space-y-3">
            {notifications?.map((notification) => (
              <NotificationCard notification={notification} key={notification._id} />
            ))}
          </div>
        </div>
      </div>
      <div className="hidden col-span-8 py-4 space-y-4 md:col-span-3 md:block">
        <Trends noOfElements={5} />
        <People noOfElements={5} />
      </div>
    </div>
  );
};

export default Notifications;
