import { Notification } from "@libs/types";
import { FunctionComponent } from "react";
import { RiUserFollowFill } from "react-icons/ri";
import { FcLike, FcComments } from "react-icons/fc";
import { BsClockHistory } from "react-icons/bs";
import Image from "next/image";
import classNames from "classnames";
import router from "next/router";
import axios from "axios";
import useSWR from "swr";
import timeSince from "@libs/timeSince";
const NotificationCard: FunctionComponent<{ notification: Notification }> = ({
  notification: {
    _id,
    read,
    createdAt,
    entityId,
    notificationType,
    userFrom: { name, profilePicture },
  },
}) => {
  const { mutate: unreadNotificationMutate } = useSWR("/api/notifications?unreadOnly");

  let redirectRouteOnClick: string, notificationText: string;
  if (notificationType === "comment") {
    notificationText = `${name} commented on your post`;
    redirectRouteOnClick = `/tweet/${entityId}`;
  } else if (notificationType === "like") {
    notificationText = `${name} liked on your post`;
    redirectRouteOnClick = `/tweet/${entityId}`;
  } else if (notificationType === "follow") {
    notificationText = `${name} started following you`;
    redirectRouteOnClick = `/user/${entityId}`;
  }

  const handleClick = () => {
    // mark as read and redirect to entity id
    axios(`/api/notifications/${_id}`, {
      method: "PUT",
    });
    router.push(redirectRouteOnClick);
    unreadNotificationMutate();
  };

  return (
    <div
      onClick={handleClick}
      className={classNames(
        "flex items-center w-full p-3 px-4  rounded-md shadow-sm cursor-pointer bg-dark-600",
        { "opacity-70 ": read }
      )}
    >
      <div className="flex items-center space-x-6">
        {notificationType === "follow" && <RiUserFollowFill size={25} className="text-pink-600" />}
        {notificationType === "like" && <FcLike size={25} />}
        {notificationType === "comment" && <FcComments size={25} />}
        <div>
          <Image src={profilePicture} height={40} width={40} className="rounded-full" alt=""/>
        </div>

        <span>{notificationText}</span>
      </div>
      <div className="flex items-center flex-shrink-0 ml-auto space-x-2">
        <BsClockHistory size="14" className="hidden md:block" />
        <span className="ml-auto">{timeSince(new Date(createdAt))} ago</span>
      </div>
    </div>
  );
};

export default NotificationCard;
